/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Cloudflare Turnstile の公開 site key。
   * 未設定時はテストキーにフォールバックする（src/components/ContactForm.tsx）。
   * 本番は CF ビルド環境変数として設定する。
   */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
