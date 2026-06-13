# 【ドラフト】Phase 1b コンテンツ整備 PBI 群

Status: Draft（番号なし。Phase 1a Gate（PHASE1A-022）通過後の 1b 起票セッションで、本ドラフトを分割して番号付き PBI として正式化する）
作成: 2026-06-13（site-plan v3.9 Decision #25 / #26 と同時起票）

## 背景

2026-06-13 の PHASE1A-018 着手時調査で、公開前にコンテンツの確定工程が計画に存在しないことが判明した（site-plan v3.9 改訂の経緯参照）。現状：

- Career / Skills / 資格データは archive ブランチ（旧 React 版コード）からの忠実移植で、**現在の正確性は未検証**。Career は実案件 2 件（2021〜）のみで About の「25 年」と不整合
- About / Privacy は Claude 起草ドラフトで、**運営者による事実確認・承認が未実施**（文体選定とレイアウト確認のみ）
- 記事はサンプル 1 本（hello-astro-content-collections）のみ
- Contact は mailto でアドレス平文公開（FR-29 でフォーム化が確定）

## 正式化時の PBI 分割案（1 項目 1 PBI、着手順）

### 1. Skills / 資格データの現行化
- 運営者インプット：各スキルの現在の経験年数、追加・削除すべき項目、資格の追加有無
- Claude 実装：`src/data/skills.ts` / `src/data/qualifications.ts` 更新
- 受け入れ条件：運営者が表示内容を「現在の実態として正確」と承認

### 2. Career データの現行化 + 代表案件追記（R-08 対応）
- 運営者インプット：過去 20 年分から代表案件 1-2 件のサマリ（時期・役割・技術・規模）、既存 2 件の記載内容の確認
- Claude 実装：`src/data/career.ts` 更新
- 受け入れ条件：About の経歴記述（25 年）と Career ページの整合、運営者承認

### 3. About / Privacy 文面の事実確認・確定
- 運営者作業：全文を読んで事実誤認・表現の修正指示 → 承認
- Claude 実装：修正反映
- 受け入れ条件：両ページとも運営者の明示承認を実装ログに記録

### 4. Contact フォーム化（FR-29 / Decision #26）
- 構成：Worker エンドポイント `/api/contact`（wrangler.jsonc に main スクリプト追加、assets と併存）+ Cloudflare Turnstile（サーバー側検証必須）+ Resend で `tanimoto@byte-lark.com` へ通知送信
- 送信元は `send.byte-lark.com` サブドメインで認証（ルートの SPF / DKIM は Xserver メール運用が使用中のため触らない）。認証用 DNS レコードは **現 Xserver DNS に追加**（NS 移管を待たない。移管時の引き継ぎリストに含める → draft-phase1d 参照）
- 運営者作業：Resend アカウント作成、ドメイン認証レコードの DNS 登録（値は Claude が用意）、API キー発行
- API キーは Workers secret（`wrangler secret` or ダッシュボード）。リポジトリに置かない
- レートリミット（同一 IP の連続投稿抑止）を実装
- mailto 表記を撤去し、ページ本文からメールアドレスを除去
- 受け入れ条件：フォーム送信 → 受信確認、Turnstile 失敗時の拒否確認、E2E テスト追加、`yarn build` / `check:ts` グリーン
- 注意：かつて定番だった MailChannels の Workers 無料送信は 2024 年に終了。Resend 無料枠（登録時に最新条件を確認）で月数十件は十分

### 5. サンプル記事の処置
- `hello-astro-content-collections` を削除するか実記事に書き換えるか判断し実施
- 受け入れ条件：本番ビルドにサンプル記事が含まれない（または実記事化済み）

### 6. 記事ネタ出し・初期記事セット確定
- 運営者 + Claude でネタ出し → 公開時に揃える本数と各テーマをここで確定（writing-workflow.md のプロセスを使用）
- **この PBI の完了時に、確定した本数分の「記事実装 PBI（1 記事 1 PBI）」を追加起票する**

### 7. 記事実装 × n（6 の結果で追加起票）
- writing-workflow.md §ヒアリング → ドラフト → 運営者リライト → published
- 受け入れ条件（各記事共通）：frontmatter 完備、OGP / JSON-LD 出力確認、運営者の最終承認

## 正式化時の注意

- 番号は 1b 起票セッションで着手順に付番（本ドラフトの順序を推奨）
- PHASE1A-022 Gate の「Phase 1b への申し送り」と Phase 1a 各 PBI の実装ログを読み込んでから正式化する（CLAUDE.md の draft 手順どおり）
- 1-3 は運営者インプット待ちが発生し得るため、待ち時間に 4（フォーム）を進める並行運用を推奨
