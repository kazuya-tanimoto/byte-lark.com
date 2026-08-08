# 訪問者は https://byte-lark.com で公開サイトを閲覧できる

Status: Done
Started: 2026-08-08
Completed: 2026-08-08

## 誰が
- 訪問者

## 何をできる
- 本番ドメイン https://byte-lark.com で全ページを HTTPS で閲覧できる

## なんのために
- サイト公開そのもの（Phase 1d の中核）。旧 PHASE1A-018 の移管先
- 関連: site-plan §7 Phase 1d / §8 Decision #25 / NFR（Lighthouse 90+）

## 受け入れ条件
- [x] 前提確認：PHASE1D-001（QA）/ 002（法人表記）/ 003（ゾーン Active）が Done
- [x] マージ前に記事 3 本（T1 / T2 / L1）の `publishedAt` を実公開日へ更新（未来日でも表示される仕様のため、忘れても画面で気づけない）→ 3 本とも 2026-08-08 へ更新（a212517）
- [x] feat/phase-1 を main へ `merge --no-ff`（README §10.6）→ 本番 Worker の main ビルド・デプロイ成功を確認 → マージコミット 01239b9（sandbox 制約で `git commit-tree` による同内容の 2 親マージ。実装ログ参照）、main の Workers Builds success
- [x] main 向け CF Deploy Hook を追加（運営者。PHASE1C-012 申し送り。URL は 1Password 保管、repo・PBI・ログに書かない）→ 「main manual rebuild」を作成
- [x] Workers カスタムドメインとして byte-lark.com を接続（Workers & Pages > byte-lark > Settings > Domains & Routes）→ HTTPS 有効（現状の証明書エラー解消）を確認 → 接続前に旧 apex A レコードの削除が必要だった（実装ログ参照）
- [x] https://byte-lark.com で全ページ表示確認（スクショ、desktop + mobile）→ 10 ページすべて 200・表示正常
- [x] 本番レスポンスに `X-Robots-Tag: noindex` が付かないことを確認
- [x] Lighthouse Performance / SEO 90+ を本番ドメインの全主要ページで確認（`bash scripts/lighthouse-audit.sh`、運営者ターミナル実行。A11y 90+ / BP 100 は PHASE1A-020 で branch alias 確認済み）→ SEO は全 11 ページ 100。Performance は 2/11 のみ 90+（残り 59〜82、フォント転送量起因）→ 次項の判定どおり PHASE1D-010 を起票して対応
- [x] 公開済み実記事で CLS を測り直す（PHASE1C-007 申し送り。Phase 1c は一時記事で代替していた）→ 実記事 3 本含む全 11 ページで CLS ≈0
- [x] フォント転送量の判定を記録：本番計測で Performance に問題が出た場合のみサブセット化 PBI を起票、問題なければ現状維持（ビルド 366 ファイル・8.5MB / インライン @font-face 約 283KB は PHASE1C-003 / 007 / 010 の確定方式）→ 問題あり（ページあたり 0.35〜1.1MB）と判定、PHASE1D-010（font-subsetting）を起票
- [x] main の CodeQL 週次 cron failure がマージで根治したことを確認（旧 codeql.yml 削除が main に到達。GitHub Actions で weekly failure が再発しないこと。PHASE1B-015 申し送り）→ origin/main に codeql.yml が無いことを確認（cron 自体が消滅）、マージ後 main の default setup Analyze 2 本は success
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7。publishedAt 変更後の記事表示）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7。マージ前の最終状態確認として）
- [x] E2E / CI green 確認（feat/phase-1 push 後と main マージ後の両方で `scripts/ci-status.sh`）（CLAUDE.md §7）→ a212517（feat/phase-1）・01239b9（main）とも全 check success

## 技術メモ
- production branch の一時切替案は棄却済み（Decision #25）。マージ → 接続の順を守る
- 公開 commit と PBI Done 化は同一セッションで完結させる（README §5.4、v3.7 規約）
- CF Workers Builds は `node_modules/.astro` をキャッシュ。カバー画像付き記事の削除・改名でビルドが落ちたら Clear Cache（再現性のある失敗）
- SEO 判定は本番ドメインのみ有効（branch alias は CF が noindex を強制）

## 実装ログ（着手後に追記、中断時は必須）

### 2026-08-08 公開作業一式（着手〜Done、単一セッション）

