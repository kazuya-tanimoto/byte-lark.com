# 訪問者は Contact ページで法人への問合せ方法と対応領域を確認できる

Status: Done
Started: 2026-06-12
Completed: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- 法人への問合せメールアドレスと対応領域を確認できる

## なんのために
- 直案件候補やクライアントが問合せ手段を把握するため
- 法人としての連絡窓口を明示し、信頼性を確保するため
- 関連: site-plan.md §6.1 / FR-11

## 受け入れ条件
- [x] `src/pages/contact.astro` を実装
- [x] 問合せメールアドレスを表示（Q3 / Q7 で決定: tanimoto@byte-lark.com、PHASE1A-006 にて Footer と共通化済み）
- [x] 対応領域（どんな問合せを受け付けるか）を記載
- [x] PageLayout を使用
- [x] OGP メタ（title / description）が正しく出力
- [x] レスポンシブ対応
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- 静的テキストページ、Astro コンポーネントで実装
- メールアドレスは `mailto:` リンクで表示（スパム対策として CSS/JS で難読化する選択肢あり）
- 法人化前は個人メール、法人化後に @byte-lark.com に切替（§13.2）

## 実装ログ

### 2026-06-12 セッション 1
- やったこと：`src/pages/contact.astro` 新規実装（PageLayout 使用、about.astro のセクション構成・タイポグラフィに合わせた）。問合せメールは Q3/Q7 決定済み値（tanimoto@byte-lark.com、PHASE1A-006 で Footer と共通決定）を `mailto:` リンクで表示、返信目安（2〜3 営業日）を併記。対応領域は About の事業内容 3 項目 + 記事への質問・指摘の計 4 項目で記載し、About / Career への内部リンクを設置。ローカル（dev server）+ CF preview を 1280px / 375px で検証、OGP メタは dist/contact/index.html で og:title / og:description / og:url の出力を確認
- 残タスク：なし
- 学び・つまずき：Q3/Q7 は site-plan §10 上は未確定マークのままだが、PHASE1A-006 の技術メモで決定済み（tanimoto@byte-lark.com 統一）。未決事項の確定状況は site-plan だけでなく決定を反映した PBI 側も確認する
- 想定外だった点：メール難読化（技術メモの選択肢）は Footer が既に平文 mailto で公開しているため、Contact のみ難読化しても効果がなく見送った

