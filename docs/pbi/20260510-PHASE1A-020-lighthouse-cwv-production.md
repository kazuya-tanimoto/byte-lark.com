# 運営者は全主要ページで Lighthouse 90+ と Core Web Vitals 目標達成を確認できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- 全主要ページの Lighthouse スコア（Performance / Accessibility / SEO）が 90+ であることを確認できる
- Core Web Vitals（LCP / CLS / INP）が目標値を達成していることを確認できる
- 本番環境で全ページが正常に動作していることを確認できる

## なんのために
- サイトのパフォーマンス・アクセシビリティ・SEO 品質を客観的に証明するため
- Phase 2 広告配置時の判断基準（CWV 維持）を Phase 1a で確立するため
- 関連: site-plan.md NFR-07 / NFR-11

## 受け入れ条件
- [ ] 全主要ページで Lighthouse Performance 90+
- [ ] 全主要ページで Lighthouse Accessibility 90+
- [ ] 全主要ページで Lighthouse SEO 90+
- [ ] Core Web Vitals: LCP < 2.5s
- [ ] Core Web Vitals: CLS < 0.1
- [ ] Core Web Vitals: INP < 200ms
- [ ] CF branch alias URL（`https://feat-phase-1a-byte-lark.tanimoto-a49.workers.dev`）で全ページ表示確認（※ `byte-lark.com` での確認は Phase 1d 公開 PBI へ移管。site-plan v3.9 Decision #25 により公開はカスタムドメイン接続後）
- [ ] OGP メタの存在と値を branch alias URL のレスポンスで確認（※ Facebook / Twitter デバッガーでの実検証は OGP URL が byte-lark.com を指すため公開後でないと完結しない → Phase 1d へ移管）
- [ ] 各ページの `<title>` / `<meta description>` / `<link rel="canonical">` が正しいことを確認（canonical は仕様どおり `https://byte-lark.com/...` を指すこと）
- [ ] `/sample-highlight/`（PHASE1A-002 の検証用デモページ、sitemap からは PHASE1A-017 で除外済み）を削除するか Phase 1b のデザイン参照用に残すか判断し、結果を記録
- [ ] 本 PBI の結果を Phase 1a Gate の判断材料として記録
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由：本 PBI は計測・確認のみで UI を変更しない）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由：UI 変更なし。branch alias での全ページ表示確認は上記の計測条件に既存）（CLAUDE.md §7）

## 技術メモ
- Lighthouse は Chrome DevTools or `lighthouse` CLI で実行
- SSG サイトなので Performance 90+ は達成容易（JS 最小、静的 HTML）
- INP は React Island（CategoryFilter）が影響し得る
- OGP デバッガー: Facebook Sharing Debugger / Twitter Card Validator
- この PBI は手動確認が主体（運営者による Lighthouse 実行・目視確認）
- 検証 URL は CF branch alias（本番同等の SSG ビルド）。byte-lark.com はまだ Worker に接続されていない（Phase 1d で接続）ため、ドメイン固有の確認（HTTPS 証明書 / リダイレクト / OGP デバッガー実検証）は Phase 1d 公開 PBI の受け入れ条件に含まれる
