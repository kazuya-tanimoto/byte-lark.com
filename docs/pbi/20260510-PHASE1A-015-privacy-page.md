# 訪問者は Privacy ページでプライバシーポリシーを確認できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- サイトのプライバシーポリシー（個人情報の取扱い・アクセス解析・Cookie 方針）を確認できる

## なんのために
- 法的要件としてプライバシーポリシーを公開するため
- Cloudflare Web Analytics（Cookieless）を使用している旨を明示し、透明性を確保するため
- 関連: site-plan.md §6.1 / FR-22 / R-10

## 受け入れ条件
- [ ] `src/pages/privacy.astro` を実装
- [ ] プライバシーポリシー本文を記載（Q10 で内容決定）
- [ ] Cloudflare Web Analytics の使用に関する記載（Cookieless であること）
- [ ] 問合せ先（Contact ページへのリンク or メールアドレス）を記載
- [ ] 法人化前の表記（個人事業主名義、§13.1 準拠）
- [ ] PageLayout を使用
- [ ] OGP メタ（title / description）が正しく出力
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- 静的テキストページ、Astro コンポーネントで実装
- Q10 で Claude がテンプレ 2 案（簡易 / 詳細）をドラフト → 運営者選定
- GA4 不使用のため Cookie 同意バナーは不要（Decision #18）
