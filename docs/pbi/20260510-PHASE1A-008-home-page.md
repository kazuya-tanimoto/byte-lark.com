# 訪問者はトップページで職能概要・経歴・スキル・最新記事を一覧できる

Status: Done
Started: 2026-06-07
Completed: 2026-06-08

## 誰が
- 訪問者

## 何をできる
- トップページの Hero で名前・肩書・キャッチコピーを確認できる
- Career / Skills の抜粋から詳細ページへ遷移できる
- Qualifications セクションで保有資格を確認できる
- 最新 Blog 記事を確認し、Blog 一覧ページへ遷移できる

## なんのために
- エージェント担当者・クライアント PM が候補者の職能を素早く把握するため（ペルソナ: 高優先度）
- サイトの全コンテンツへの入口として機能させるため
- 関連: site-plan.md §6.1 / FR-01 / FR-02 / FR-13 / FR-15

## 受け入れ条件
- [x] `src/pages/index.astro` を実装
- [x] Hero セクション: 名前・肩書・要約・主要リンク（Q1 で文言決定）
- [x] Career 抜粋: `src/data/career.ts` から直近 N 件を表示、`/career` へのリンク
- [x] Skills 抜粋: `src/data/skills.ts` から上位 M 件を表示、`/skills` へのリンク
- [x] `src/data/qualifications.ts` を作成（Qualifications セクションのデータソース）
- [x] Qualifications セクション: 保有資格を表示（独立ページなし、FR-15）
- [x] 最新記事セクション: Content Collections から最新 N 件を BlogCard で表示、`/blog` へのリンク
- [x] `src/components/Hero.astro` を作成
- [x] `src/components/BlogCard.astro` を作成（Blog 一覧 PBI でも使用）
- [x] レスポンシブ対応（モバイル / タブレット / デスクトップ）
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- Hero / BlogCard / CareerTimeline 抜粋 / SkillSet 抜粋は全て Astro コンポーネント（静的、JS 不要）
- Q1 の Hero 文言は Claude が 3 案ドラフト → 運営者選定の流れ
- Career / Skills の抜粋件数（N / M）は実データを見て決定

## 備考
- R-05: Hero 文言が決まらない場合はプレースホルダーで先に実装し、後から差替可能な構造にする
- R-08: Career 実データが少ない場合の見え方を確認、必要なら視覚調整

## 実装ログ

### 2026-06-07

**重要: このセッションから運用フロー変更（試験運転中）**。sub-branch 廃止、常設 worktree `.claude/worktrees/phase-1a`（feat/phase-1a を checkout 済み）に直コミット・直 push する。本体リポジトリは main に退避済み。§10.4-10.5 の旧フロー（PBI 毎 sub-branch + merge）は使わない。008 完了時に README §10 / CLAUDE.md の規約改訂もこの PBI に同梱すること。

やったこと:
- 実装完了: `src/components/Hero.astro` / `src/components/BlogCard.astro` / `src/data/qualifications.ts` / `src/types/qualifications.ts` / `src/pages/index.astro` 全面書き換え（Hero + Career 抜粋 2 件 + Skills 抜粋 8 件 + Qualifications 5 件 + 最新記事 3 件）
- Hero 文言は 3 案から運営者が案 3 を選定・反映済み（「現場を前に進める PM / PO」）
- 資格データは ~/src/career-docs/master-career-data.md の「保有資格」から転記（公開可能情報のみ。単価等の機微情報は使用しない）
- `.gitignore` に `.claude/worktrees/` 追加（運営者承認済み）
- worktree 側 `.claude/settings.json` に `sandbox.network.allowLocalBinding: true` 追加（本体側と同内容。dev server を sandbox 内起動するため。**network sandbox はセッション起動時固定**のため次セッションから有効）
- yarn build / check:ts / check（biome）すべて green

残タスク（次セッション）:
1. リポジトリルートで起動 → EnterWorktree(path: ".claude/worktrees/phase-1a") で常設 worktree に入る
2. `yarn dev` を sandbox 内 background 起動（allowLocalBinding が効くはず。EPERM が出たら運営者に報告、excludedCommands は勝手に入れない）
3. Playwright で Home を打鍵検証（デスクトップ + モバイル幅、各セクション表示・リンク遷移）→ 検証報告を出す
4. 受け入れ条件チェック → Status: Done → INDEX 同期
5. feat/phase-1a に直 commit（settings.json の変更は dev server 動作確認が取れた場合のみ同梱、コミット前に運営者に一声）→ 直 push（旧フローの merge 工程は無い）
6. push 後 Cloudflare の version preview を確認

学び・つまずき:
- worktree の node_modules は「main から各パッケージを個別 symlink + `.vite` `.vite-temp` `.astro` は実ディレクトリ」でセットアップ済み（worktree 常設化により再構築不要になった）
- tracked な `.claude/settings.json` は worktree checkout が古いままになりがち。設定変更時は本体と worktree 両方を確認すること
- 常設 worktree 作成時、EnterWorktree が作る仮ブランチ（旧 main 基点）では settings.local.json が tracked のため `git switch` が衝突 → symbolic-ref + reset --mixed + `git checkout -- .` で解決した（再発しない一度きりの問題）

### 2026-06-08

やったこと:
- Playwright で Home ページ検証（デスクトップ幅・モバイル 390px 両方スクリーンショット確認）
- コンソールエラー 24 件はフォント woff2 の 403（Vite dev server @fs sandbox 制限）と favicon.ico 404。本番ビルド非影響、対応不要と判断
- 全受け入れ条件チェック済み → Status: Done
- CLAUDE.md Sandbox 制約行を新フローに更新
- docs/pbi/README.md §10 を v2.9 に刷新（sub-branch 廃止・常設 worktree 直 push フロー）
- INDEX.md を同期（008 → Done）
