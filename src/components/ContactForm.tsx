import {
  type ComponentProps,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";

// Cloudflare Turnstile の公式テストキー（常に成功）。本番は CF ビルド環境変数
// PUBLIC_TURNSTILE_SITE_KEY を設定すると差し替わる（コード変更不要 / 公開値なのでクライアント露出可）。
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Turnstile クライアント API の最小型（render / reset のみ利用）。
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

/**
 * Turnstile ウィジェットの面倒を一手に引き受ける。
 * ウィジェットは入力・確認のどちらの画面でも同じ DOM ノードに描き続ける（呼び出し側で
 * containerRef の位置を変えていない）。確認画面で描き直さないのは、トークンの寿命が
 * 300 秒しかなく、期限切れの自動更新（render の既定 refresh-expired: auto）を
 * 効かせ続けるため。
 */
function useTurnstile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TurnstileApi | null>(null);
  const widgetIdRef = useRef("");
  const [token, setToken] = useState("");
  // 一度でもトークンを受け取ったか（未認証と期限切れで案内文を変えるため）
  const [issuedOnce, setIssuedOnce] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        apiRef.current = turnstile;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (t) => {
            setIssuedOnce(true);
            setToken(t);
          },
          "error-callback": () => setToken(""),
          "expired-callback": () => setToken(""),
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 認証をやり直す。トークンは 1 回しか使えないので、期限切れのときだけでなく
  // サーバーに届いたあとの失敗（Worker は送信前に検証を済ませている）でも取り直す
  const reset = useCallback(() => {
    setToken("");
    apiRef.current?.reset(widgetIdRef.current || undefined);
  }, []);

  return { containerRef, token, issuedOnce, loadFailed, reset };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 入力 → 確認 → 送信の 2 画面。送信そのものの進行は SubmitState が持つ。
type Step = "input" | "confirm";
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

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// Hero / 404 のボタン（px-6 py-2.5、実測 45px 高）と大きさを揃える。
// shadcn の既定 size は h-8 px-2.5 で、同じサイト内で押し心地が変わってしまう。
// 高さを px で固定せず余白で決めているのは、タイポスケール（PHASE1C-003）を
// 変えたときに Hero 側と一緒に追従させるため。縦の余白から 1px 引いているのは
// Button が透明の 1px 枠（focus 時の輪郭に使う）を持つぶんの相殺
const buttonClass = "h-auto px-6 py-[calc(0.625rem-1px)]";

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  type?: "text" | "email";
  autoComplete?: string;
  rows?: number;
  inputRef?: Ref<HTMLInputElement>;
}

