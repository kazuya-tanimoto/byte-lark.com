import { describe, expect, it } from "vitest";
import { buildOgMeta, buildPageUrls, requireSiteOrigin } from "./og";

describe("requireSiteOrigin", () => {
  it("site の origin を返す", () => {
    expect(requireSiteOrigin(new URL("https://byte-lark.com/"))).toBe(
      "https://byte-lark.com",
    );
  });

  it("site が未設定ならエラーにしてビルドを止める", () => {
    expect(() => requireSiteOrigin(undefined)).toThrow("site が未設定");
  });
});

describe("buildPageUrls", () => {
  const siteOrigin = "https://byte-lark.com";

  it("canonical の指定が無ければページのパスから作る", () => {
    const { canonicalUrl } = buildPageUrls({
      siteOrigin,
      pathname: "/blog/test/",
    });

    expect(canonicalUrl).toBe("https://byte-lark.com/blog/test/");
  });

  it("canonical の指定があればそれを使う", () => {
    const { canonicalUrl } = buildPageUrls({
      siteOrigin,
      pathname: "/blog/test/",
      canonical: "https://example.com/original/",
    });

    expect(canonicalUrl).toBe("https://example.com/original/");
  });

  it("OG 画像の相対パスを絶対 URL にする", () => {
    const { ogImageUrl } = buildPageUrls({
      siteOrigin,
      pathname: "/blog/test/",
      ogImage: "/_astro/cover.HASH.webp",
    });

    expect(ogImageUrl).toBe("https://byte-lark.com/_astro/cover.HASH.webp");
  });

  it("OG 画像の指定が無ければサイト共通の画像を使う", () => {
    const { ogImageUrl } = buildPageUrls({ siteOrigin, pathname: "/" });

    expect(ogImageUrl).toBe("https://byte-lark.com/og-default.png");
  });
});

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
