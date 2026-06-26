import { describe, expect, it } from "vitest";
import {
  buildEmail,
  escapeHtml,
  sendViaResend,
  validateContactPayload,
  verifyTurnstile,
} from "./contact";

// fetch を差し替えるためのヘルパ。渡した Response を返しつつ、
// 呼び出し時の URL / init を capture でテストに渡す。
function fakeFetch(
  response: Response,
  capture?: (url: string, init?: RequestInit) => void,
): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    capture?.(String(url), init);
    return response;
  }) as typeof fetch;
}

const validInput = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "お仕事の相談です。",
  token: "turnstile-token",
};

describe("validateContactPayload", () => {
  it("正当な入力を通し、前後空白を trim する", () => {
    const r = validateContactPayload({
      ...validInput,
      name: "  山田 太郎  ",
    });
    expect(r.ok).toBe(true);
    expect(r.data?.name).toBe("山田 太郎");
    expect(r.data?.email).toBe("taro@example.com");
  });

  it("オブジェクト以外は invalid_body", () => {
    expect(validateContactPayload("x").errors).toContain("invalid_body");
    expect(validateContactPayload(null).errors).toContain("invalid_body");
  });

  it("必須項目の欠落を検出する", () => {
    const r = validateContactPayload({});
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual(
      expect.arrayContaining([
        "name_required",
        "email_required",
        "message_required",
        "token_required",
      ]),
    );
  });

  it("不正なメール形式を弾く", () => {
    const r = validateContactPayload({ ...validInput, email: "not-an-email" });
    expect(r.ok).toBe(false);
    expect(r.errors).toContain("email_invalid");
  });

  it("長すぎる入力を弾く", () => {
    const r = validateContactPayload({
      ...validInput,
      name: "あ".repeat(101),
      message: "い".repeat(5001),
    });
    expect(r.errors).toContain("name_too_long");
    expect(r.errors).toContain("message_too_long");
  });
});

describe("verifyTurnstile", () => {
  it("success:true を成功として返す", async () => {
    const res = new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
    const r = await verifyTurnstile("secret", "tok", null, fakeFetch(res));
    expect(r.success).toBe(true);
  });

  it("success:false と error-codes を返す", async () => {
    const res = new Response(
      JSON.stringify({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
      { status: 200 },
    );
    const r = await verifyTurnstile("secret", "bad", null, fakeFetch(res));
    expect(r.success).toBe(false);
    expect(r.errorCodes).toContain("invalid-input-response");
  });

  it("HTTP エラー時は success:false", async () => {
    const res = new Response("oops", { status: 500 });
    const r = await verifyTurnstile("secret", "tok", null, fakeFetch(res));
    expect(r.success).toBe(false);
    expect(r.errorCodes).toContain("http_500");
  });

  it("remoteip を渡したときだけ body に含める", async () => {
    let captured: RequestInit | undefined;
    const res = new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
    await verifyTurnstile(
      "secret",
      "tok",
      "203.0.113.1",
      fakeFetch(res, (_url, init) => {
        captured = init;
      }),
    );
    const body = JSON.parse(String(captured?.body));
    expect(body.remoteip).toBe("203.0.113.1");
    expect(body.secret).toBe("secret");
    expect(body.response).toBe("tok");
  });
});

describe("escapeHtml / buildEmail", () => {
  it("HTML 特殊文字をエスケープする", () => {
    expect(escapeHtml("<script>\"&'")).toBe("&lt;script&gt;&quot;&amp;&#39;");
  });

  it("宛先 / 返信先 / 件名を組み立てる", () => {
    const msg = buildEmail(
      validInput,
      "info@byte-lark.com",
      "byte-lark <contact@send.byte-lark.com>",
    );
    expect(msg.to).toEqual(["info@byte-lark.com"]);
    expect(msg.reply_to).toBe("taro@example.com");
    expect(msg.subject).toContain("山田 太郎");
    expect(msg.text).toContain("お仕事の相談です。");
  });

  it("本文の HTML はエスケープされる", () => {
    const msg = buildEmail(
      { ...validInput, message: "<b>xss</b>" },
      "to@example.com",
      "from@example.com",
    );
    expect(msg.html).toContain("&lt;b&gt;xss&lt;/b&gt;");
    expect(msg.html).not.toContain("<b>xss</b>");
  });
});

describe("sendViaResend", () => {
  const msg = buildEmail(validInput, "to@example.com", "from@example.com");

  it("成功時は id を返す", async () => {
    const res = new Response(JSON.stringify({ id: "abc-123" }), {
      status: 200,
    });
    let captured: RequestInit | undefined;
    const r = await sendViaResend(
      "re_key",
      msg,
      fakeFetch(res, (_url, init) => {
        captured = init;
      }),
    );
    expect(r.ok).toBe(true);
    expect(r.id).toBe("abc-123");
    expect((captured?.headers as Record<string, string>).Authorization).toBe(
      "Bearer re_key",
    );
  });

  it("エラー時は ok:false と詳細を返す", async () => {
    const res = new Response(
      JSON.stringify({ message: "domain not verified" }),
      {
        status: 422,
      },
    );
    const r = await sendViaResend("re_key", msg, fakeFetch(res));
    expect(r.ok).toBe(false);
    expect(r.status).toBe(422);
    expect(r.error).toBe("domain not verified");
  });
});
