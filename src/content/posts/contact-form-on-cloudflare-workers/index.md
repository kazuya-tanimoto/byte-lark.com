---
title: "Cloudflare Workersで、静的サイトのまま問い合わせフォームを作る"
description: "静的サイトのまま、問い合わせフォームを自前実装した記録。Cloudflare Workers + Turnstile + Resendの構成と実装手順、secretを入れたのに反映されない等のハマりどころを書きます。"
category: tech
tags: ["cloudflare workers", "turnstile", "resend", "astro", "個人開発"]
publishedAt: 2026-08-08
draft: false
cover: ./cover.png
slug: contact-form-on-cloudflare-workers
---

このサイトには[問い合わせフォーム](/contact/)があります。  
送信するとボット対策を通り、私宛にメールが届く。ごく普通のフォームです。

このサイトはAstroで作った静的サイトで、配信はCloudflareです。  
Cloudflareにもメール送信の機能はあるのですが、[DNSをCloudflareで運用していることが条件](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)です。このサイトはDNSが別のサービスにあるので使えません。  
そこで、DNSがどこにあっても使えるメール送信サービス [Resend](https://resend.com/)を使いました。ボット対策の [Turnstile](https://developers.cloudflare.com/turnstile/)も足して、サーバーを借りずに無料枠だけで動いています。

この記事はその実装の記録です。  
静的サイトでフォームを作りたい人の参考になれば嬉しいです（実装は[前回](/blog/building-this-blog-with-claude-code/)と同じくClaude Codeに任せています）。

## mailtoでもGoogleフォームでもなく、自前にした理由

楽な選択肢は2つありました。

- mailtoリンク：ページにメールアドレスを書く
- Googleフォーム：埋め込むかリンクで飛ばす

mailtoはメールアドレスを公開することになるので不採用にしました。  
Googleフォームは実用的ですが、どうせサイトを作るのにフォームだけGoogleというのも中途半端です。ちゃんと作ったらいいよね、ということで自前にしました。

## 全体の流れ

送信を受け取る処理は [Cloudflare Workers](https://developers.cloudflare.com/workers/)で書きました。Cloudflareのサーバー上で自作のコードを動かせる仕組みで、このサイトでは`worker/index.ts`がその本体です（以後「Worker」と呼びます）。

送信からメールが届くまでの流れです。

```
ブラウザ（フォーム + Turnstile のチェック）
  → POST /api/contact（Worker）
    → Turnstile 検証（人間からの送信かをサーバー側で照合）
    → Resend（メール送信）
      → 私の受信箱
```

静的サイトの配信とWorkerが同居する仕組みはこうです。  
デプロイ設定（`wrangler.jsonc`）に、静的ファイルの置き場所とWorkerの入り口を並べて書きます。

```jsonc
// wrangler.jsonc（抜粋）
{
  "main": "worker/index.ts",        // Worker の入り口
  "assets": {
    "directory": "./dist",          // 静的ファイル置き場（Astro のビルド出力）
    "binding": "ASSETS",
    "not_found_handling": "404-page"
  }
}
```

この構成でのリクエストの振り分けは3段です。

1. リクエストはまず`dist/`の静的ファイルと照合され、一致すればそのまま配信されます。このときWorkerは動きません
2. 一致しなかったリクエストだけがWorkerに渡ってきます。`/api/contact`も、存在しないURLへのアクセスも、ここに来ます
3. Workerは`/api/contact`なら自分で処理し、それ以外は`ASSETS`（静的配信側）に投げ返します。投げ返された先にも該当ファイルは無いので、404ページが返ります

`/api/contact`に対応する静的ファイルは無いので、フォームの送信は1. をすり抜けて必ずWorkerに届きます。  
「サイトは静的配信のまま、`/api/contact`だけ自分で処理」ができるわけです。

入り口のコードはこれだけです。2. で渡ってきたリクエストを、3. のとおり振り分けています。

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

`/api/contact`の中身は、チェックを順番に通していくだけの素直な作りです。

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

設計の補足を4つ。

### 連投対策はCloudflareの機能で済む

連投制限は自分で作り込まなくても、Cloudflareの [Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)が使えます。設定に数行書くだけです。

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

チェックはTurnstileやメール送信より前に置いています。  
攻撃されたとき、外部サービスを呼ぶ前の入り口で止めるためです。

### ボット対策は、サーバー側の照合が本体

TurnstileはreCAPTCHAの同類です（画像パズルを人間に解かせないのが売り）。  
仕組みは、トークンの受け渡しで成り立っています。

1. フォームのページに、Turnstileが提供するウィジェットを置く。ウィジェットは表示時に訪問者をブラウザ上でチェックし、通過するとトークンを発行するので、フォームが保持しておく
2. フォームは送信時に、入力値と一緒にトークンもPOSTのbodyに含める
3. Workerは受け取ったトークンをCloudflareのsiteverifyエンドポイントに投げ、本物のウィジェットが発行した有効なトークンかを照合してもらう

ウィジェットを置いたら終わり、ではなく、3. の照合までやって初めてボット対策になります。  
照合のコードはこれだけです。

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

これを省くと、フォームを経由せず`/api/contact`に直接送りつけるボットには無力です。ここは省略しないのが大事です。

### HTMLインジェクション対策

入力値は私宛のHTMLメールに埋め込むので、`<`や`>`を解釈されないようエスケープしてから使います（`worker/contact.ts`に`escapeHtml`を用意して、メール本文の組み立て時に必ず通す）。  
問い合わせフォームは「見知らぬ誰かの入力が、自分の開くメールになる」仕組みです。ここも省略しないほうがいいところです。

### メール送信はResendのAPIにPOST 1本

チェックをすべて通ったら、組み立てたメールをResendのREST APIにPOSTして終わりです。

```typescript
// worker/contact.ts（抜粋）
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message), // from / to / reply_to / subject / text / html
});
```

実用的な工夫を1つ。メールの`reply_to`にフォーム送信者のアドレスを入れておくと、届いた問い合わせに受信箱からそのまま返信できます。

## フォーム側：トークンを同梱して送る

フォーム画面はReactで作り、Astroのページに埋め込んでいます。  
ウィジェットを描画すると、チェックを通ったときにcallbackでトークンが渡ってくるので、送信時に入力値と一緒にbodyへ同梱してPOSTします。

```typescript
// src/components/ContactForm.tsx（抜粋・整理）
turnstile.render(widgetRef.current, {
  sitekey: SITE_KEY,
  callback: (t) => setToken(t), // チェック通過の証としてトークンを受け取る
});

// 送信時
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message, token }),
});
```

工夫は1つだけ。ウィジェットに必要な「site key」（公開してよい方の鍵）を設定から読み、未設定なら公式のテストキーに切り替わるようにしました。

```typescript
// src/components/ContactForm.tsx（抜粋）
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;
```

[公式のテストキー](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)では、必ず「成功」になるウィジェットが表示されます。  
おかげで開発中は設定なしでフォーム一式が動き、本番は管理画面で本物の鍵を1つ設定するだけです。コードの書き換えはありません。

## 管理画面側でやること

コードの外の作業は3つです。

1. Turnstileのウィジェットを作る（site keyと、照合用のsecret keyをもらう）
2. Resendに送信元ドメインを登録する（指示されたDNSレコードを追加して認証 → APIキーをもらう）
3. もらった鍵のうち秘密の2つ（Turnstileのsecret keyとResendのAPIキー）をWorkersのsecretとして登録する（`wrangler secret put`かダッシュボードから。コードには書かない）。公開してよいsite keyはビルド用の環境変数に設定する

手間なのはResendのドメイン登録だけですが、画面の指示どおりにレコードを足せば通ります。  
送信専用のサブドメイン（例: `send.example.com`）を切っておくと、本来のドメインのメール設定に触らずに済みます。

## ハマりどころ

実装そのものより、この2つで時間を使いました。

### 鍵を設定したのに、まだ「未設定」のレスポンスが返る

secretを登録したのに、送信すると503（鍵が未設定のときのレスポンス）が返ってくる。  
管理画面を見ると鍵は入っている。なぜ？

Workersはデプロイのたびに「バージョン」を作ります。バージョンには、そのデプロイ時点で登録されていたコードと設定（secretや環境変数）のセットが記録され、できあがったバージョンの設定をあとから差し替えることはできません。

今回は、デプロイが先で鍵の登録があとでした。  
動いているのは「鍵なし」の時点で作られたバージョンなので、あとから管理画面に鍵を入れても、そこには届きません。もう一度デプロイして「鍵あり」の今の設定で新しいバージョンを作ると、反映されます。

「設定を保存したのに反映されない」は、たいていこれです。鍵や環境変数を入れたら再デプロイ、と覚えておくと無駄にハマらずに済みます。

### /api/contact/ で404ページが出る

`/api/contact/`（末尾スラッシュ付き）を開くと、APIのレスポンスが戻るのではなくサイトの404ページが表示されてしまいました。

原因は前述の振り分けの3段目です。  
`/api/contact/`に対応する静的ファイルは無いので、リクエスト自体はWorkerまで届いています。ところが当時は`/api/contact`の完全一致でAPI判定していたため、スラッシュ付きはAPI扱いにならず、`ASSETS`に投げ返されて「該当ファイルなし → 404ページ」になっていました。  
対処は、入り口のコードのとおり末尾スラッシュを削ってから比較するだけです。

同居構成では「どちらにも一致しなかったリクエストがどこへ流れるか」を意識しておくと、この手の不思議な404に慌てずに済みます。

## まとめ

静的サイトのまま、フォームのためのサーバーを借りずに問い合わせフォームを作りました。

- 部品はCloudflare Workers + Turnstile + Resendの3つ。個人サイトの規模なら無料枠に収まりそうです
- `/api/contact`だけWorkerで処理し、残りは静的配信のまま
- ボット対策・連投制限・HTMLインジェクション対策は、それぞれ数行〜数十行で入る
- ハマりどころは「鍵を設定したら再デプロイ」と「末尾スラッシュの流れ先」

コード全体は[このサイトのリポジトリ](https://github.com/kazuya-tanimoto/byte-lark.com)で公開しています（`worker/`と`src/components/ContactForm.tsx`）。  
参考になれば嬉しいです。
