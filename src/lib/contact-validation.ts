// Contact フォームの入力チェック。画面（src/components/ContactForm.tsx）と
// Worker（worker/contact.ts）の両方が読む。片方だけ直して食い違うのを防ぐため、
// 上限の字数・メールの正規表現・何をエラーとするかはここにだけ書く。
// Worker は Astro の外で wrangler がまとめるので、`@/` の別名・import.meta.env・astro:* を使わない。

const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

// 厳密な RFC 準拠ではなく「空白なしの local@domain.tld」程度の存在チェック。
// 過剰に弾くと正当な送信を取りこぼすため緩めに留める（最終判定は実送信時のエラーで担保）。
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactFieldIssue = "required" | "too_long" | "invalid";
export type ContactFieldIssues = Partial<
  Record<ContactField, ContactFieldIssue>
>;

/**
 * 欄ごとに最初に見つかった問題を返す。前後の空白は除いてから見る（送信時も除いて送る）。
 * 字数は JavaScript の length（UTF-16 の単位）で数える。
 */
export function checkContactFields(input: {
  name: string;
  email: string;
  message: string;
}): ContactFieldIssues {
  const issues: ContactFieldIssues = {};
  for (const field of ["name", "email", "message"] as const) {
    const value = input[field].trim();
    if (!value) issues[field] = "required";
    else if (value.length > CONTACT_LIMITS[field]) issues[field] = "too_long";
    else if (field === "email" && !EMAIL_RE.test(value))
      issues[field] = "invalid";
  }
  return issues;
}

const FIELD_LABELS: Record<ContactField, string> = {
  name: "お名前",
  email: "メールアドレス",
  message: "本文",
};

/** 画面に出すエラー文。checkContactFields の結果を欄ごとの日本語文に変える。 */
export function contactFieldMessages(
  issues: ContactFieldIssues,
): Partial<Record<ContactField, string>> {
  const messages: Partial<Record<ContactField, string>> = {};
  for (const [field, issue] of Object.entries(issues) as [
    ContactField,
    ContactFieldIssue,
  ][]) {
    const label = FIELD_LABELS[field];
    messages[field] =
      issue === "required"
        ? `${label}を入力してください。`
        : issue === "too_long"
          ? `${label}は ${CONTACT_LIMITS[field]} 字以内で入力してください。`
          : `${label}の形式が正しくありません。`;
  }
  return messages;
}
