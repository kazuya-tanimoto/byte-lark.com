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
