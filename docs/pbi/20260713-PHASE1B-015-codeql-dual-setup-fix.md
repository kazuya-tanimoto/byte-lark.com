# 運営者と Claude は CodeQL の二重構成を解消し、コードスキャンを単一の green な構成で運用できる

Status: NotStarted

## 誰が
- Claude（実施）+ 運営者（方式選定、必要なら GitHub 設定操作）

## 何をできる
- feat/phase-1 への push ごとに失敗し続けている CodeQL（`Analyze (javascript)`）を解消し、コードスキャンを単一構成で green にできる

## なんのために
- 2026-06-28 以降、全 push で CodeQL workflow が failure になっており、CI の「赤」が常態化すると本当の失敗を見落とす（品質ゲートの信頼性低下）
- Phase 1b Gate（PHASE1B-014）の「HEAD の CI 緑」判定をノイズなく行えるようにする

## 受け入れ条件
- [ ] 方式を運営者が選定する（Claude がフラット評価を添えて提示）：
  - 案A：default setup を無効化（GitHub UI・admin 操作）して自前 `codeql.yml`（advanced 構成）へ一本化。codeql-action v2 → v3 更新を必ず伴う
  - 案B：自前 `.github/workflows/codeql.yml` を削除して default setup へ一本化（repo 変更のみで完結）。`actions` 言語（workflow 解析）のカバレッジが default setup で維持されるかを実施時に一次情報で確認する
- [ ] 選定方式を実施し、push 後に CodeQL 系 check が単一構成になり failure の check-run が消えることを確認
- [ ] default setup スキャンが検出済みの medium alert（workflow の GITHUB_TOKEN permissions 未設定、ui-tests.yml L19-44）に対応：各 workflow へ最小 permissions ブロックを追加
- [ ] 対応内容と判断根拠を実装ログに記録（default setup が有効化された経緯も運営者に確認して記録）
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由: CI 設定のみの変更で UI 非変更）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由: 同上）（CLAUDE.md §7）
- [ ] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：workflow 変更を含むため実施必須（UI Tests / Quality Checks green + CodeQL 解消をあわせて確認）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 一次情報（2026-07-13 調査済み、PHASE1C-001 セッションにて無認証 curl の GitHub API で取得）:
  - 失敗箇所: `.github/workflows/codeql.yml`（advanced 構成、matrix: javascript / actions）の「Perform CodeQL Analysis」step
  - エラー全文（check-run annotation より）: `Code Scanning could not process the submitted SARIF file: CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled`
  - 併存構成: GitHub default setup（`dynamic/github-code-scanning/codeql`、`Analyze (javascript-typescript)` = success）が有効になっている
  - 失敗開始: 2026-06-28 以降の feat/phase-1 全ラン（5fb4732 / ec5de57 / 8989023 / f55e14a / 233af51 で確認）→ その頃 default setup が有効化されたと推定（経緯未確認）
  - 副次警告: codeql-action@v2 使用に Node 20 deprecation 警告。案A の場合 v3 化が必須
  - 検出済み alert: 「Workflow does not contain permissions」（medium、ui-tests.yml L19-44）
- Claude の推奨は案B：個人サイト repo でクエリのカスタム要件がなく、GitHub 管理でアクション更新への追随が不要になる。反対に案A はスキャン構成をコードで管理できるが、admin 操作 + v3 化 + 以後のメンテ負担が残る。最終選定は運営者
- ログ本文の API 取得は admin 権限が必要（403）。check-run annotations は無認証で読める。admin 操作（default setup の有効/無効）は sandbox から不可のため運営者依頼（gh CLI も TLS/keychain で不可）

## 備考
- Phase 1b 期中の CI 保守として起票（コンテンツ整備のスコープ外だが、Phase 1a の PHASE1A-021 incident-response と同じ「依存なし・任意タイミング」の横断タスクの前例に倣う）。記事 PBI（008〜013）と独立して着手可
- 採番は起票順のため Gate（PHASE1B-014）より後の番号だが、着手順は INDEX の推奨着手順序に従う（Gate は本 PBI を含む全 PBI Done 後）。PHASE1B-014 の完了確認対象リストは本起票と同コミットで更新済み
