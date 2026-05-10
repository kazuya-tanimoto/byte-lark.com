# 訪問者は全ページで統一されたヘッダーナビとフッター（法人情報・SNS リンク）を利用できる

Status: NotStarted

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
- [ ] `src/components/Header.astro` を作成（Astro 自前、React Island 不使用）
- [ ] Header にサイトロゴ + 全ページへのナビリンク（Home / About / Career / Skills / Blog / Contact）
- [ ] モバイル時のレスポンシブメニュー（ハンバーガー or 折りたたみ）
- [ ] `src/components/Footer.astro` を作成（Astro 自前）
- [ ] Footer に法人メタ情報（「byte-lark（個人事業主）」表記、§13.1 準拠）
- [ ] Footer に Amazon アソシエイト参加表記枠（FR-23、参加前はプレースホルダー or 非表示）
- [ ] Footer に SNS リンク（Q6 で配置・種類を決定: GitHub / X 等）
- [ ] Footer にコンテンツライセンス表記（Q12 で決定）
- [ ] Footer に copyright 表示
- [ ] BaseLayout（PHASE1A-005）に Header / Footer を組み込み
- [ ] レスポンシブ対応（モバイル / タブレット / デスクトップ）
- [ ] `yarn build` 成功

## 技術メモ
- Header / Footer は静的部品のため Astro コンポーネントで実装（shadcn/ui 不使用、Decision #16）
- モバイルメニューの開閉は Astro の `<script>` タグで最小限の JS、または CSS-only（details/summary）で実現可能
- Q3（Contact メール）/ Q4（Footer 法人メタ）/ Q6（SNS リンク）/ Q7（ドメインメール）/ Q12（記事ライセンス）の決定をこの PBI で反映
