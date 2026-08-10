// 配信するフォントを「サイトで実際に使う文字だけ」に絞って作り直す（PHASE1D-010）。
//
// 使い方:
//   yarn fonts        # build → 生成 → build（記事を足したらこれを回して差分をコミット）
//   node scripts/subset-fonts.mjs --check   # 生成せず、今のサブセットで足りるかだけ見る
//
// なぜ必要か:
//   元の配布物（fontsource）は「フォント全体を文字コード順に 120 個前後へ切った塊」で、
//   ブラウザは塊単位でしか取れない。1 ページに使う漢字が広く散るぶん 18〜68 個の塊が落ち、
//   ページあたり 0.33〜1.06MB になっていた。中身のほとんどはそのページに出てこない字。
//   ここで作るのは「サイトに出てくる字だけを詰めた 1 ファイル」で、全ページで同じものを使う。
//
// 文字の集め方（本文と見出しで出どころが違う）:
//   本文（Noto Sans JP）… src/ の中身をそのまま走査した集合。組み上がった HTML の文字を
//     必ず含む（実測 0 件の取りこぼし）ので、build を挟まなくても字が欠けない。
//   見出し（Zen Kaku Gothic New）… dist/ の h1〜h4 から集める。見出しは全体のごく一部なので
//     ここを絞ると効きが大きい。dist が無いときは本文と同じ集合に広げる（安全側・その分重い）。
//     万一この集合から漏れても、見出しの font-family は Zen Kaku → Noto の順なので
//     本文書体で描かれるだけで、端末任せの書体には落ちない。
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const OUT_DIR = join(ROOT, "src/assets/fonts");
// 元フォント（数 MB）はリポジトリに置かず、ここへ落として使い回す（.gitignore 済み）
const CACHE_DIR = join(ROOT, "node_modules/.cache/font-sources");

// 元フォントは google/fonts のコミットを固定して取る。ダウンロード後に sha256 を照合するので、
// 取り違え・破損はここで止まる。更新するときは SHA と sha256 を両方差し替えること
const SOURCES = {
  noto: {
    file: "NotoSansJP.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/66a36c8c94b1a5d992ee4e7f392fccfe4945767c/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
    sha256: "c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f",
  },
  zen500: {
    file: "ZenKakuGothicNew-Medium.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/ba225958c40ae6268a256861d80355a84b26e535/ofl/zenkakugothicnew/ZenKakuGothicNew-Medium.ttf",
    sha256: "651a3f7280b7f36262601ee76d8388a8dc4372dcc67aff025a608939a562b525",
  },
  zen700: {
    file: "ZenKakuGothicNew-Bold.ttf",
    url: "https://raw.githubusercontent.com/google/fonts/ba225958c40ae6268a256861d80355a84b26e535/ofl/zenkakugothicnew/ZenKakuGothicNew-Bold.ttf",
    sha256: "0081cedabc4921982fcd061f845a005664ac7fb642af2dd34b4007bc63ccd235",
  },
};

const OUTPUTS = {
  noto: "noto-sans-jp-subset.woff2",
  zen500: "zen-kaku-gothic-new-500-subset.woff2",
  zen700: "zen-kaku-gothic-new-700-subset.woff2",
};

const MANIFEST = join(OUT_DIR, "manifest.json");

const SRC_TEXT_FILE = /\.(astro|md|mdx|ts|tsx|js|jsx|json|css)$/;

function walk(dir, keep) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path, keep));
    else if (keep(path)) out.push(path);
  }
  return out;
}

/** HTML からタグ・script・style を落として、画面に出る文字だけを残す */
function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(Number.parseInt(h, 16)),
    );
}

/** 制御文字を除いて Set に足す */
function addChars(set, text) {
  for (const char of text) if (char.codePointAt(0) >= 0x20) set.add(char);
}

function collectBodyChars() {
  const chars = new Set();
  for (const file of walk(join(ROOT, "src"), (p) => SRC_TEXT_FILE.test(p))) {
    addChars(chars, readFileSync(file, "utf-8"));
  }
  // 画面に出るが src に文字列として現れないもの（日付の書式など）の保険。
  // 全角英数・かな・よく使う記号は数 KB で収まるので、安く広く取っておく
  addChars(
    chars,
    "0123456789０１２３４５６７８９年月日時分秒曜（）「」、。・％円※",
  );
  return chars;
}

function collectHeadingChars() {
  if (!existsSync(DIST)) return null;
  const chars = new Set();
  for (const file of walk(DIST, (p) => p.endsWith(".html"))) {
    const html = readFileSync(file, "utf-8");
    for (const [, inner] of html.matchAll(
      /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi,
    )) {
      addChars(chars, textOf(inner));
    }
    // Header のロゴなど、見出しタグ以外で見出し書体を使っている箇所
    for (const [, inner] of html.matchAll(
      /<[^>]*class="[^"]*font-heading[^"]*"[^>]*>([\s\S]*?)<\//gi,
    )) {
      addChars(chars, textOf(inner));
    }
  }
  return chars.size > 0 ? chars : null;
}

