# 訪問者は Skills ページで全スキルをカテゴリ別に閲覧できる

Status: InProgress
Started: 2026-06-12

## 誰が
- 訪問者

## 何をできる
- 全スキルをカテゴリ別にグルーピングされた形で閲覧できる

## なんのために
- エージェント担当者・クライアントが運営者の技術スキルセットを詳細に確認するため
- Home の抜粋では伝えきれない全カテゴリ・全アイテムを専用ページで提示するため
- 関連: site-plan.md §6.1 / FR-05

## 受け入れ条件
- [ ] `src/pages/skills.astro` を実装
- [ ] `src/data/skills.ts` の全カテゴリ・全アイテムを表示
- [ ] `src/components/SkillSet.astro` を作成
- [ ] カテゴリごとにグルーピング表示
- [ ] 各スキルにアイコン表示（既存データにアイコン URL がある場合）
- [ ] PageLayout を使用
- [ ] OGP メタ（title / description）が正しく出力
- [ ] レスポンシブ対応
- [ ] `yarn build` 成功
- [ ] `yarn check:ts` エラーなし

## 技術メモ
- SkillSet は静的コンポーネント（Astro 自前、JS 不要）
- `src/data/skills.ts` は PHASE0-003 で移植済み
- アイコンは既存データの URL を使用（VB.Net / GAS の代替アイコンは site-plan §6.7 の既存資産取扱い方針に従い判断）
- グリッドレイアウト（Tailwind `grid`）でカテゴリ別表示が自然
