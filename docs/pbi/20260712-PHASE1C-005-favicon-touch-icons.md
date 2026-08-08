# 訪問者はブランド確定意匠の favicon / apple-touch-icon を各ブラウザ・端末で見られる

Status: Done
Started: 2026-08-01
Completed: 2026-08-01

## 誰が
- 訪問者

## 何をできる
- ブラウザタブ・ブックマーク・ホーム画面追加で、確定ブランド意匠のアイコンを見られる

## なんのために
- 現行 favicon は Phase 1a の暫定意匠（sky ブルー角丸 + 白 "b"、`public/favicon.svg`）。確定ブランドカラー / 新ロゴに合わせて差し替える
- 関連: site-plan.md §6.4（favicon.svg〔暫定〕）/ §8 Decision #28 / draft-phase1c-design-polish.md B-4 / Phase 1c 先行トラック

## 受け入れ条件
- [x] 確定ブランドカラー（PHASE1C-002）+ 新ロゴ意匠（PHASE1C-004）に合わせて `public/favicon.svg` を差し替え
- [x] apple-touch-icon（180×180 PNG）を追加し、BaseLayout の `<head>` にリンク。他サイズ展開の要否もここで判断し実装ログに記録
- [x] ブラウザタブでの表示確認（小サイズで意匠がつぶれないこと。スクショ）
- [x] `yarn build` / `yarn check:ts` エラーなし
- [x] ローカル スクショ確認（desktop + mobile）（CLAUDE.md §7）
- [x] CF preview スクショ確認（branch alias URL）（CLAUDE.md §7）
- [x] E2E / CI green 確認（push 後 `scripts/ci-status.sh` で UI Tests=success）（CLAUDE.md §7）

## 技術メモ
- 想定セッション数: 1
- 依存: PHASE1C-002（確定カラー）+ PHASE1C-004（ロゴ意匠）。004 が R-06 発動（現行ロゴ続行）の場合は、確定カラー + 現行意匠ベースで作成し、その旨を実装ログに記録
- site-plan §6.4 の `favicon.svg`〔暫定・意匠は Phase 1c〕注記を本 PBI 完了時に更新

## 備考
- Phase 1c 先行トラック（site-plan v3.10 §8 Decision #28）。draft-phase1c-design-polish.md B-4

## 実装ログ

### 2026-08-01

#### 意匠の決定（C 案：sky タイル + 白抜き）

- 着手時に食い違いを発見：`design-direction.md` §6 はロゴを「sky 基調 + sun」と書いていたが、004 の確定意匠は**墨一色**（`currentColor`）だった。ヘッダーの実測値も `oklch(0.304 0.011 73.5)`（= foreground `#322E29`）でリング・鳥とも墨。004 実装ログ ラウンド 7 に理由（Twitter 旧ロゴに似せない防波堤 / ダークモードでの自動反転）があり実装が正、文書が未更新だった → §6 を実態に更新（運営者承認）
- そこで「favicon もロゴと同じ墨一色にするか」が最初の判断になった。案を 6 つ実寸（16 / 20 / 32 / 48 / 180px）で並べたモックを作り運営者に提示：`docs/design-drafts/phase1c-005/favicon-candidates.html`
  - A 透過 + 墨（ヘッダーと同一）／A+ 透過 + OS 追従で反転／B 暖白タイル + 墨／C sky タイル + 白抜き／D 墨タイル + 暖白抜き／E 暖白タイル + 墨鳥 + sun リング
- 観察：A は暗いタブで消える。B は明るいタブで白タイルが地に溶けて 16px の輪郭が弱い。D は暗いタブでタイルが地に溶ける。E は 180px はきれいだが 16px で黄のリングが沈む。C だけが明暗どちらのタブでも同じ強さで判別できた
- **運営者が C を選定**。ロゴ本体（墨一色）とアイコン（sky タイル）を別扱いにした理由：タブやホーム画面ではサイトの地の色が使えず、並んだタブの中から 16px で見つけてもらうには塗りタイルの方が強い。形の語彙（冠羽・上昇姿勢・切れ目リング）は logo-badge.svg のままなので血縁は保たれる

#### 生成物と他サイズ展開の判断

`scripts/generate-icons.mjs` を新設し、`src/assets/logo-badge.svg` を唯一の原本として 3 つを生成する形にした（ロゴを差し替えたら `node scripts/generate-icons.mjs` で再生成）。出力は 3 ファイル：

- `public/favicon.svg` — 32 グリッド、角丸 7、余白 4.5。タブの主役
- `public/favicon.ico` — 16 + 32 の 2 サイズを PNG のまま ICO コンテナに詰めた（依存追加なしでヘッダを手組み）
- `public/apple-touch-icon.png` — 180×180、角丸なしの塗り足し正方形、余白 25

