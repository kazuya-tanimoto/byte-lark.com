# 運営者は全主要ページで Lighthouse 90+ と Core Web Vitals 目標達成を確認できる

Status: InProgress
Started: 2026-06-14

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

## 実装ログ

### 2026-06-14 着手・計測

#### 計測手段の確認（Lighthouse CLI はサンドボックス内で起動不可）
実 Lighthouse CLI を 3 通り試したが、いずれも macOS サンドボックスの書込/IPC 拒否で Chrome 起動に失敗（根本原因を一次情報で特定）:
1. `npx lighthouse`（chrome-launcher 自動起動）→ chrome-launcher の `mktemp -t` が confstr 領域 `/var/folders/.../T/` に書こうとし `Operation not permitted`。`mktemp -t` は macOS では TMPDIR を無視する仕様で、手動再現も確認
2. Google Chrome 手動起動 + `lighthouse --port` → crashpad が `~/Library/Application Support/...` 書込拒否 + ProcessSingleton の socket 作成失敗
3. chrome-headless-shell（Playwright 同梱）手動起動 → Mach port 登録 `bootstrap_check_in ... Permission denied (1100)` で FATAL

→ PHASE1A-019 実装ログの結論（「Playwright test runner / ブラウザ起動 CLI はサンドボックス外、MCP Playwright は起動可」）と一致。**Lighthouse の数値スコアは運営者ターミナル実行**、それ以外（表示・CWV・メタ）は MCP Playwright + curl で Claude 側計測、という分担で実施した。

#### CWV 計測（MCP Playwright = 実 Chromium、非スロットル / branch alias）
PerformanceObserver（layout-shift / largest-contentful-paint, buffered）+ Event Timing で実測。いずれも目標を大幅クリア:

| ページ | LCP | CLS | FCP | TTFB | 転送 | 備考 |
|---|---|---|---|---|---|---|
| / | 284ms | 0.013 | 284ms | 158ms | ~10KB | LCP=ヒーロー段落 |
| /career/ | 208ms | 0 | 208ms | 34ms | ~9KB | |
| /blog/ | 264ms | 0 | 248ms | 31ms | ~11KB | LCP=カバー画像, JS 1KB |
| /blog/hello-...（記事） | 148ms | 0 | 148ms | 33ms | ~10KB | LCP=H1, JSON-LD `Article` 出力確認 |

- INP（/blog の CategoryFilter を実クリック、Tech/Life/全て）: 最大インタラクション **56ms**（閾値 200ms）。React island の応答は軽量（バンドル JS 約 1KB）
- 目標判定: **LCP < 2.5s ✅ / CLS < 0.1 ✅ / INP < 200ms ✅**（非スロットル値。スロットル基準値は運営者 Lighthouse mobile run で確認）

#### 表示確認（branch alias / 全ページ desktop + 代表ページ mobile）
全 10 ルートを HTTP 200/404 と目視で確認（崩れなし）:
- desktop（1280px）: / · /about/ · /career/ · /skills/ · /blog/ · 記事 · /contact/ · /privacy/ · 404 · /sample-highlight/
- mobile（375px）: / · /blog/ · 記事（ハンバーガーメニュー化、1 カラム化、コードブロック横スクロール、崩れなし）。/about/ /contact/ /privacy/ のモバイルは PHASE1A-019 で確認済み
- 404: 存在しないパスで HTTP 404 + カスタム 404 デザイン（誘導ボタン + Header/Footer）

#### メタ / OGP / canonical（curl でレスポンス実取得・全 8 実ページ）
- `<title>`: 全ページ一意・`Page | byte-lark.com` 形式（home は `byte-lark.com`、記事は記事タイトル）
- `<meta description>`: 全ページ存在・内容適切
- `<link rel="canonical">`: 全ページ **`https://byte-lark.com/...`** を指す（仕様どおり本番ドメイン。branch alias を指さない）✅
- OGP: og:title/description/url/image/type/site_name すべて存在。記事は `og:type=article` + cover 画像、その他は `website` + `/og-default.png`
- Twitter Card: `summary_large_image` + title/description/image 存在

#### 発見事項（要判断）
1. **favicon が存在しない**: BaseLayout に `<link rel="icon">` 宣言なし、public/ にアイコンなし、`/favicon.ico` `/favicon.svg` とも 404。ブラウザが自動要求する `/favicon.ico` が 404 → **全ページで console error 1 件**。Lighthouse Best Practices の「console エラーなし」監査に影響 + タブアイコン欠落（ブランディング）。アイコン意匠は Phase 1c だが、console エラー解消だけでも暫定 favicon 追加で可能
2. **/sample-highlight/**: BaseLayout を通らない素の .md ページ（ヘッダー/フッター/SEO メタ/コンテナ幅すべてなし、コードハイライト確認用の開発 artifact）。sitemap 除外済みだが `/sample-highlight/` で 200 公開中 → 外部リンク/クローラ経由で到達・インデックスされ得る。コードハイライトは実記事でも実証済みのため、ルート削除を推奨（ソース md は git 履歴に残る）
3. **Accessibility と color-contrast**: axe（WCAG 2.1 AA, critical/serious）は PHASE1A-019 で全ページゼロ。ただし color-contrast は仮 HEX（白背景で約 2.8:1 < AA 4.5:1）のため Phase 1c の確定 HEX まで意図的に除外中。Lighthouse Accessibility は color-contrast を重み付き評価するため、**A11y スコアのみ contrast 起因で 90 未満になり得る**（既知・1c 追跡項目）。Performance / SEO / Best-Practices は上記実測から 90+ が濃厚

#### 残タスク（運営者判断・実行待ち）
- Lighthouse 数値スコア（Performance / Accessibility / SEO 90+）の運営者ターミナル実行と記録
- favicon 対応方針（暫定追加 / 1c 送り）
- sample-highlight 削除可否の確定
