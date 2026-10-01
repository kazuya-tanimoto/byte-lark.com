import { describe, expect, it } from "vitest";
import { checkContactFields, contactFieldMessages } from "./contact-validation";

const valid = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "お仕事の相談です。",
};

// 形式が正しく、全体が length 字のメールアドレス（@example.com の 12 字を含む）
function emailOfLength(length: number): string {
  return `${"a".repeat(length - 12)}@example.com`;
}

describe("checkContactFields", () => {
  it("正当な入力は問題なし", () => {
    expect(checkContactFields(valid)).toEqual({});
  });

  it("上限ちょうどは通る", () => {
    expect(
      checkContactFields({
        name: "あ".repeat(100),
        email: emailOfLength(254),
        message: "い".repeat(5000),
      }),
    ).toEqual({});
  });

  it("上限を 1 字超えると too_long", () => {
    expect(
      checkContactFields({
        name: "あ".repeat(101),
        email: emailOfLength(255),
        message: "い".repeat(5001),
      }),
    ).toEqual({ name: "too_long", email: "too_long", message: "too_long" });
  });

  it("前後の空白は字数に数えない", () => {
    expect(
      checkContactFields({
        name: `  ${"あ".repeat(100)}  `,
        email: ` ${emailOfLength(254)}\n`,
        message: `\n${"い".repeat(5000)}\n\n`,
      }),
    ).toEqual({});
  });

  it("空白だけの欄は required", () => {
    expect(
      checkContactFields({ name: " ", email: "\n", message: "　" }),
    ).toEqual({
      name: "required",
      email: "required",
      message: "required",
    });
  });

  it("メールの形式違いは invalid", () => {
    expect(checkContactFields({ ...valid, email: "not-an-email" })).toEqual({
      email: "invalid",
    });
  });
});

describe("contactFieldMessages", () => {
  it("上限超えは欄ごとに上限の字数を出す", () => {
    expect(
      contactFieldMessages({
        name: "too_long",
        email: "too_long",
        message: "too_long",
      }),
    ).toEqual({
      name: "お名前は 100 字以内で入力してください。",
      email: "メールアドレスは 254 字以内で入力してください。",
      message: "本文は 5000 字以内で入力してください。",
    });
  });

  it("空欄とメール形式の文は従来どおり", () => {
    expect(
      contactFieldMessages({
        name: "required",
        email: "required",
        message: "required",
      }),
    ).toEqual({
      name: "お名前を入力してください。",
      email: "メールアドレスを入力してください。",
      message: "本文を入力してください。",
    });
    expect(contactFieldMessages({ email: "invalid" })).toEqual({
      email: "メールアドレスの形式が正しくありません。",
    });
  });

  it("問題の無い欄には文を出さない", () => {
    expect(contactFieldMessages({})).toEqual({});
  });
});