/** dist の HTML に出てくる全文字（生成後の照合用） */
function collectRenderedChars() {
  if (!existsSync(DIST)) return null;
  const chars = new Set();
  for (const file of walk(DIST, (p) => p.endsWith(".html"))) {
    addChars(chars, textOf(readFileSync(file, "utf-8")));
  }
  return chars;
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

async function loadSource(key) {
  const { file, url, sha256: expected } = SOURCES[key];
  const cached = join(CACHE_DIR, file);
  if (existsSync(cached)) {
    const buf = readFileSync(cached);
    if (sha256(buf) === expected) return buf;
    console.log(`  ${file} のハッシュが合わないので取り直します`);
  }
  console.log(`  ${file} を取得中…`);
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`${url} の取得に失敗しました（HTTP ${res.status}）`);
  const buf = Buffer.from(await res.arrayBuffer());
  const actual = sha256(buf);
  if (actual !== expected) {
    throw new Error(
      `${file} のハッシュが一致しません。期待 ${expected} / 実際 ${actual}`,
    );
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cached, buf);
  return buf;
}

const sortChars = (set) =>
  [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("");
const kb = (bytes) => (bytes / 1024).toFixed(1);

async function check() {
  if (!existsSync(MANIFEST)) {
    console.error("サブセットがまだありません。`yarn fonts` で作ってください");
    process.exit(1);
  }
  const rendered = collectRenderedChars();
  if (!rendered) {
    console.error("dist/ がありません。`yarn build` の後に実行してください");
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8"));
  const covered = new Set(manifest.bodyChars);
  const missing = [...rendered].filter((c) => !covered.has(c));
  if (missing.length > 0) {
    console.error(
      `画面に出る文字のうち ${missing.length} 字がサブセットにありません: ${missing.join("")}`,
    );
    console.error(
      "`yarn fonts` を実行して src/assets/fonts/ の差分をコミットしてください",
    );
    process.exit(1);
  }
  console.log(
    `本文フォントの文字カバー OK（画面 ${rendered.size} 字 / 収録 ${covered.size} 字）`,
  );
}

async function generate() {
  const bodyChars = collectBodyChars();
  const headingChars = collectHeadingChars() ?? bodyChars;
  if (headingChars === bodyChars) {
    console.log(
      "dist/ が無いので見出し書体も本文と同じ文字数で作ります（`yarn fonts` で絞られます）",
    );
  }

  console.log("元フォントを用意中…");
  const [noto, zen500, zen700] = await Promise.all([
    loadSource("noto"),
    loadSource("zen500"),
    loadSource("zen700"),
  ]);

  const bodyText = sortChars(bodyChars);
  const headingText = sortChars(headingChars);

  mkdirSync(OUT_DIR, { recursive: true });
  const results = {};
  const jobs = [
    ["noto", noto, bodyText, "本文 Noto Sans JP（可変ウェイト 100-900）"],
    ["zen500", zen500, headingText, "見出し Zen Kaku Gothic New 500"],
    ["zen700", zen700, headingText, "見出し Zen Kaku Gothic New 700"],
  ];

  console.log("");
  for (const [key, source, text, label] of jobs) {
    // noLayoutClosure: 字を置き換える仕組み（縦書き用の字形・欧文の合字など）で
    // 呼び出される字を芋づる式に足さない。このサイトでは使わない一方で 100KB 以上効く。
    // 見出しの字詰め（palt）は字を置き換えず位置だけずらす指定なので、切っても残る
    const out = await subsetFont(source, text, {
      targetFormat: "woff2",
      noLayoutClosure: true,
    });
    const path = join(OUT_DIR, OUTPUTS[key]);
    const before = existsSync(path) ? statSync(path).size : null;
    writeFileSync(path, out);
    results[key] = {
      file: OUTPUTS[key],
      chars: [...text].length,
      bytes: out.length,
    };
    const delta = before === null ? "新規" : `前回 ${kb(before)} KB`;
    console.log(`  ${label}`);
    console.log(
      `    ${OUTPUTS[key]}  ${kb(out.length)} KB  ${[...text].length} 字  (${delta})`,
    );
  }

  const total = Object.values(results).reduce((a, r) => a + r.bytes, 0);
  writeFileSync(
    MANIFEST,
    `${JSON.stringify(
      {
        note: "scripts/subset-fonts.mjs が生成。手で編集しない（記事を足したら yarn fonts）",
        sources: Object.fromEntries(
          Object.entries(SOURCES).map(([k, v]) => [
            k,
            { url: v.url, sha256: v.sha256 },
          ]),
        ),
        outputs: results,
        totalBytes: total,
        bodyChars: bodyText,
        headingChars: headingText,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `\n合計 ${kb(total)} KB（全ページ共通・1 回落とせば以後は使い回し）`,
  );
  console.log(`出力: ${relative(ROOT, OUT_DIR)}/`);
}

if (process.argv.includes("--check")) await check();
else await generate();
