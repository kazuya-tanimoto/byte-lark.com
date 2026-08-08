import { describe, expect, it } from "vitest";
import { buildOgMeta } from "./og";

const baseMeta = {
  title: "テスト記事",
  description: "テスト用の説明文",
  url: "https://byte-lark.com/blog/test/",
  image: "https://byte-lark.com/og/test.png",
};

describe("buildOgMeta", () => {
  it("必須フィールドを OGP / Twitter Card メタにマッピングする", () => {
    const result = buildOgMeta(baseMeta);

    expect(result["og:title"]).toBe(baseMeta.title);
    expect(result["og:description"]).toBe(baseMeta.description);
    expect(result["og:url"]).toBe(baseMeta.url);
    expect(result["og:image"]).toBe(baseMeta.image);
    expect(result["twitter:card"]).toBe("summary_large_image");
    expect(result["twitter:title"]).toBe(baseMeta.title);
    expect(result["twitter:description"]).toBe(baseMeta.description);
    expect(result["twitter:image"]).toBe(baseMeta.image);
  });

  it("type / siteName 省略時は website / byte-lark.com になる", () => {
    const result = buildOgMeta(baseMeta);

    expect(result["og:type"]).toBe("website");
    expect(result["og:site_name"]).toBe("byte-lark.com");
  });

  it("type / siteName を明示指定できる", () => {
    const result = buildOgMeta({
      ...baseMeta,
      type: "article",
      siteName: "example",
    });

    expect(result["og:type"]).toBe("article");
    expect(result["og:site_name"]).toBe("example");
  });
});
