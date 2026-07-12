# 訪問者は WCAG AA コントラストを満たす確定ブランドカラーでサイトを閲覧できる

Status: NotStarted

## 誰が
- 訪問者

## 何をできる
- 仮カラー（Phase 1a 暫定 oklch 値）が確定ブランドカラーに置換されたサイトを、AA コントラスト準拠の可読性で閲覧できる

## なんのために
- 仮 HEX の primary（hibari-sky）は白背景でコントラスト比約 2.8:1 と AA（4.5:1）未満で、E2E の color-contrast チェックを除外して運用している。確定値への置換と除外解除で NFR-02 を完全充足する
- 関連: site-plan.md NFR-02 / §6.5.2（a11y 追跡）/ §8 Decision #28 / Phase 1c 先行トラック

## 受け入れ条件
- [ ] PHASE1C-001 の確定方向性に基づき、`src/styles/global.css` の仮値を確定値に置換（`--color-hibari-*` 7 個 + `:root` / `.dark` のセマンティックトークン。PHASE1A-022 申し送り「仮 HEX の所在一覧」参照）
- [ ] テキスト/背景に使う色の組合せがすべて AA 4.5:1 以上（大文字テキスト・UI コンポーネントは WCAG の該当基準に従う）
- [ ] `tests/e2e/a11y.spec.ts` の `disableRules(["color-contrast"])`（line 26-28 付近）を解除し、axe が全対象ページで green
- [ ] 利用側 10 ファイル（CareerTimeline / Header / Hero / ui/button.tsx / PostLayout / 404 / about / contact / index / privacy）の表示を確認し、意図しない色崩れがない（ダークモード含む）
- [ ] Lighthouse Accessibility で color-contrast 監査 pass、主要ページ 90+ 維持
- [ ] `yarn build` / `yarn check:ts` エラーなし
- [ ] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-001（確定方向性）
- 定義元は global.css の 1 ファイルに集約済み。コントラスト検証は oklch → sRGB 換算値で行う（ツールで実測、目視だけで判定しない）
- CLAUDE.md「Design Rules」の「確定 HEX は Phase 1c（デザイン）後」の行は本 PBI 完了時に更新する

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md A 項（確定 HEX + color-contrast 再有効化）
