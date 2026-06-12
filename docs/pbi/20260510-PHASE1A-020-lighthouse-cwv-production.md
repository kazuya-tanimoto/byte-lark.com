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
- [ ] 本番 URL（`byte-lark.com`）で全ページ表示確認
- [ ] OGP メタが SNS 共有時に正しく表示されることを確認（OGP デバッガー等で検証）
- [ ] 各ページの `<title>` / `<meta description>` / `<link rel="canonical">` が正しいことを確認
- [ ] `/sample-highlight/`（PHASE1A-002 の検証用デモページ、sitemap からは PHASE1A-017 で除外済み）を削除するか Phase 1b のデザイン参照用に残すか判断し、結果を記録
- [ ] 本 PBI の結果を Phase 1a Gate の判断材料として記録

## 技術メモ
- Lighthouse は Chrome DevTools or `lighthouse` CLI で実行
- SSG サイトなので Performance 90+ は達成容易（JS 最小、静的 HTML）
- INP は React Island（CategoryFilter）が影響し得る
- OGP デバッガー: Facebook Sharing Debugger / Twitter Card Validator
- この PBI は手動確認が主体（運営者による Lighthouse 実行・目視確認）
