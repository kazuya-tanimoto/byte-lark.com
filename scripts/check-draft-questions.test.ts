import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkPost,
  isDraft,
  MAX_QUESTIONS,
  scanPosts,
} from "./check-draft-questions";

const fm = (draft: "true" | "false" | null) =>
  draft === null
    ? "---\ntitle: t\n---\n"
    : `---\ntitle: t\ndraft: ${draft}\n---\n`;

const photo = () => "【要写真：撮影リスト No.1（ghostty の設定画面）】";

const block = (kind = "事実") =>
  [
    `> 【要確認｜${kind}】`,
    "> 対象：「この設定は乗り換え直後から有効だった。」",
    "> 質問：この設定は自分で有効にしましたか？（はい／いいえ）",
    "> 無回答なら：対象の文を削る",
  ].join("\n");

describe("isDraft", () => {
  it("draft: false だけを公開扱いにする", () => {
    expect(isDraft(fm("false"))).toBe(false);
    expect(isDraft(fm("true"))).toBe(true);
  });
  it("draft 未指定と frontmatter 無しは schema 既定どおり下書き扱い", () => {
    expect(isDraft(fm(null))).toBe(true);
    expect(isDraft("本文だけ")).toBe(true);
  });
});

describe("checkPost", () => {
  it("公開記事に【要確認】が残っていれば NG", () => {
    const errors = checkPost(`${fm("false")}\n本文\n\n${block()}\n`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("公開記事");
  });

  it("【要確認】が無ければ公開・下書きとも OK", () => {
    expect(checkPost(`${fm("false")}\n本文\n`)).toEqual([]);
    expect(checkPost(`${fm("true")}\n本文\n`)).toEqual([]);
  });

  it("下書きの 4 行書式は OK（2 種とも）", () => {
    const body = ["事実", "主張"].map((k) => block(k)).join("\n\n");
    expect(checkPost(`${fm("true")}\n本文\n\n${body}\n`)).toEqual([]);
  });

  it("上限を超えたら NG", () => {
    const body = Array.from({ length: MAX_QUESTIONS + 1 }, () => block()).join(
      "\n\n",
    );
    const errors = checkPost(`${fm("true")}\n${body}\n`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(`上限 ${MAX_QUESTIONS} 件`);
  });

  it("無回答なら が欠けていれば NG", () => {
    const broken = block().split("\n").slice(0, 3).join("\n");
    const errors = checkPost(`${fm("true")}\n${broken}\n\n次の段落\n`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("無回答なら");
  });

  it("ラベルだけで中身が空なら NG", () => {
    const empty = block().replace(/> 質問：.*/, "> 質問：");
    const errors = checkPost(`${fm("true")}\n${empty}\n`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("質問");
  });

  it("種別が 事実／主張 以外なら NG（画像は【要写真】に分けたので NG）", () => {
    for (const kind of ["感想", "画像"]) {
      const errors = checkPost(`${fm("true")}\n${block(kind)}\n`);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain("種別");
    }
  });

  it("旧書式（本文中の【要確認】）は NG", () => {
    const errors = checkPost(
      `${fm("true")}\n乗り換え直後から起きた【要確認：時期】。\n`,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("4 行書式");
  });

  it("NG には行番号が付く", () => {
    const errors = checkPost(`${fm("true")}\n本文\n\n${block("感想")}\n`);
    expect(errors[0]).toMatch(/^L8:/);
  });
});

describe("checkPost（【要写真】）", () => {
  it("下書きの 1 行書式は OK で、件数は上限に数えない", () => {
    const photos = Array.from(
      { length: MAX_QUESTIONS + 5 },
      (_, i) => `【要写真：撮影リスト No.${i + 1}（設定画面）】`,
    ).join("\n\n");
    const questions = Array.from({ length: MAX_QUESTIONS }, () => block()).join(
      "\n\n",
    );
    expect(checkPost(`${fm("true")}\n${photos}\n\n${questions}\n`)).toEqual([]);
  });

  it("公開記事に【要写真】が残っていれば NG", () => {
    const errors = checkPost(`${fm("false")}\n本文\n\n${photo()}\n`);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("公開記事");
    expect(errors[0]).toContain("【要写真】");
  });

  it("1 行書式でなければ NG（本文中に埋め込む・中身が空）", () => {
    for (const bad of [
      "ここに【要写真：設定画面】を入れる",
      "【要写真：】",
      "【要写真】設定画面",
    ]) {
      const errors = checkPost(`${fm("true")}\n${bad}\n`);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain("1 行書式");
    }
  });

  it("NG には行番号が付く", () => {
    const errors = checkPost(`${fm("true")}\n本文\n\n【要写真】設定画面\n`);
    expect(errors[0]).toMatch(/^L8:/);
  });
});

describe("scanPosts", () => {
  let dir = "";
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("配下の .md / .mdx を再帰的に検査し、NG のあるファイルだけ返す", () => {
    dir = mkdtempSync(join(tmpdir(), "posts-"));
    mkdirSync(join(dir, "ok-post"));
    mkdirSync(join(dir, "ng-post"));
    writeFileSync(
      join(dir, "ok-post", "index.md"),
      `${fm("true")}\n${block()}\n`,
    );
    writeFileSync(
      join(dir, "ng-post", "index.mdx"),
      `${fm("false")}\n${block()}\n`,
    );
    writeFileSync(join(dir, "flat.md"), `${fm("true")}\n本文\n`);
    writeFileSync(join(dir, "ng-post", "note.txt"), "【要確認】は対象外");

    const result = scanPosts(dir);
    expect(result.checked).toBe(3);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].file).toBe("ng-post/index.mdx");
  });
});
