# 運営者は使っていない依存パッケージの更新に付き合わずに済む

Status: InProgress
Started: 2026-10-01

## 誰が

- 運営者

## 何をできる

- コードのどこからも読み込まれていない依存パッケージ 4 つを `package.json` から外し、
  Dependabot の PR・`yarn npm audit` の勧告・インストール時間の対象から消す

## なんのために

- 次の 4 つは `package.json` に載っているが、`src/` `worker/` `scripts/` `tests/` と設定ファイルの
  どこからも読み込まれていない（2026-10-01 に `git grep` で確認。`yarn.lock` と `package.json` 自身を除いて 0 件）
  - `lucide-react`（dependencies）：PHASE0-002 の shadcn 導入時に入った。アイコンは SVG を直接書いており使っていない
  - `tw-animate-css`（dependencies）：PHASE1C-010 で CSS の import を外したが、パッケージ自体が残った
  - `pixelmatch` / `pngjs`（devDependencies）：PHASE1D-010 でフォントのサブセット前後を画素比較したときに入れた。
    比較は一度きりで、比較スクリプトは repo に残っていない
- 使っていなくても、更新の PR と脆弱性の勧告は届く。読む手間だけがかかる
- 関連 NFR（site-plan §5）：**NFR-08**（依存追加は最小限）
- 関連 Phase：site-plan Phase 1e（公開後の運用・改善、Decision #31）

## 受け入れ条件

<!-- PBI 固有 -->
- [ ] `package.json` から `lucide-react` / `tw-animate-css` / `pixelmatch` / `pngjs` の 4 つが消え、
      `yarn.lock` も更新されている。外す操作は `yarn remove lucide-react tw-animate-css pixelmatch pngjs`
      で、母艦ではサンドボックスでレジストリに届かないため、**運営者が Claude Code 外のターミナルで実行する**か、
      コンテナ内のセッションで実行する（CLAUDE.md「Sandbox 制約」）
- [ ] 外したあと `git grep -n "lucide\|tw-animate\|pixelmatch\|pngjs" -- . ':!yarn.lock' ':!docs'` の結果が
      `components.json` の `"iconLibrary": "lucide"` 1 件だけになる（この行は残す。理由は備考）
- [ ] ビルド結果が変わらない：変更前の `dist/` を別ディレクトリへ保存し、変更後の `dist/` とファイル名のハッシュを正規化して
      `diff -rq` で比べ、HTML・CSS・JS がすべて一致する（PHASE1D-012 実装ログ。astro-island の識別子だけの差は許す。PHASE1D-012 で CF preview と比べたときに出た。2 回のローカルビルドで出るかは未確認）。
      それ以外の差分が出たら原因を実装ログに書く
- [ ] `yarn npm audit` がエラーなし
- [ ] `yarn build` / `yarn check` / `yarn check:ts` / `yarn test:run` がエラーなし
<!-- 定型（削除禁止。該当しないものは [x] N/A（理由）） -->
- [ ] テスト追加：N/A（振る舞いを変えない。読み込まれていない依存を外すだけで、変わらないことは `dist/` の一致で確かめる）
- [ ] ローカル スクショ確認（desktop + mobile）：N/A（画面を変えない。`dist/` の一致で代える）（CLAUDE.md §7）
- [ ] CF preview スクショ確認（branch alias URL）：N/A（同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `bash ~/.claude/bin/ci-status.sh` で UI Tests=success）（CLAUDE.md §7。
      画面は変えないが、依存の変更はインストールとビルドを壊しうるので CI は必ず通す）

## 技術メモ

- 想定セッション数：1（運営者の `yarn remove` 待ちを含む）
- 実行環境：コンテナ内を推奨（`yarn remove` も `yarn npm audit` もそのまま実行できる）。母艦で進める場合は、
  レジストリに届かないため `yarn remove` を運営者に Claude Code 外のターミナルで実行してもらう。
  画面を変えないのでスクショは撮らず、E2E は draft PR の CI で確かめる
- 触るファイル：`package.json`、`yarn.lock` のみ
- 触らない：`scripts/migrate-frontmatter.ts`。中身は空の雛形でどこからも呼ばれていないが、
  site-plan §9 R-02（記事の frontmatter の項目が変わったときの備え）で「Phase 1a で先に用意」と決めて置いたもの。
  消すかどうかは R-02 の見直しになるので、この PBI では扱わない

## 備考

- `components.json` の `"iconLibrary": "lucide"` は、shadcn CLI で部品を足すときにどのアイコンを使うかの設定。
  今後 `shadcn add` で lucide を使う部品を足せば `lucide-react` がまた入るが、それは使うから入るので問題ない。
  設定を変えると shadcn の部品の書き出しが変わるため、この PBI では触らない
- 出所：2026-09-30 のコードのスリム化の点検（運営者の質問「コードが無駄に多くないか」への回答）。
  同じ点検で挙げたリファクタリングは PHASE1E-015〜017 に分けて起票した

## 実装ログ（着手後に追記、中断時は必須）
