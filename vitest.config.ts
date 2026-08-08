import { getViteConfig } from "astro/config";

// PnP 環境では vitest/config による vite UserConfig の型拡張が astro 側の vite に効かないため cast で回避。
// E2E (tests/e2e/) は Playwright が実行するため include は src 配下 + worker（Contact backend ロジック）に限定。
export default getViteConfig({
  test: { include: ["src/**/*.test.{ts,tsx}", "worker/**/*.test.ts"] },
} as Record<string, unknown>);
