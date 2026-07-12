# 訪問者はブランド確定意匠の favicon / apple-touch-icon を各ブラウザ・端末で見られる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- ブラウザタブ・ブックマーク・ホーム画面追加で、確定ブランド意匠のアイコンを見られる

## なんのために
- 現行 favicon は Phase 1a の暫定意匠（sky ブルー角丸 + 白 "b"、`public/favicon.svg`）。確定ブランドカラー / 新ロゴに合わせて差し替える
- 関連: site-plan.md §6.4（favicon.svg〔暫定〕）/ §8 Decision #28 / draft-phase1c-design-polish.md B-4 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] 確定ブランドカラー（PHASE1C-002）+ 新ロゴ意匠（PHASE1C-004）に合わせて `public/favicon.svg` を差し替え
- [ ] apple-touch-icon（180×180 PNG）を追加し、BaseLayout の `<head>` にリンク。他サイズ展開の要否もここで判断し実装ログに記録
- [ ] ブラウザタブでの表示確認（小サイズで意匠がつぶれないこと。スクショ）
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-002（確定カラー）+ PHASE1C-004（ロゴ意匠）。004 が R-06 発動（現行ロゴ続行）の場合は、確定カラー + 現行意匠ベースで作成し、その旨を実装ログに記録
- site-plan §6.4 の `favicon.svg`〔暫定・意匠は Phase 1c〕注記を本 PBI 完了時に更新

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-4
