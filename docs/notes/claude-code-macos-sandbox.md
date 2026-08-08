# Claude Code × macOS sandbox 運用メモ

> 別セッションでも使い回す前提の調査メモ。一次情報（公式docs / Anthropicブログ）で裏取り済み。
> 作成日: 2026-06-28

## この問い

Claude Code を macOS の sandbox 上で動かすと、書き込み先やネットワーク先が制限されて
「Claude だけで自走しきれない」場面が出る。世の中ではどう対応しているか、取りうる方法と
メリデメを知りたい。当初の候補は次の4つ:

1. 諦める（毎回承認する）
2. sandbox を使わない
3. sandbox を使うが、必要に応じて設定で制限を緩める
4. Claude 専用（or 壊れてもいい）PC を用意してフル権限で動かす

## 結論

- **「設定で緩める」が公式推奨の本筋**。sandbox は「オフにする/専用機に逃がす」ものではなく、
  必要な穴を設定で開けながら使う前提で設計されている。
- 個人開発で承認を減らしたいだけ → **sandbox は使ったまま、詰まった所だけ設定で開ける**。
- 完全に放置して自走させたい（`--dangerously-skip-permissions`）→ **bare の sandbox 緩和では不十分**。
  公式は **コンテナ / VM の中で動かせ** と明言。
- 「専用PCでフル権限」案は、その「隔離環境で自走」の物理版。アリだが隔離としては弱い
  （実OS・実認証情報がそのまま晒される）。同じ機械でもコンテナ/VM を噛ませる方が筋が良い。

重要な軸の分離: **「自走のしやすさ」と「隔離の強さ」は別軸**。
当初候補はこの2軸が混ざっている。承認を減らすだけなら方法3、放置自走なら方法4〜（コンテナ/VM/web）。

## 何で詰まるか（典型パターン）

公式 docs（Troubleshooting / Limitations）より、自走が止まる典型:

- 許可外ホストへの通信（CLI ツールが外部 API を叩く時）。既定で事前許可ドメインはゼロ。
- 作業ディレクトリ外への書き込み（`~/.kube`、グローバルキャッシュ等）。
  既定の書き込み許可は「作業ディレクトリ＋セッション temp（`$TMPDIR`）」のみ。
- sandbox と相性が悪いツール:
  - `docker` … 非互換。`excludedCommands` に `docker *`。
  - `gh` / `gcloud` / `terraform` … macOS Seatbelt 下で TLS 検証に失敗 → `excludedCommands`。
  - `jest` … watchman 非互換 → `jest --no-watchman`。
  - `open` / `osascript` … Apple Events が既定ブロック（error -600）→ `allowAppleEvents: true`（要注意、後述）。
- **Read/Edit 等のファイルツール・MCP サーバー・hook は Bash sandbox の外**で動く。
  だから bare の Bash sandbox だけでは「完全自走の隔離」にはならない。

> 補足: 既定の read は「クレデンシャルも含めてマシン全体読める」。`~/.aws/credentials` や `~/.ssh/`
> も既定では読める。気になるなら `sandbox.credentials` か `filesystem.denyRead` で塞ぐ。

## 取りうる方法とメリデメ

| 方法 | 隔離の強さ | 自走のしやすさ | 手間 | 向き |
|------|-----------|--------------|------|------|
| 諦める（毎回承認） | — | 低 | なし | 触り始め |
| sandbox 無効で生実行 | なし | 高 | なし | **非推奨**。実OS・認証情報が無防備 |
| sandbox ＋ 設定で緩める | 中 | 中〜高 | 小 | **個人開発の本命** |
| devコンテナ（公式雛形・firewall付き） | 高 | 高（skip-perms可） | 中 | チーム標準化・放置自走 |
| VM / Docker microVM | 最強 | 高 | 大 | 信頼できないコード |
| Claude Code on web（Anthropic管理VM） | 高 | 高 | ほぼ無 | 端末に環境を作りたくない |
| 専用/壊れてもいいPCでフル権限 | 弱（実OSが境界） | 高 | 中 | 割り切り運用。隔離は弱い |

## 世の中の事例

- **Anthropic 公式の本筋**: built-in sandbox（macOS は Seatbelt、追加インストール不要）＋
  許可リストを必要に応じて広げる。**承認プロンプトが約84%減**と公表。
  `/sandbox` コマンドに auto-allow モードがあり、sandbox 境界内の Bash は無確認実行。
- **コミュニティの軽量ツール**: `claude-sandbox`（kohkimakimoto 氏）、`neko-kai/claude-code-sandbox` など、
  Seatbelt の `sandbox-exec` を被せて「書き込みは作業ディレクトリだけ」を手軽に実現。
  Playwright のような自前 sandbox を持つツールとの競合回避の仕組みも。
- **放置自走の定番**: 公式 devコンテナ雛形（default-deny の iptables ファイアウォール入り）の中で
  `--dangerously-skip-permissions` を回す。想定外の通信をファイアウォールが止めるので無人実行を許容しやすい。
