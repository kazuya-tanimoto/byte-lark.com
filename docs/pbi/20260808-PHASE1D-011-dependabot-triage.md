# 運営者は依存ライブラリの脆弱性アラートを仕分けし、実害のあるものを解消できる

Status: NotStarted

## 誰が
- 運営者

## 何をできる
- リポジトリの Dependabot アラート 61 件（critical 1 / high 16 を含む。2026-08-08、main に lockfile が乗って初走査された時点の値）を全件仕分けし、本サイトの構成で実害があるものは依存更新で解消、実害がないものは根拠付きで dismiss した状態にできる

## なんのために
- PHASE1D-005 の push 時に判明した未対応アラートを放置せず、公開直後のうちに危険度を確定させるため
- 本サイトは SSG + Workers（静的配信 + Contact API のみ）であり、build 時にしか使わない依存の脆弱性と runtime に露出する脆弱性では危険度が大きく異なる。この区別を付けて記録し、以後のアラート対応の基準にするため
- 関連: PHASE1D-007（GitHub セキュリティ通知の有効化確認を持つ。既存アラートの仕分けは本 PBI が担当）/ docs/incident-response.md §2

## 受け入れ条件
- [ ] critical 1 件を最優先で内容確認し、露出経路（runtime / build 時のみ / devDependencies のみ）と対応方針を確定
- [ ] 残る全アラートを仕分け：パッケージ / severity / 露出区分（runtime・build・dev）/ 処置（更新 or dismiss）の一覧を実装ログに記録
- [ ] 実害あり（または更新コストが低い）ものは依存更新で解消：`yarn up` 等のレジストリアクセスは devcontainer 内セッションまたは運営者ターミナルで実行（母艦 sandbox は registry.npmjs.org へ DNS 不可）
- [ ] 実害なしと判断したものは GitHub 上で理由付き dismiss（判断根拠は実装ログにも残す）
- [ ] 対応後、open アラートが「対応不要と判断済みのもの 0 件」になっていることを Security タブで確認
- [ ] 依存更新を行った場合：`yarn build` / `yarn check` / `yarn test:run` がローカル（devcontainer）で成功
- [ ] ローカル スクショ確認：依存更新がサイト出力に影響し得るため主要ページで表示回帰がないことを確認（更新が devDependencies のみで build 出力不変なら N/A 化可）（CLAUDE.md §7）
- [ ] CF preview スクショ確認：同上（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`。lockfile 変更で Quality Checks / UI Tests が走るため実確認する）（CLAUDE.md §7）

## 技術メモ
- アラートの閲覧・dismiss は GitHub → Security → Dependabot alerts（ブラウザ。母艦の gh CLI は sandbox で不可、curl は api.github.com 可）
- 仕分けの観点：本番 runtime は「Workers が静的アセットを配信 + /api/contact」だけ。Astro / Vite / Tailwind 等のビルドチェーンは build 時のみ実行され、悪意ある入力を処理しない（入力は自リポジトリのソースのみ）ため、多くの transitive 脆弱性は実害なしになる見込み。ただし critical と、Contact API の runtime 依存に掛かるものは個別精査
- 依存更新は minor / patch の範囲を基本とし、major が必要な場合は影響を確認のうえ運営者に判断を仰ぐ
- PHASE1D-006 と並行可（本 PBI は Security タブ + 依存ファイルのみ、006 はダッシュボード設定のみで衝突しない。INDEX.md のみ共有 → pull → 記入 → 即コミットで運用。README §9）
- 想定セッション数: 1（更新対象が多く major を跨ぐ場合は 2 セッション目で更新分を分離）

## 実装ログ（着手後に追記、中断時は必須）
（未着手）
