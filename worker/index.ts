// byte-lark.com の Worker エントリ。
// 静的サイト（Astro SSG 出力）は wrangler の assets 配信がデフォルトで先に処理し、
// アセットに一致しないリクエスト（/api/contact 等）だけがこの fetch ハンドラに渡る。
// /api/contact 以外は ASSETS binding に委譲し、静的配信（404-page 含む）を壊さない。

import {
  buildEmail,
  sendViaResend,
  validateContactPayload,
  verifyTurnstile,
} from "./contact";

export interface Env {
  // 静的アセット配信 binding（wrangler.jsonc の assets.binding と一致）
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  // 同一 IP のレートリミット binding（wrangler.jsonc の ratelimits[].name と一致）
  CONTACT_RATE_LIMITER?: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
  // 以下は Workers secret / 変数（リポジトリには置かない）
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT?: string;
  CONTACT_SENDER?: string;
}

const DEFAULT_RECIPIENT = "tanimoto@byte-lark.com";
const DEFAULT_SENDER = "byte-lark Contact <contact@send.byte-lark.com>";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }
  // secret 未投入（運営者準備前）でもデプロイは通すが、実行時は 503 で明示的に止める
  if (!(env.TURNSTILE_SECRET_KEY && env.RESEND_API_KEY)) {
    return json({ ok: false, error: "service_unavailable" }, 503);
  }

  // レートリミットは外部 fetch より前に評価し、Turnstile / Resend を flood から守る。
  // CF-Connecting-IP は CF エッジが必ず付与する実クライアント IP。
  const ip = request.headers.get("CF-Connecting-IP");
  if (env.CONTACT_RATE_LIMITER && ip) {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json({ ok: false, error: "rate_limited" }, 429);
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const validation = validateContactPayload(payload);
  if (!(validation.ok && validation.data)) {
    return json(
      { ok: false, error: "validation_failed", details: validation.errors },
      400,
    );
  }
  const data = validation.data;

  const turnstile = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    data.token,
    ip,
  );
  if (!turnstile.success) {
    return json(
      { ok: false, error: "turnstile_failed", details: turnstile.errorCodes },
      403,
    );
  }

  const message = buildEmail(
    data,
    env.CONTACT_RECIPIENT ?? DEFAULT_RECIPIENT,
    env.CONTACT_SENDER ?? DEFAULT_SENDER,
  );
  const sent = await sendViaResend(env.RESEND_API_KEY, message);
  if (!sent.ok) {
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
