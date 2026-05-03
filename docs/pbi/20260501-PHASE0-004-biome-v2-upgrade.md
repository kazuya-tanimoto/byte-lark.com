# Claude は Biome v2 で Astro プロジェクトの lint を実行できる

Status: NotStarted

## 誰が
- Claude

## 何をできる
- Biome を v1.9.4 から v2 系最新に更新し、`.astro` ファイルにも対応した設定で lint / format を実行できる

## なんのために
- 既存の Biome 採用方針を維持しつつ、Astro 構文に対応するため
- 関連: NFR-04 / Decision Log #8 / Phase 0

## 受け入れ条件
- [ ] `package.json` の `@biomejs/biome` が v2 系最新に更新されている
- [ ] `biome.jsonc` が v2 のスキーマに準拠している（`$schema` URL を v2 に更新）
- [ ] `.astro` ファイル向けの override **セクション枠**だけ用意されている（中身のルール追加は誤検知発生時に対応する方針、Phase 0 では空 override で OK）
- [ ] `yarn check`（`biome check src`）が成功する（エラーゼロ）
- [ ] `yarn fix`（`biome check --write src`）が成功する
- [ ] 旧設定（v1 でしか有効でなかったオプション）が残存していない
- [ ] feat/phase-0 上で 1 コミットとして記録されている

## 技術メモ
- Biome v2 移行ガイド：https://biomejs.dev/guides/upgrade-to-biome-v2/
- `.astro` 言語サポート状況：https://biomejs.dev/internals/language-support/
- 移行コマンド例：
  ```bash
  yarn add -D @biomejs/biome@latest
  npx @biomejs/biome migrate --write
  ```
- `migrate` コマンドが `biome.jsonc` を自動更新する。手動修正が必要な箇所はコマンドが指示

## 備考
### .astro override 設定（先回り設定の禁止と必須化の整合）

Phase 0 では **空 override セクションのみ** 用意：

```jsonc
{
  "overrides": [
    {
      "include": ["**/*.astro"],
      "linter": {
        "rules": {
          // 誤検知発生時にここへ追加する（Phase 0 では空のまま）
        }
      }
    }
  ]
}
```

**運用方針**：
- 先回りでルール off 設定はしない
- 実際に `yarn check` 実行時の誤検知を観察 → 個別に off 追加（Phase 1a 以降の実装中に対応）
- セクション枠だけ用意しておく理由：ルール追加時に構造を考えなくていい

## 実装ログ
（未着手）
