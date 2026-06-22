import { type ComponentProps, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Cloudflare Turnstile の公式テストキー（常に成功）。本番は CF ビルド環境変数
// PUBLIC_TURNSTILE_SITE_KEY を設定すると差し替わる（コード変更不要 / 公開値なのでクライアント露出可）。
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Turnstile クライアント API の最小型（render のみ利用）。
interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// api.js を一度だけ読み込み、window.turnstile を解決する。
// E2E では addInitScript で window.turnstile を差し込むため、その場合は即解決する。
function ensureTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    );
    const onLoad = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile_unavailable"));
    };
    if (existing) {
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("turnstile_script_error")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("turnstile_script_error")),
      { once: true },
    );
    document.head.appendChild(script);
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "お名前を入力してください。";
  if (!email.trim()) errors.email = "メールアドレスを入力してください。";
  else if (!EMAIL_RE.test(email.trim()))
    errors.email = "メールアドレスの形式が正しくありません。";
  if (!message.trim()) errors.message = "本文を入力してください。";
  return errors;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const widgetRef = useRef<HTMLDivElement>(null);

  // Turnstile ウィジェットを描画し、トークン取得・失効をハンドリングする。
  useEffect(() => {
    let cancelled = false;
    ensureTurnstile()
      .then((turnstile) => {
        if (cancelled || !widgetRef.current) return;
        turnstile.render(widgetRef.current, {
          sitekey: SITE_KEY,
          callback: (t) => setToken(t),
          "error-callback": () => setToken(""),
          "expired-callback": () => setToken(""),
        });
      })
      .catch(() => {
        if (!cancelled)
          setFormError("認証ウィジェットの読み込みに失敗しました。");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event,
  ) => {
    event.preventDefault();
    setFormError("");

    const errors = validate(name, email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (!token) {
      setFormError(
        "送信前に「私はロボットではありません」認証を完了してください。",
      );
      return;
    }

    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          token,
        }),
      });
      if (res.ok) {
        setState("success");
        return;
      }
      setState("error");
      setFormError(
        res.status === 429
          ? "短時間に送信が集中しています。少し時間をおいて再度お試しください。"
          : "送信に失敗しました。お手数ですが時間をおいて再度お試しください。",
      );
    } catch {
      setState("error");
      setFormError(
        "送信に失敗しました。ネットワーク環境をご確認のうえ再度お試しください。",
      );
    }
  };

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-muted/30 p-6"
      >
        <p className="font-semibold text-foreground">送信が完了しました。</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          お問い合わせありがとうございます。通常 2〜3
          営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-foreground"
        >
          お名前 <span className="text-destructive">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {fieldErrors.name && (
          <p id="contact-name-error" className="text-sm text-destructive">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-foreground"
        >
          メールアドレス <span className="text-destructive">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={
            fieldErrors.email ? "contact-email-error" : undefined
          }
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {fieldErrors.email && (
          <p id="contact-email-error" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-foreground"
        >
          本文 <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {fieldErrors.message && (
          <p id="contact-message-error" className="text-sm text-destructive">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Turnstile ウィジェットの描画先 */}
      <div ref={widgetRef} data-testid="turnstile-widget" />

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "送信中…" : "送信する"}
      </Button>
    </form>
  );
}
