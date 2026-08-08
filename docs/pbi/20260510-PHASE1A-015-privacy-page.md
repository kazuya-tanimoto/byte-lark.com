# 訪問者は Privacy ページでプライバシーポリシーを確認できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- サイトのプライバシーポリシー（個人情報の取扱い・アクセス解析・Cookie 方針）を確認できる

## なんのために
- 法的要件としてプライバシーポリシーを公開するため
- Cloudflare Web Analytics（Cookieless）を使用している旨を明示し、透明性を確保するため
- 関連: site-plan.md §6.1 / FR-22 / R-10

## 受け入れ条件
- [x] `src/pages/privacy.astro` を実装
- [x] プライバシーポリシー本文を記載（Q10 で内容決定）
- [x] Cloudflare Web Analytics の使用に関する記載（Cookieless であること）
- [x] 問合せ先（Contact ページへのリンク or メールアドレス）を記載
- [x] 法人化前の表記（個人事業主名義、§13.1 準拠）
- [x] PageLayout を使用
- [x] OGP メタ（title / description）が正しく出力
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- 静的テキストページ、Astro コンポーネントで実装
- Q10 で Claude がテンプレ 2 案（簡易 / 詳細）をドラフト → 運営者選定
- GA4 不使用のため Cookie 同意バナーは不要（Decision #18）

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：Q10 のテンプレ 2 案（簡易 5 章 / 詳細 8 章）をドラフトし運営者に提示、**簡易案で確定**（実態がフォームなし・Cookieless であることと、法人化改定が目前であることが根拠）。`src/pages/privacy.astro` 新規実装（PageLayout 使用、contact.astro のセクション構成・タイポグラフィに合わせた）。構成は基本方針 / 個人情報の取得と利用目的 / アクセス解析（CF Web Analytics・Cookieless 明記）/ お問い合わせ（Contact リンク + tanimoto@byte-lark.com）/ 改定について（制定日 2026-06-12）。基本方針に「個人事業主、2026 年 6 月法人化予定」（§13.1 準拠）を明記。ローカル（dev server）+ CF preview を 1280px / 375px で検証、OGP メタは dist/privacy/index.html で出力確認
- 残タスク：なし（法人化後のポリシー改定は §13.2 / 法人化対応 PBI で追跡）
- 学び・つまずき：ポート 4321 に前セッション由来とみられる古い node プロセスが残っており（/contact も 404 を返す stale な状態）、dev server は 4322 に自動フォールバックした。検証時はどのプロセスが応答しているか確認すること
- 想定外だった点：全ページ共通で favicon.ico が 404（public/ に favicon 自体が無い）。本 PBI 範囲外のため未対応、Phase 1b デザイン作業等での対応候補
