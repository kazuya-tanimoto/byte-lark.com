# 運営者と Claude は CodeQL の二重構成を解消し、コードスキャンを単一の green な構成で運用できる

Status: Done
Started: 2026-07-15
Completed: 2026-07-15

## 誰が
- Claude（実施）+ 運営者（方式選定、必要なら GitHub 設定操作）

## 何をできる
- feat/phase-1 への push ごとに失敗し続けている CodeQL（`Analyze (javascript)`）を解消し、コードスキャンを単一構成で green にできる

## なんのために
- 2026-06-28 以降、全 push で CodeQL workflow が failure になっており、CI の「赤」が常態化すると本当の失敗を見落とす（品質ゲートの信頼性低下）
- Phase 1b Gate（PHASE1B-014）の「HEAD の CI 緑」判定をノイズなく行えるようにする

## 受け入れ条件
- [x] 方式を運営者が選定する（Claude がフラット評価を添えて提示）：2026-07-15 案B を選定
  - 案A：default setup を無効化（GitHub UI・admin 操作）して自前 `codeql.yml`（advanced 構成）へ一本化。codeql-action v2 → v3 更新を必ず伴う
  - 案B：自前 `.github/workflows/codeql.yml` を削除して default setup へ一本化（repo 変更のみで完結）。`actions` 言語（workflow 解析）のカバレッジが default setup で維持されるかを実施時に一次情報で確認する → 確認済み：default setup の check suite に `Analyze (javascript-typescript)` と `Analyze (actions)` が両方 success で存在（26d10ef、2026-07-15 API 実測）
- [x] 選定方式を実施し、push 後に CodeQL 系 check が単一構成になり failure の check-run が消えることを確認：03efd32 の check-runs は default setup の `Analyze (javascript-typescript)` / `Analyze (actions)` のみ（両方 success）、`Analyze (javascript)` の failure check-run は消滅（2026-07-15 確認）
- [x] default setup スキャンが検出済みの medium alert（workflow の GITHUB_TOKEN permissions 未設定、ui-tests.yml L19-44）に対応：各 workflow へ最小 permissions ブロックを追加（ui-tests.yml / quality.yml に `permissions: contents: read`。alert クローズ自体の API 確認は認証必須（401）のため不可、運営者が Security → Code scanning で確認）
- [x] 対応内容と判断根拠を実装ログに記録（default setup が有効化された経緯も運営者に確認して記録：心当たりなし、有効化時期 2025-02-19 のみ API で確定）
- [x] ローカル スクショ確認（desktop + mobile）：N/A（理由: CI 設定のみの変更で UI 非変更）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）：N/A（理由: 同上）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh`）：workflow 変更を含むため実施必須（UI Tests / Quality Checks green + CodeQL 解消をあわせて確認）（CLAUDE.md §7）→ 03efd32 で UI Tests(e2e) success / Quality Checks(quality) success / Workers Builds success / CodeQL(default setup) success（2026-07-15）

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

## 実装ログ

### 2026-07-15 セッション1
- やったこと
  - 一次情報の再確認（無認証 curl / GitHub API）で、起票時メモの不正確箇所を 2 点訂正：
    - 自前 codeql.yml の matrix は `javascript` のみ（`actions` は default setup 由来。技術メモの「matrix: javascript / actions」は誤認）
    - 「feat/phase-1 への push ごとに失敗」のからくりは `pull_request: branches: [main]` トリガー。PR #28（feat/phase-1 → main、2026-06-27 作成）が開いているため push のたびに PR イベントで走っていた（push トリガー自体は main のみ）
  - 追加で判明した事実：
    - main 上の週次 cron（schedule）でも同じ「Perform CodeQL Analysis」step が毎週 failure（API で 2026-05-10 まで遡って確認、いずれも同 step）。feat/phase-1 の 6/28 以降だけの問題ではなかった
    - default setup の有効化時期は 2025-02-19（dynamic workflow の created_at で確定）。現プロジェクト（Phase 0 開始）より前で、運営者にも有効化の心当たりなし → GitHub 側の自動有効化と推定（時期のみ確定、操作主体は不明のまま記録）
  - 方式選定：案A/案B をフラット評価付きで提示し、運営者が案B（default setup へ一本化）を選定
  - 実施：`.github/workflows/codeql.yml` を削除、`ui-tests.yml` / `quality.yml` に workflow レベルの `permissions: contents: read` を追加（medium alert「Workflow does not contain permissions」対応。upload-artifact は追加権限不要）
- 残タスク
  - ~~commit / push → CI green + CodeQL 単一構成の確認~~ → 完了（03efd32、検証報告参照）
  - main 上の週次 cron 停止：ファイル削除は feat/phase-1 のみで main には残るため、運営者による workflow 無効化が必要（Actions タブ → CodeQL → Disable workflow、または手元ターミナルで `gh workflow disable CodeQL --repo kazuya-tanimoto/byte-lark.com`）。Phase 1d の main マージでファイル自体が消えるまでの暫定措置。**Done 時点で workflow state = active（未実施）を API で確認済み → 運営者作業として申し送り**（実施しない場合、毎週日曜 04:45 JST 頃に failure が 1 件ずつ積まれ続けるのみで、feat/phase-1 の CI 判定には影響しない）
  - medium alert（ui-tests.yml permissions）のクローズ確認：無認証 API では読めない（401）ため、運営者が GitHub UI（Security → Code scanning）で open alert が消えたことを確認

### 検証報告（2026-07-15、03efd32）
- ローカル確認: N/A（CI 設定のみの変更で UI 非変更）
- CF preview 確認: N/A（同上。なお Workers Builds check は success）
- E2E/CI 確認: `scripts/ci-status.sh` で UI Tests(e2e) success / Quality Checks(quality) success。03efd32 の check-runs は CodeQL 系が default setup のみ（`Analyze (javascript-typescript)` success / `Analyze (actions)` success / `CodeQL` success）となり、advanced 構成の `Analyze (javascript)` failure は消滅
- 未検証項目: medium alert のクローズ（無認証 API 不可、運営者 UI 確認へ申し送り）、main 週次 cron の無効化（運営者作業、未実施を確認済み）
- 学び
  - pull_request トリガーは「base が main の PR」で発火するため、`branches: [main]` でも feature ブランチへの push ごとに走る（PR が開いている限り）
  - default setup の解析言語構成は check suite の check-run 名（`Analyze (…)`）から無認証で読み取れる

## 備考
- Phase 1b 期中の CI 保守として起票（コンテンツ整備のスコープ外だが、Phase 1a の PHASE1A-021 incident-response と同じ「依存なし・任意タイミング」の横断タスクの前例に倣う）。記事 PBI（008〜013）と独立して着手可
- 採番は起票順のため Gate（PHASE1B-014）より後の番号だが、着手順は INDEX の推奨着手順序に従う（Gate は本 PBI を含む全 PBI Done 後）。PHASE1B-014 の完了確認対象リストは本起票と同コミットで更新済み
