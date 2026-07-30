# 訪問者は確定タイポグラフィ（スケール・行間・和欧混植）で見出し・本文を読める

Status: InProgress
Started: 2026-07-30

## 誰が
- 訪問者

## 何をできる
- 確定したタイポスケール（見出し階層・本文サイズ・行間）と和欧混植調整のもとで、記事・各ページを読みやすく閲覧できる

## なんのために
- タイポスケール・行間・和欧混植は Phase 1a から TODO のまま（site-plan §6.5.3）。実記事が repo に入った今、実コンテンツで検証しながら確定する
- 関連: site-plan.md §6.5.3 / §8 Decision #28 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] PHASE1C-001 の確定方向性に基づき、見出し階層（h1〜h4）・本文・キャプションのサイズ / 行間 / ウェイトのスケールを定義し、`src/styles/global.css`（@theme トークンまたは共通スタイル）に実装（h2 の朝日ドットマーカー等の**装飾レイヤーは対象外**。下記「PHASE1C-008 との境界」参照）
- [ ] 和欧混植（Noto Sans JP × Geist）の見え方（数字・英単語混じりの本文、コード内和文コメント等）を確認・調整
- [ ] 実記事 building-this-blog-with-claude-code（コードブロック含む）+ Home / About / Career / Blog 一覧で表示検証（スクショ）
- [ ] site-plan §6.5.3 の TODO（タイポスケール定義）を確定内容で更新
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-001（確定方向性）
- フォント実体は @fontsource-variable/geist + @fontsource-variable/noto-sans-jp（global.css で @import、セルフホスト。Decision #24）。フォントファミリー構成を変える場合は PHASE1C-007（読み込み戦略）への影響を実装ログに記録
- 記事本文は PostLayout 配下の prose 系スタイルが対象

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md A 項（タイポ確定）
- 全初期記事セット（PHASE1B-008〜013）公開後の最終再検証は仕上げトラックで実施（本 PBI では現存コンテンツで確定）

### PHASE1C-008 との境界（h2 朝日ドットマーカーの帰属）
- design-direction §3 は本 PBI（003）の入力として「h2 には朝日ドットマーカー」を挙げるが、同じ装飾は §5 の署名要素として PHASE1C-008 にも現れて重複していた。**朝日マーカー全般（h2 ドットマーカー + リストマーカー）は PHASE1C-008 が持つ**と確定（008 の PBI 本文に理由を明記）
- 本 PBI（003）の範囲: 見出し階層のサイズ / 行間 / ウェイト・本文・和欧混植など**純粋なタイポグラフィ**。h2 のサイズ/ウェイト/行間は本 PBI で確定し、その上に載る装飾マーカーは 008 が additive に実装する