/** ラベル + 入力欄 + エラー文の 1 組。rows を渡すと textarea になる。 */
function TextField({
  id,
  name,
  label,
  value,
  onValueChange,
  error,
  type = "text",
  autoComplete,
  rows,
  inputRef,
}: TextFieldProps) {
  const shared = {
    id,
    name,
    required: true,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: inputClass,
  };
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label} <span className="text-destructive">*</span>
      </label>
      {rows ? (
        <textarea
          {...shared}
          rows={rows}
          onChange={(e) => onValueChange(e.target.value)}
        />
      ) : (
        <input
          {...shared}
          ref={inputRef}
          type={type}
          autoComplete={autoComplete}
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface ConfirmPanelProps {
  name: string;
  email: string;
  message: string;
  headingRef: Ref<HTMLHeadingElement>;
}

/** 送る内容を読み取り専用で見せる確認画面。 */
function ConfirmPanel({ name, email, message, headingRef }: ConfirmPanelProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-card">
      {/* 焦点はこの見出しへ移す。読み上げ環境にも画面が切り替わったことが伝わる */}
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-semibold text-foreground outline-none"
      >
        この内容で送信します
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        直したいところがあれば「入力へ戻る」で書き直せます。
      </p>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">お名前</dt>
          <dd
            data-testid="confirm-name"
            className="mt-1 break-words text-foreground"
          >
            {name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            メールアドレス
          </dt>
          <dd
            data-testid="confirm-email"
            className="mt-1 break-all text-foreground"
          >
            {email}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">本文</dt>
          {/* 改行はそのまま見せる（届くメールも改行を保つ） */}
          <dd
            data-testid="confirm-message"
            className="mt-1 whitespace-pre-wrap break-words text-foreground"
          >
            {message}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [state, setState] = useState<SubmitState>("idle");
  const turnstile = useTurnstile();
  const successRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mountedRef = useRef(false);

  // 送信完了時にページ先頭へ戻し、完了パネルへ焦点を移す。
  // フォームは縦に長く、送信した位置のままだとスマホでフッターだけが見える状態になる。
  // 焦点移動は読み上げ環境にも完了パネルの位置を伝えるため（スクロールは
  // global.css の scroll-behavior に従い、視差効果を減らす設定では即時ジャンプ）
  useEffect(() => {
    if (state !== "success") return;
    // 焦点を先に、preventScroll 付きで移す。素の focus() はパネルが見える最小限だけ
    // 動かそうとして、直後の scrollTo と引っぱり合いになる（実測でスマホが 91px 残った）
    successRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [state]);

  // 画面が入力 ⇄ 確認で入れ替わったことを、目と焦点の両方に伝える。
  // 初回描画（step は input のまま）では何もしない——ページを開いただけで
  // フォームへスクロールしてしまうため
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const confirming = step === "confirm";
    (confirming ? headingRef : nameRef).current?.focus({ preventScroll: true });
    // 頭出しはフォーム単体ではなく見出しを含む節ごと（節の scroll-mt-20 が効く）。
    // フォームの上端に合わせると「お問い合わせフォーム」が sticky ヘッダーに隠れる。
    // behavior は渡さない（global.css の scroll-behavior に従わせ、視差効果を
    // 減らす設定では即時ジャンプになる。PostLayout の目次リンクと同じ考え方）
    const form = formRef.current;
    (form?.closest("section") ?? form)?.scrollIntoView({ block: "start" });
  }, [step]);

  const goConfirm = () => {
    setFormError("");
    const errors = validate(name, email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setState("idle");
    setStep("confirm");
  };

  const backToInput = () => {
    setFormError("");
    setState("idle");
    setStep("input");
  };

  const send = async () => {
    setFormError("");

    if (!turnstile.token) {
      // 確認画面に長く留まるとトークンが切れる。自動更新の待ち時間に当たった場合も
      // ここに来るので、黙って失敗させず取り直しを促す（ウィジェットは同じ画面にある）
      const expired = turnstile.issuedOnce;
      turnstile.reset();
      setFormError(
        expired
          ? "認証の有効期限が切れました。下の認証をやり直してから、もう一度送信してください。"
          : "送信前に「私はロボットではありません」認証を完了してください。",
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
          token: turnstile.token,
        }),
      });
      if (res.ok) {
        setState("success");
        return;
      }
      setState("error");
      turnstile.reset();
      setFormError(
        res.status === 429
          ? "短時間に送信が集中しています。少し時間をおいて再度お試しください。"
          : "送信に失敗しました。お手数ですが時間をおいて再度お試しください。",
      );
    } catch {
      setState("error");
      turnstile.reset();
      setFormError(
        "送信に失敗しました。ネットワーク環境をご確認のうえ再度お試しください。",
      );
    }
  };

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event,
  ) => {
    event.preventDefault();
    if (step === "input") goConfirm();
    else void send();
  };

  if (state === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-lg bg-card p-6 shadow-card outline-none"
      >
        <p className="font-semibold text-foreground">送信が完了しました。</p>
        <p className="mt-2 text-muted-foreground">
          お問い合わせありがとうございます。通常 2〜3
          営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  const notice =
    formError ||
    (turnstile.loadFailed ? "認証ウィジェットの読み込みに失敗しました。" : "");

  return (
    <form
      ref={formRef}
      className="mt-6 space-y-6"
      onSubmit={handleSubmit}
      noValidate
    >
      {step === "input" ? (
        <div className="space-y-6">
          <TextField
            id="contact-name"
            name="name"
            label="お名前"
            autoComplete="name"
            value={name}
            onValueChange={setName}
            error={fieldErrors.name}
            inputRef={nameRef}
          />
          <TextField
            id="contact-email"
            name="email"
            label="メールアドレス"
            type="email"
            autoComplete="email"
            value={email}
            onValueChange={setEmail}
            error={fieldErrors.email}
          />
          <TextField
            id="contact-message"
            name="message"
            label="本文"
            rows={6}
            value={message}
            onValueChange={setMessage}
            error={fieldErrors.message}
          />
        </div>
      ) : (
        <ConfirmPanel
          name={name.trim()}
          email={email.trim()}
          message={message.trim()}
          headingRef={headingRef}
        />
      )}

      {/* Turnstile ウィジェットの描画先（入力・確認で同じノードを使い回す） */}
      <div ref={turnstile.containerRef} data-testid="turnstile-widget" />

      {notice && (
        <p role="alert" className="text-sm text-destructive">
          {notice}
        </p>
      )}

      {step === "input" ? (
        <Button type="submit" className={buttonClass}>
          確認する
        </Button>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className={buttonClass}
            onClick={backToInput}
            disabled={state === "submitting"}
          >
            入力へ戻る
          </Button>
          <Button
            type="submit"
            className={buttonClass}
            disabled={state === "submitting"}
          >
            {state === "submitting" ? "送信中…" : "送信する"}
          </Button>
        </div>
      )}
    </form>
  );
}