- **信頼できないコード**: 専用 VM、Firecracker 等の microVM、Docker Desktop の sandbox 機能、
  または **Claude Code on the web**（Anthropic 管理 VM ＋ GitHub トークンを外に隔離）。
- **「壊れてもいいPC」案**: 実態は「隔離環境で自走」の物理版。やる人はいるが、隔離境界が実OS自身なので
  同じ機械にコンテナ/VM を入れて二重化するのが定石。

## 具体的にどう緩めるか（設定キー）

`~/.claude/settings.json`（全プロジェクト）か `.claude/settings.local.json`（このプロジェクトだけ、git管理外）に記述。

```jsonc
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["~/.kube", "/tmp/build"]   // 作業ディレクトリ外の書き込み先を追加
    },
    "allowedDomains": ["registry.npmjs.org", "*.supabase.co"],  // 通信先を事前許可（毎回の承認を消す）
    "excludedCommands": ["docker *", "gh", "gcloud", "terraform"], // sandbox に入れず外で実行
    "allowUnsandboxedCommands": true   // 失敗時に外で再実行する逃げ道（既定 true）。厳格にするなら false
  }
}
```

その他のキー / 操作:

- `/sandbox` … ターミナルで打つとパネル表示（Mode / Overrides / Config）。モード選択は `settings.local.json` に書き込まれる。
- `allowAppleEvents: true` … `open` / `osascript` を許可。ただし**コード実行隔離が外れる**（user/managed/CLI settings のみ有効、project settings では不可）。
- `sandbox.credentials` … クレデンシャルファイル/環境変数を sandbox から隠す（v2.1.187+）。
- `failIfUnavailable: true` … sandbox が起動できない時に警告で素通りせず起動失敗にする（managed 運用向け）。
- ツール別対処: `jest --no-watchman`、`docker *` を `excludedCommands` 等。

### 緩める時の注意

- **filesystem と network の両方の隔離が揃って初めて意味がある**（公式の Warning）。
  片方を広げる時、もう片方の制限を打ち消していないか確認する。
- `github.com` のような広いドメイン許可はデータ持ち出し経路になりうる（proxy は TLS を覗かないため domain fronting 余地あり）。
- `allowWrite` で `$PATH` 上の実行ファイル置き場や `.bashrc`/`.zshrc` を許すと権限昇格の温床になる。
- sandbox は完全な隔離境界ではない。信頼できないコードを扱うなら VM へ。

## 自走モードとの関係（混同しやすい点）

- `/sandbox` の auto-allow … 「Bash が実行された後に**何に触れるか**」を境界で制限。
- auto モード … 「各ツール呼び出しを**実行してよいか**」を分類器がレビュー。
- `--dangerously-skip-permissions` … 承認レビューをほぼ全部外す。これを使うなら
  **必ずコンテナ/VM/sandbox-runtime の中で**（ファイルツール・MCP・hook も境界内に入れるため）。
- bare の Bash sandbox は Bash しか縛らないので、**単体では完全無人実行には不十分**。

## 推奨（個人開発・自分の手元リポジトリの場合）

1. 普段の開発: **sandbox は使ったまま、詰まったホスト/書き込み先だけ `settings.local.json` に足す**。
   Supabase / Vercel / yarn が叩く先を `allowedDomains` に、`docker` を `excludedCommands` に入れれば
   自走の止まりはかなり消える。設定はリポジトリ固有なので local settings に寄せるのが安全。
2. 夜間放置で大きめタスクを回したい時だけ: **公式 devコンテナ雛形を導入し、その中で
   `--dangerously-skip-permissions`**。母艦の実OSと認証情報を守りつつ無人実行できる。
   「専用PCフル権限」よりこちらを推す（隔離が本物で、壊す範囲がコンテナ内に閉じる）。

「sandbox 使わない」「諦める」は、前者は安全性を捨てるだけ、後者は不満そのものなので積極的には勧めない。

## Sources（一次情報）

- Configure the sandboxed Bash tool（公式）: https://code.claude.com/docs/en/sandboxing
- Choose a sandbox environment（公式）: https://code.claude.com/docs/en/sandbox-environments
- Making Claude Code more secure and autonomous with sandboxing（Anthropic）: https://www.anthropic.com/engineering/claude-code-sandboxing
- Sandboxing Claude Code on macOS: What I Actually Found（Infralovers）: https://www.infralovers.com/blog/2026-02-15-sandboxing-claude-code-macos/
- claude-sandbox（kohkimakimoto, DEV）: https://dev.to/kohkimakimoto/claude-sandbox-yet-another-sandboxing-tool-for-claude-code-on-macos-o6n
- neko-kai/claude-code-sandbox（GitHub）: https://github.com/neko-kai/claude-code-sandbox
- Taming the Permission Nag — Sandboxing Claude Code on macOS: https://davidrothera.me/posts/taming-the-permission-nag-sandboxing-claude-code-on-macos/