#### やったこと（時系列）
1. 記事 3 本の `publishedAt` を実公開日 2026-08-08 へ更新（building-this-blog: 06-28 → / contact-form: 08-01 → / incorporating: 08-03 →）。ローカル dev server + CF preview で表示確認、push 後 CI 全 green（a212517）
2. main へマージ：`git merge --no-ff` が sandbox の書込み拒否で失敗（`.claude/settings.json` の unlink 不可 → read-tree failed）。main がマージベースと一致しておりマージ後ツリー＝feat/phase-1 のツリーになるため、`git commit-tree "feat/phase-1^{tree}" -p main -p feat/phase-1` で同内容の 2 親マージコミットを作業ツリーに触れず作成し、`git push origin <sha>:main` で push（01239b9）。main の CI（e2e / quality / Analyze ×2 / Workers Builds）全 success、本番 Worker デプロイ成功
3. 運営者作業（ダッシュボード誘導）：main 向け Deploy Hook「main manual rebuild」作成（URL は 1Password 保管）。カスタムドメイン接続は「Hostname already has externally managed DNS records」エラー → 旧サイトの apex A レコード（85.131.209.167、PHASE1D-003 で移設したもの）を削除してから接続成功。CF が proxied なレコードを自動作成し、byte-lark.com / Production として接続完了
4. 正規ホストの確認：www 付きから apex（byte-lark.com）への一本化を運営者が確定（「www なしでいい」）。www の旧サイト畳み + 301 は PHASE1D-005 で実施
5. 本番検証：全 10 ページ 200・表示正常（スクショ desktop + mobile）、`X-Robots-Tag` なし、Turnstile も本番ドメインで自動通過、console エラーは Turnstile 自身のスクリプト由来のみ
6. 本番 Lighthouse（運営者ターミナル、`scripts/lighthouse-audit.sh https://byte-lark.com performance,seo`）：下表。SEO 全 100、CLS 全ページ ≈0（実記事含む）。Performance 未達 9 ページはフォント転送量起因 → PHASE1D-010 起票

#### 本番 Lighthouse 結果（2026-08-08）
| ページ | Perf | SEO | | ページ | Perf | SEO |
|---|---|---|---|---|---|---|
| / | 94 | 100 | | /privacy | 63 | 100 |
| /about | 64 | 100 | | /404 | 82 | 100 |
| /career | 61 | 100 | | 記事 T1 | 59 | 100 |
| /skills | 100 | 100 | | 記事 T2 | 63 | 100 |
| /blog | 73 | 100 | | 記事 L1 | 63 | 100 |
| /contact | 64 | 100 | | | | |

- スコアとページあたりフォント転送量（18〜68 ファイル・約 0.35〜1.1MB、日本語グリフ数に比例）が完全に連動。TBT 0 / TTFB 60〜350ms / render-blocking なしで、他要因は白
- 実測（observed）FCP は 0.3〜2.6 秒と良好。スコアは低速回線シミュレーションの外挿値（例：/about observed 1.36s → simulated 5.72s）。本文フォント `display: optional` は実利用では即描画に倒れるが、シミュレータはフォント到着後描画として外挿する
- 計測は運営者回線がテザリング（後述の DNS キャッシュ回避のため）。observed 値に軽微な影響の可能性はあるが判定を変えるものではない

#### 想定外・学び
- sandbox で main チェックアウト・マージ不可 → `commit-tree` plumbing で解決（上記 2）。マージ後は `git reset --mixed` + `git restore .` でローカルを復旧し、main 由来の残骸（旧 `codeql.yml` 等の untracked 4 件）は削除した。旧 codeql.yml を復活させないこと
- カスタムドメイン接続は「同名の既存 DNS レコードがあると拒否」される仕様。apex A を消してから接続、が正順
- NS 移管直後の公開だったため、運営者のルーターが旧 NS 委任をキャッシュしており、旧 Xserver ゾーン（温存中の切り戻し先）の旧 A レコードを返し続けた → 旧サイト表示 + 証明書エラー。DoH（cloudflare-dns.com / dns.google）は新 IP を返しており切り分けに有効。テザリングで回避、最大 48 時間で自然解消の見込み。ゾーン温存（PHASE1D-003 の方針）の既知の副作用であり設定ミスではない
- Chrome は一度証明書エラーを例外許可すると、証明書が正常化しても「保護されていない通信」表示が残る。シークレットウィンドウで実状態を確認できる
- マージ後に並行セッションがプライバシーポリシー改定（224a4a4 + 372410d、PHASE1D-002 事後追記）を feat/phase-1 に積んだため、本番 /privacy は改定前の文面。次回の main マージ（005 以降の適時）で反映すること【申し送り】

#### 残タスク・申し送り
- www の旧サイト併存の解消と 301 → PHASE1D-005（即着手推奨。現状 www では旧 Netlify サイトが見え続ける）
- フォントサブセット化 → PHASE1D-010（実施時期は運営者判断）
- プライバシーポリシー改定の main 反映 → 次回 main マージ時