**他サイズ展開は不要と判断**。根拠は「今どき必要なのは svg / ico / apple-touch-icon の 3 つ」という現行の定説（[Evil Martians](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)）で、192/512 の PNG は manifest を置いて PWA にする場合のみ要る。本サイトは PWA 化の予定がないため見送り。ico を入れたのは、`rel` を見ずに root の `/favicon.ico` を直接取りに来る RSS リーダー等があるため（本サイトは RSS を配信している）

#### つまずき：ICO の四隅が白くなっていた

- 最初の生成では ICO をヘッドレスブラウザの通常スクショで作ったため、角丸の外側がページ地の白で埋まり、**暗いタブで四隅に白いカドが出る**状態だった（実寸シートで発見）
- 修正：ラスタライズに透過の要否を渡す形にし、ico は `omitBackground: true`（透過で抜く）、apple-touch-icon は `false`（不透明のまま）に分けた。iOS は透過部分を黒で埋めるため touch icon 側は抜いてはいけない（[realfavicongenerator](https://realfavicongenerator.net/blog/apple-touch-icon-turns-black) / [makandra](https://makandracards.com/makandra/26757-do-not-use-transparent-pngs-for-ios-favicons)）
- 修正後は `file` コマンドで ico=RGBA / touch icon=RGB を確認済み

#### 派生対応：リングの切れ目の位置を揃えた

- 運営者がアイコンを見て「リングの切れ目が左下だが左上ではなかったか」と指摘 → 実測したところ**バッジは左下（7 時〜8 時半）、フルマークは上**で、2 つが揃っていなかった
- さらに 004 実装ログ ラウンド 7 には「切れ目は左上=翼の延長方向。W120・切れ目左上を運営者承認」とあり、**記録（左上）と実物（左下）が食い違っていた**。`logo-badge.svg` は 875c0bf で追加されて以降変更されていないため、記録側の誤りか、位置変更後に記録を直さなかったかのどちらか（当該セッションの経緯は追えず）
- 比較画像を作って運営者に提示（`docs/design-drafts/phase1c-005/ring-gap-compare.png`。今のフルマーク / 今のバッジ / 切れ目を左上へ回した案を、大サイズ + 26px + 16px で並べたもの）→ **運営者が「左上へ回す」を選定**
- 対応：`logo-badge.svg` のリング（円弧 path）の端点を中心 (1024,1024) 回りに 72.5° 回転させて焼き込んだ（`M348 1205A700 700 0 1 1 674 1630` → `M648.1 433.7A700 700 0 1 1 340.8 872.4`）。transform 属性は残さず座標を書き換えている。鳥は不変
- これでフルマークと同じ「翼の側で切れる」構図に揃った。懸念していた尾とリングの重なりは 26px / 16px の実寸で確認して問題なし
- アイコン 3 種は原本から生成しているため、`node scripts/generate-icons.mjs` の再実行だけで追随した

#### 検証

- `yarn build` / `yarn check:ts`（0 errors）/ `yarn check`（biome）/ `yarn test:run`（30 passed）/ `yarn test:e2e`（33 passed、コンテナ内実行）
- 配信実物を dev server から取得して 16 / 20 / 32 / 48 / 180px で並べ、明るいタブ・暗いタブ両方で確認。3 ファイルとも 200 で返り、head に link 3 本が出ることも確認
- **ブラウザの実タブそのものは撮れない**（ヘッドレスにブラウザ枠がないため）。実寸レンダリングでの代替確認である旨を明記しておく
- CF preview（branch alias）でも同じ確認を実施。3 ファイルとも 200 で、バイト数はローカルと一致（svg 7802 / ico 2019 / png 7116）、Content-Type は `image/svg+xml` / `image/vnd.microsoft.icon` / `image/png`。head の link 3 本、Home の desktop / mobile、ヘッダーの回転後バッジも確認
- CI（9dc4c9f）：UI Tests / Quality Checks とも success。`Workers Builds: byte-lark` の check-run も success で、PHASE1C-008 で起きた CF のビルド取りこぼしは今回発生していない
- 運営者への提示物は 1 ファイルに寄せた（`favicon-implemented.html`。data URI で全て内包、外部参照ゼロ）。初回は `<meta charset="utf-8">` を書き忘れてローカルで開くと文字化けした → 生成側に追加済み。**publish したページと違い、ローカルで直接開く HTML は charset を自分で持たせないといけない**

#### 次への申し送り

- iOS ホーム画面の実表示は未確認（実機が要る）。角丸マスクは再現で見ただけ
- ダークモード PBI を立てるときは、アイコンだけ `currentColor` ではなく sky 固定である点に注意（タブ地に依存させない判断。ロゴ本体とは扱いが違う）
