// Contact フォーム backend のロジック層。
// Worker エントリ（worker/index.ts）から分離し、外部 I/O（fetch）を引数で差し替えられる
// 純粋関数として書くことで Vitest 単体テスト可能にしている。

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  token: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  data?: ContactPayload;
}

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
// 厳密な RFC 準拠ではなく「空白なしの local@domain.tld」程度の存在チェック。
// 過剰に弾くと正当な送信を取りこぼすため緩めに留める（最終判定は実送信時のエラーで担保）。
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["invalid_body"] };
  }
  const obj = input as Record<string, unknown>;
  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  const message = typeof obj.message === "string" ? obj.message.trim() : "";
  const token = typeof obj.token === "string" ? obj.token : "";

  const errors: string[] = [];
  if (!name) errors.push("name_required");
  else if (name.length > MAX_NAME) errors.push("name_too_long");
  if (!email) errors.push("email_required");
  else if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    errors.push("email_invalid");
  }
  if (!message) errors.push("message_required");
  else if (message.length > MAX_MESSAGE) errors.push("message_too_long");
  if (!token) errors.push("token_required");

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, errors: [], data: { name, email, message, token } };
}

export interface TurnstileResult {
  success: boolean;
  errorCodes: string[];
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Cloudflare Turnstile のサーバー側検証（siteverify）。
// 公式仕様: POST に secret / response（クライアントのトークン）/ remoteip（任意）を渡す。
export async function verifyTurnstile(
  secret: string,
  token: string,
  remoteip: string | null,
  fetchFn: typeof fetch = fetch,
): Promise<TurnstileResult> {
  const body: Record<string, string> = { secret, response: token };
  if (remoteip) body.remoteip = remoteip;

  const res = await fetchFn(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return { success: false, errorCodes: [`http_${res.status}`] };
  }
  const json = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };
  return {
    success: json.success === true,
    errorCodes: json["error-codes"] ?? [],
  };
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailMessage {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
}

// 通知メール本文を組み立てる。送信者の入力（name/email/message）はそのまま
// HTML に埋め込むため escapeHtml でエスケープする（HTML インジェクション対策）。
export function buildEmail(
  data: ContactPayload,
  recipient: string,
  sender: string,
): EmailMessage {
  const text = [
    "byte-lark.com の Contact フォームから新しい問い合わせが届きました。",
    "",
    `お名前: ${data.name}`,
    `メール: ${data.email}`,
    "",
    "本文:",
    data.message,
  ].join("\n");

  const html = [
    "<h2>Contact フォームからの問い合わせ</h2>",
    `<p><strong>お名前:</strong> ${escapeHtml(data.name)}</p>`,
    `<p><strong>メール:</strong> ${escapeHtml(data.email)}</p>`,
    "<p><strong>本文:</strong></p>",
    `<p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`,
  ].join("\n");

  return {
    from: sender,
    to: [recipient],
    reply_to: data.email,
    subject: `[byte-lark Contact] ${data.name} さんからの問い合わせ`,
    text,
    html,
  };
}

export interface SendResult {
  ok: boolean;
  status: number;
  id?: string;
  error?: string;
}

const RESEND_URL = "https://api.resend.com/emails";

// Resend REST API（POST /emails）で通知メールを送信する。
export async function sendViaResend(
  apiKey: string,
  message: EmailMessage,
  fetchFn: typeof fetch = fetch,
): Promise<SendResult> {
  const res = await fetchFn(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const err = (await res.json()) as { message?: string };
      detail = err.message ?? "";
    } catch {
      // body が JSON でない場合は status のみで返す
    }
    return {
      ok: false,
      status: res.status,
      error: detail || `resend_http_${res.status}`,
    };
  }
  const json = (await res.json()) as { id?: string };
  return { ok: true, status: res.status, id: json.id };
}
