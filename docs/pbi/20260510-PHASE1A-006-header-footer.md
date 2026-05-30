# 訪問者は全ページで統一されたヘッダーナビとフッター（法人情報・SNS リンク）を利用できる

Status: Done
Started: 2026-05-17
Completed: 2026-05-18

## 誰が
- 訪問者

## 何をできる
- 全ページ共通のヘッダーからサイト内の各ページへナビゲーションできる
- フッターで法人メタ情報（社名・所在地・メール）と SNS リンクを確認できる

## なんのために
- サイト全体の回遊性とブランド認知を確保するため
- 法人メタ情報の最小配置を Phase 1a で整備し、法人化後（§13.2）の差替に備えるため
- 関連: site-plan.md §6.5.5 / §6.5.6 / FR-12 / FR-23

## 受け入れ条件
- [x] `src/components/Header.astro` を作成（Astro 自前、React Island 不使用）
- [x] Header にサイトロゴ + 全ページへのナビリンク（Home / About / Career / Skills / Blog / Contact）
- [x] モバイル時のレスポンシブメニュー（ハンバーガー or 折りたたみ）
- [x] `src/components/Footer.astro` を作成（Astro 自前）
- [x] Footer に法人メタ情報（「byte-lark（個人事業主）」表記、§13.1 準拠）
- [x] Footer に Amazon アソシエイト参加表記枠（FR-23、参加前はプレースホルダー or 非表示）
- [x] Footer に SNS リンク（Q6 で配置・種類を決定: GitHub / X 等）
- [x] Footer にコンテンツライセンス表記（Q12 で決定）
- [x] Footer に copyright 表示
- [x] BaseLayout（PHASE1A-005）に Header / Footer を組み込み
- [x] レスポンシブ対応（モバイル / タブレット / デスクトップ）
- [x] `yarn build` 成功
- [x] `yarn check:ts` エラーなし

## 技術メモ
- Header / Footer は静的部品のため Astro コンポーネントで実装（shadcn/ui 不使用、Decision #16）
- モバイルメニューの開閉は Astro の `<script>` タグで最小限の JS、または CSS-only（details/summary）で実現可能
- Q3（Contact メール）/ Q4（Footer 法人メタ）/ Q6（SNS リンク）/ Q7（ドメインメール）/ Q12（記事ライセンス）の決定をこの PBI で反映

## 未決事項の決定記録
- Q3: tanimoto@byte-lark.com を Footer / Contact 共通で使用
- Q4: 「byte-lark（個人事業主）」＋「2026年6月 法人化予定」（§13.1 準拠）
- Q6: GitHub のみ（https://github.com/kazuya-tanimoto）、X は載せない
- Q7: 法人化前は tanimoto@byte-lark.com に統一（個人メール不使用）
- Q12: CC BY 4.0（記事コンテンツ）

## 実装ログ

### 2026-05-18

- やったこと:
  - Header.astro 作成（ナビリンク 6 件、ハンバーガーメニュー、アクティブリンクハイライト）
  - Footer.astro 作成（法人メタ、Links、Contact メール、GitHub リンク、CC BY 4.0、copyright、Amazon アソシエイト枠）
  - BaseLayout に Header / Footer 組み込み（flex min-h-dvh で Footer 底部固定）
  - Q3/Q4/Q6/Q7/Q12 の未決事項を運営者と決定
- 残タスク: なし
- 学び: Astro の `<script>` タグでのモバイルメニュー開閉は問題なく動作
- 想定外: なし
