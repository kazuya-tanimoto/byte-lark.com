export interface OgMeta {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: "website" | "article";
  siteName?: string;
}

export function buildOgMeta(meta: OgMeta) {
  const type = meta.type ?? "website";
  const siteName = meta.siteName ?? "byte-lark.com";

  return {
    "og:title": meta.title,
    "og:description": meta.description,
    "og:url": meta.url,
    "og:image": meta.image,
    "og:type": type,
    "og:site_name": siteName,
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": meta.image,
  };
}

/**
 * astro.config.mjs の `site` から origin を取り出す。
 * 未設定のまま予備の値で絶対 URL を作ると、ドメインを変えたときに canonical・OGP・RSS が
 * 古いドメインを指したまま気づけないので、ビルドを止める
 */
export function requireSiteOrigin(site: URL | undefined) {
  if (!site) {
    throw new Error(
      "astro.config.mjs の site が未設定です。canonical・OGP・RSS の絶対 URL を作れません",
    );
  }
  return site.origin;
}

/** ページの canonical と OG 画像の絶対 URL。OG 画像の指定が無ければサイト共通の画像を使う */
export function buildPageUrls(params: {
  siteOrigin: string;
  pathname: string;
  canonical?: string;
  ogImage?: string;
}) {
  const { siteOrigin, pathname, canonical, ogImage } = params;
  return {
    canonicalUrl: canonical ?? new URL(pathname, siteOrigin).href,
    ogImageUrl: new URL(ogImage || "/og-default.png", siteOrigin).href,
  };
}
