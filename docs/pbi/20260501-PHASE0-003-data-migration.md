# Claude は archive ブランチから Career / Skills データを Astro プロジェクトに移植できる

Status: NotStarted

## 誰が
- Claude

## 何をできる
- `archive/vite-react-chakra` ブランチから Career データと Skills データを取り込み、Astro 用の `src/data/career.ts` / `src/data/skills.ts` として整形配置する
- Career のダミーデータ（id=3, id=4 の境界テスト用文字列）を排除する
- Skills のアイコンを optional 化し、未指定時はテキストのみで表示できる構造にする

## なんのために
- 既存の実データ資産を Phase 1a の Career / Skills 表示で利用可能にするため
- Phase 0 で Phase 1a を止めないため、アイコン未確定の項目は一旦テキストフォールバックで進める
- 関連: FR-03 / FR-04 / FR-05 / Phase 0

## 受け入れ条件
- [ ] `src/data/career.ts` が存在し、archive ブランチの `src/features/career/data/Career.ts` 内容を移植している
- [ ] Career データから id=3（`ーーーー＋ーーーー１ーーーー＋ーーー９` 等のダミー文字列）を削除
- [ ] Career データから id=4（`長いタイトルの文字列。３０文字程度...`）を削除
- [ ] Career の型定義（CareerItem 等）も `src/types/career.ts` に移植
- [ ] `src/data/skills.ts` が存在し、archive ブランチの `src/features/skills/data/Skill.ts` 内容を移植している
- [ ] Skills の型定義の `icon` フィールドを **optional** にする（`icon?: string`）
- [ ] Skills 全 26 件のうち、明らかに代替不適切な以下 2 件は **icon フィールドを未設定**にする（テキストのみ表示）：
  - [ ] id=11 VB.Net（旧設定: `vscode-original.svg`）
  - [ ] id=25 GAS（旧設定: `google-original.svg`）
- [ ] 他のアイコン URL の jsdelivr 外部依存は **Phase 0 では維持**（vendor in 方針は Phase 1a 以降で別 PBI 起票）

### ロゴ画像の取り込み
- [ ] archive ブランチから `src/assets/logo.png` を取り込み（暫定流用、Phase 1b で SVG に置換）
  ```bash
  git checkout archive/vite-react-chakra -- src/assets/logo.png
  ```
  ※ バイナリは `git show > file` だと改行変換で壊れる可能性があるため `git checkout -- <path>` を使用

### 確認
- [ ] `yarn check:ts` でエラーなし
- [ ] feat/phase-0 上で 1 コミットとして記録されている

## 技術メモ
- 取り込みコマンド例：
  ```bash
  git show archive/vite-react-chakra:src/features/career/data/Career.ts > src/data/career.ts
  git show archive/vite-react-chakra:src/features/skills/data/Skill.ts > src/data/skills.ts
  git show archive/vite-react-chakra:src/features/career/types/Career.ts > src/types/career.ts
  git show archive/vite-react-chakra:src/features/skills/types/Skill.ts > src/types/skills.ts
  # その後、import パス修正・ダミー削除・icon optional 化
  ```
- export 名は維持（`Career`, `CareerDetailData`, `skills` 等）
- icon optional 化に伴い、表示側（Phase 1a）では `icon` 未設定なら名称テキスト + デフォルト枠で描画する想定。これは Phase 1a の SkillSet コンポーネント PBI 側で対応

## 備考
### Career データ移植時の構造変更
- 旧パス：`src/features/career/data/Career.ts` → `CareerItem[]`
- 新パス：`src/data/career.ts` → `CareerItem[]`（型は別ファイル化）
- export 名維持

### Skills アイコン代替方針（運営者判断済）

**方針**：
1. **Phase 0**：明らかに不適切な 2 件（VB.Net / GAS）は icon 未設定 → テキストのみ表示
2. **Phase 1a または 1b**：代替アイコンを探索（Microsoft VB ロゴ、Google Apps Script ロゴ等）→ 見つかれば差し替え
3. **見つからなければ**：テキスト維持

| id | 名称 | 旧設定 | Phase 0 での扱い |
|---|---|---|---|
| 11 | VB.Net | vscode-original.svg | icon 未設定（テキストのみ） |
| 25 | GAS | google-original.svg | icon 未設定（テキストのみ） |

他 24 件の icon URL は jsdelivr の devicon を維持。Phase 1a で vendor in 方針を別途決定。

## 実装ログ
（未着手）
