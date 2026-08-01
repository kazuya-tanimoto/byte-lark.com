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
送信するとボット対策を通り、私宛にメールが届く。ごく普通のフォームです。

このサイトは Astro で作った静的サイト（作っておいた HTML を配るだけの構成）で、配信は Cloudflare です。  
送信を受け取る処理も、同じ Cloudflare 上で小さなプログラムを動かせる [Workers](https://developers.cloudflare.com/workers/) でそのまま書けます。ここまでは順調でした。

つまずいたのはメール送信です。  
Cloudflare にもメール送信の機能はあるのですが、[DNS を Cloudflare で運用していることが条件](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)です。このサイトは DNS が別のサービスにあるので使えません。  
そこで、DNS がどこにあっても使えるメール送信サービス [Resend](https://resend.com/) を使いました。ボット対策の [Turnstile](https://developers.cloudflare.com/turnstile/) も足して、サーバーを借りずに無料枠だけで動いています。

この記事はその実装の記録です。  
静的サイトでフォームを作りたい人の参考になれば嬉しいです（実装は[前回](/blog/building-this-blog-with-claude-code/)と同じく Claude Code に任せています）。

## mailto でも Google フォームでもなく、自前にした理由

楽な選択肢は2つありました。

- mailto リンク：ページにメールアドレスを書く
- Google フォーム：埋め込むかリンクで飛ばす

mailto はメールアドレスを公開することになるので不採用にしました。  
Google フォームは実用的ですが、どうせサイトを作るのにフォームだけ Google というのも中途半端です。ちゃんと作ったらいいよね、ということで自前にしました。

## 全体の流れ

送信からメールが届くまでの流れです。

```
ブラウザ（フォーム + Turnstile のチェック）
  → POST /api/contact（Cloudflare Workers 上の自作プログラム）
    → Turnstile 検証（人間からの送信かをサーバー側で照合）
    → Resend（メール送信）
      → 私の受信箱
```

配信とフォームの受け取りが同居する仕組みはこうです。  
デプロイ設定（`wrangler.jsonc`）に静的ファイルの置き場所を書いておくと、リクエストはまず静的ファイルと照合され、一致すればそのまま配信されます。一致しなかったものだけが自作プログラムに渡ってきます。

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

`/api/contact` に対応する静的ファイルは無いので、フォームの送信は必ず自作プログラムに届きます。  
「サイトは静的配信のまま、`/api/contact` だけ自分で処理」ができるわけです。

入り口のコードはこれだけです。`/api/contact` 以外は静的配信側（`ASSETS`）に投げ返します。

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

連投制限は自分で作り込まなくても、Cloudflare の [Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) が使えます。設定に数行書くだけです。

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

チェックは Turnstile やメール送信より前に置いています。  
攻撃されたとき、外部サービスを呼ぶ前の入り口で止めるためです。

### ボット対策は、サーバー側の照合が本体

Turnstile は reCAPTCHA の同類です（画像パズルを人間に解かせないのが売り）。  
ただし、フォームに部品を置いたら終わりではありません。部品が発行するトークン（通行証のようなもの）をサーバー側で Cloudflare に照合してもらって、初めてボット対策になります。  
照合は siteverify という窓口に投げるだけです。

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

これを省くと、フォームを経由せず `/api/contact` に直接送りつけるボットには無力です。ここは省略しないのが大事です。

### メール本文に入れる前に、入力を無害化する

入力値は私宛の HTML メールに埋め込むので、`<` や `>` を解釈されないよう変換（エスケープ）してから使います。  
問い合わせフォームは「見知らぬ誰かの入力が、自分の開くメールになる」仕組みです。ここも省略しないほうがいいところです。

## フォーム側：設定なしでも動くようにする

フォーム画面は React で作り、Astro のページに埋め込んでいます。  
工夫は1つだけ。Turnstile に必要な「site key」（公開してよい方の鍵）を設定から読み、未設定なら公式のテストキーに切り替わるようにしました。

```typescript
// src/components/ContactForm.tsx（抜粋）
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;
```

[公式のテストキー](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)では、必ず「成功」になるチェック部品が表示されます。  
おかげで開発中は設定なしでフォーム一式が動き、本番は管理画面で本物の鍵を1つ設定するだけです。コードの書き換えはありません。

## 管理画面側でやること

コードの外の作業は3つです。

1. Turnstile のチェック部品を作る（site key と、照合用の secret key をもらう）
2. Resend に送信元ドメインを登録する（指示された DNS レコードを追加して認証 → API キーをもらう）
3. もらった鍵を Workers に登録する（秘密の値は「secret」という専用の置き場へ。コードには書かない）

手間なのは Resend のドメイン登録だけですが、画面の指示どおりにレコードを足せば通ります。  
送信専用のサブドメイン（例: `send.example.com`）を切っておくと、本来のドメインのメール設定に触らずに済みます。

## ハマりどころ

実装そのものより、この2つで時間を使いました。

### 鍵を設定したのに、まだ「未設定」の反応が返る

secret を登録したのに、送信すると 503（鍵が未設定のときの返事）が返ってくる。  
管理画面を見ると鍵は入っている。なぜ？

Workers はデプロイのたびに「バージョン」を作り、その時点の設定一式をバージョンに焼き付けて固定します。  
あとから鍵を登録しても、動いているのは古いバージョンのままで、反映には再デプロイが必要です。

「設定を保存したのに反映されない」は、たいていこれです。鍵や環境変数を入れたら再デプロイ、と覚えておくと無駄にハマらずに済みます。

### /api/contact/ で 404 ページが出る

`/api/contact/`（末尾スラッシュ付き）を開くと、API の返事ではなくサイトの 404 ページが出ました。

原因は例の振り分けです。  
自作プログラムは `/api/contact` の完全一致で判定していたので、スラッシュ付きは受け取れず、静的配信側の「該当ファイルなし → 404」に流れていました。  
対処は、入り口のコードのとおり末尾スラッシュを削ってから比較するだけです。

同居構成では「どちらにも一致しなかったリクエストがどこへ流れるか」を意識しておくと、この手の不思議な 404 に慌てずに済みます。

## まとめ

静的サイトのまま、フォームのためのサーバーを借りずに問い合わせフォームを作りました。

- 部品は Cloudflare Workers + Turnstile + Resend の3つ。この規模なら無料枠に収まる
- 配信とフォームの受け取りは同居できる。`/api/contact` だけ自分で処理して、残りは静的配信のまま
- ボット対策・連投制限・入力の無害化は、それぞれ数行〜数十行で入る
- ハマりどころは「鍵を設定したら再デプロイ」と「末尾スラッシュの流れ先」

コード全体は[このサイトのリポジトリ](https://github.com/kazuya-tanimoto/byte-lark.com)で公開しています（`worker/` と `src/components/ContactForm.tsx`）。  
参考になれば嬉しいです。
