---
title: "静的サイトのまま、問い合わせフォームを足す"
description: "静的サイトのまま、問い合わせフォームを自前実装した記録。Cloudflare Workers + Turnstile + Resend の構成と実装手順、secret を入れたのに反映されない等のハマりどころを書きます。"
category: tech
tags: ["cloudflare workers", "turnstile", "resend", "astro", "個人開発"]
publishedAt: 2026-08-01
draft: true
slug: contact-form-on-cloudflare-workers
---

このサイトには[問い合わせフォーム](/contact/)があります。  
入力して送信するとボット対策を通り、私宛にメールが届く、ごく普通のフォームです。

このサイトは Astro で作った静的サイト（あらかじめ作った HTML を配るだけの構成）で、配信は Cloudflare です。フォームの送信を受け取る処理も、配信と同じ Cloudflare 上で小さなプログラムを動かせる [Workers](https://developers.cloudflare.com/workers/) という仕組みで、そのまま書けます。ここまでは順調でした。

つまずいたのはメール送信です。実は Cloudflare にはメール送信の機能もあるのですが、[ドメインの DNS を Cloudflare で運用していることが条件](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)で、DNS を別のサービスに置いているこのサイトでは使えません。そこで、DNS がどこにあっても使える [Resend](https://resend.com/) というメール送信サービスを使いました。あとはボット対策の [Turnstile](https://developers.cloudflare.com/turnstile/) を足して、サーバーを新たに借りることなく、無料枠だけで動いています。

この記事はその実装の記録です。同じように静的サイトでフォームを作りたい人の参考になれば嬉しいです（実装は[前回](/blog/building-this-blog-with-claude-code/)と同じく Claude Code に任せています）。

## mailto でも Google フォームでもなく、自前にした理由

自前で作る前に、楽な選択肢が2つあります。

- mailto リンク：ページにメールアドレスを書いて、メールソフトを開いてもらう
- Google フォーム：埋め込むか、リンクで飛ばす

mailto は、メールアドレスを公開することになるので抵抗があり、採用しませんでした。  
Google フォームは実用的ですが、どうせサイトを作るのに、フォームだけ Google フォームというのも中途半端です。ちゃんと作ったらいいよね、ということで自前にしました。

## 全体の流れ

送信ボタンを押してからメールが届くまでは、こういう流れです。

```
ブラウザ（フォーム + Turnstile のチェック）
  → POST /api/contact（Cloudflare Workers 上の自作プログラム）
    → Turnstile 検証（人間からの送信かをサーバー側で照合）
    → Resend（メール送信）
      → 私の受信箱
```

配信とフォームの受け取りが同じ Cloudflare 上に同居する仕組みはこうです。デプロイ設定ファイル（`wrangler.jsonc`）に「静的ファイル置き場はここ」と書いておくと、リクエストはまず静的ファイルと照合され、一致したらそのまま配信されます。一致しなかったリクエストだけが、自作プログラムに渡ってきます。

```jsonc
// wrangler.jsonc（抜粋）
{
  "main": "worker/index.ts",        // 自作プログラムの入り口
  "assets": {
    "directory": "./dist",          // 静的ファイル置き場（Astro のビルド出力）
    "binding": "ASSETS",
    "not_found_handling": "404-page"
  }
}
```

`/api/contact` という URL に対応する静的ファイルは存在しないので、フォームの送信は必ず自作プログラム側に届きます。つまり「サイトはこれまで通り静的配信のまま、`/api/contact` だけ自分で処理」ができます。

自作プログラムの入り口はこれだけです。`/api/contact` 以外が来たら、静的配信側（`ASSETS`）に投げ返します。

```typescript
// worker/index.ts（抜粋）
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // 末尾スラッシュの有無どちらでも受ける（後述のハマりどころ）
    const path = url.pathname.replace(/\/+$/, "");
    if (path === "/api/contact") {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
```

## 受け取り処理：チェックを順番に通すだけ

`/api/contact` の中身は、チェックを順番に通していくだけの素直な作りです。

```typescript
// worker/index.ts（抜粋・整理）
async function handleContact(request: Request, env: Env): Promise<Response> {
  // 1. POST 以外は 405
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }
  // 2. 鍵が未設定なら 503（設定前でも公開はできるが、実行時に明示的に止める）
  if (!(env.TURNSTILE_SECRET_KEY && env.RESEND_API_KEY)) {
    return json({ ok: false, error: "service_unavailable" }, 503);
  }
  // 3. 同じ IP からの連投を制限（60 秒に 5 件まで）
  const ip = request.headers.get("CF-Connecting-IP");
  if (env.CONTACT_RATE_LIMITER && ip) {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: ip });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429);
  }
  // 4. 入力チェック（必須・文字数上限・メール形式）
  // 5. Turnstile 検証 → NG なら 403
  // 6. Resend でメール送信 → NG なら 502
  return json({ ok: true }, 200);
}
```

設計の補足を3つ。

### 連投対策は Cloudflare の機能で済む

同じ IP からの連投制限は、自分で作り込まなくても、Cloudflare の [Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) という機能が使えます。設定ファイルに数行書くだけです。

```jsonc
// wrangler.jsonc（抜粋）
"ratelimits": [
  {
    "name": "CONTACT_RATE_LIMITER",
    "namespace_id": "1001",
    "simple": { "limit": 5, "period": 60 }   // 60 秒に 5 件まで
  }
]
```

連投チェックは Turnstile やメール送信より前に置いています。攻撃されたときに、外部サービスを呼ぶ前の入り口で止めるためです。

### ボット対策は、サーバー側の照合が本体

Turnstile は reCAPTCHA と同類のボット対策です（「信号機の画像を全部選べ」のようなパズルを人間に解かせないのが売り）。ただし「フォームにチェック部品を置いたら終わり」ではありません。部品が発行したトークン（通行証のようなもの）を受け取り処理の側で Cloudflare に照合してもらって、初めてボット対策になります。照合は siteverify という窓口に投げるだけです。

```typescript
// worker/contact.ts（抜粋）
const res = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip }),
  },
);
```

この照合を省くと、フォーム画面を経由せず `/api/contact` に直接送りつけてくるボットには無力です。ここは省略しないのが大事です。

### メール本文に入れる前に、入力を無害化する

フォームの入力値は私宛のメール（HTML 形式）に埋め込むので、`<` や `>` などの記号をそのまま解釈されないよう変換（エスケープ）してから埋め込んでいます。問い合わせフォームは「見知らぬ誰かの入力が、自分が開くメールになる」仕組みなので、ここも省略しないほうがいいところです。

## フォーム側：設定なしでも動くようにする

フォームの画面は React で作り、Astro のページに埋め込んでいます。工夫は1つだけ。Turnstile を動かすには「site key」という公開してよい方の鍵が必要なのですが、これを設定から読み、未設定なら公式のテストキーに切り替わるようにしました。

```typescript
// src/components/ContactForm.tsx（抜粋）
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;
```

Turnstile には[公式のテストキー](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)が用意されていて、必ず「成功」になるチェック部品が表示されます。おかげで、手元での開発中は何も設定しなくてもフォーム一式が動きます。本番は Cloudflare の管理画面で本物の鍵を1つ設定するだけで、コードの書き換えはありません。

## 管理画面側でやること

コードの外の作業は3つでした。

1. Turnstile のチェック部品を作る（Cloudflare の管理画面で。site key と、サーバー側照合に使う secret key の2つの鍵をもらう）
2. Resend に送信元ドメインを登録する（メール送信用のサブドメインを作り、Resend が指示する DNS レコードを追加して「このドメインから送ってよい」ことを証明する。済んだら API キーをもらう）
3. もらった鍵を Workers に登録する（秘密の値は「secret」という専用の置き場に入れる。コードやリポジトリには書かない）

Resend のドメイン登録だけ DNS の操作が要るので少し手間ですが、画面の指示どおりにレコードを足していけば通ります。送信専用のサブドメイン（例: `send.example.com`）を切っておくと、本来のドメインのメール設定に触らずに済みます。

## ハマりどころ

実装そのものより、この2つで時間を使いました。同じ構成を組むなら先に知っておくと楽です。

### 鍵を設定したのに、まだ「未設定」の反応が返る

Workers に secret を登録したのに、フォームから送信すると 503（鍵が未設定のときの返事）が返ってくる。管理画面を見ると、鍵はちゃんと入っている。なぜ？

答えは、Cloudflare Workers の仕組みにありました。Workers はデプロイのたびに「バージョン」を作り、その時点の設定一式（secret や環境変数）をバージョンに焼き付けて固定します。あとから鍵を登録しても、動いているのは古いバージョンのまま。反映するには、もう一度デプロイし直す必要があります。

「設定を保存したのに反映されない」と思ったら、たいていこれです。鍵や環境変数を入れたら、ひと呼吸おいて再デプロイ。覚えておくと無駄にハマらずに済みます。

### /api/contact/ で 404 ページが出る

ブラウザで `/api/contact/`（末尾にスラッシュ付き）を開くと、API の返事ではなくサイトの 404 ページが出ました。

原因は、最初に説明した「静的ファイルに一致しなければ自作プログラムへ」の振り分けです。自作プログラム側は `/api/contact` と完全一致で判定していたので、スラッシュ付きの URL は受け取れず、静的配信側の「該当ファイルなし → 404 ページ」に流れていました。

対処は、入り口のコードにあったとおり、URL の末尾スラッシュを削ってから比較するだけです。静的配信と API を同居させる構成では、「どちらにも一致しなかったリクエストがどこへ流れるか」を意識しておくと、この手の不思議な 404 に慌てずに済みます。

## まとめ

静的サイトのまま、フォームのためのサーバーを借りずに問い合わせフォームを作りました。

- 部品は Cloudflare Workers + Turnstile + Resend の3つ。この規模なら無料枠に収まる
- サイトの配信とフォームの受け取りは同居できる。`/api/contact` だけ自分で処理して、残りは静的配信のまま
- ボット対策・連投制限・入力の無害化は、それぞれ数行〜数十行で入る
- ハマりどころは「鍵を設定したら再デプロイ」と「末尾スラッシュの流れ先」

コードの全体は[このサイトのリポジトリ](https://github.com/kazuya-tanimoto/byte-lark.com)（`worker/` と `src/components/ContactForm.tsx`）で公開しています。同じことをやろうとしている人の参考になれば嬉しいです。
