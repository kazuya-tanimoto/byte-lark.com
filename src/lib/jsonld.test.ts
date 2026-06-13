import { describe, expect, it } from "vitest";
import { buildArticleJsonLd, buildPersonJsonLd } from "./jsonld";

describe("buildPersonJsonLd", () => {
  it("schema.org の Person schema を生成する", () => {
    const result = buildPersonJsonLd();

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Person");
    expect(result.name).toBe("Kazuya Tanimoto");
    expect(result.url).toBe("https://byte-lark.com/about");
    expect(result.worksFor["@type"]).toBe("Organization");
  });
});

describe("buildArticleJsonLd", () => {
  const input = {
    title: "テスト記事",
    description: "テスト用の説明文",
    url: "https://byte-lark.com/blog/test/",
    image: "https://byte-lark.com/og/test.png",
    datePublished: new Date("2026-05-16T00:00:00Z"),
  };

  it("schema.org の Article schema を生成する", () => {
    const result = buildArticleJsonLd(input);

    expect(result["@context"]).toBe("https://schema.org");
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe(input.title);
    expect(result.description).toBe(input.description);
    expect(result.image).toBe(input.image);
    expect(result.author["@type"]).toBe("Person");
    expect(result.publisher["@type"]).toBe("Organization");
    expect(result.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": input.url,
    });
  });

  it("日時を ISO 8601 文字列に変換する", () => {
    const result = buildArticleJsonLd(input);

    expect(result.datePublished).toBe("2026-05-16T00:00:00.000Z");
  });

  it("dateModified 省略時は datePublished を流用する", () => {
    const result = buildArticleJsonLd(input);

    expect(result.dateModified).toBe(result.datePublished);
  });

  it("dateModified 指定時はその値を使う", () => {
    const result = buildArticleJsonLd({
      ...input,
      dateModified: new Date("2026-06-01T00:00:00Z"),
    });

    expect(result.dateModified).toBe("2026-06-01T00:00:00.000Z");
  });
});
