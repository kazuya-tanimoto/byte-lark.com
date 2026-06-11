export interface ArticleJsonLdInput {
  /** 記事タイトル → headline */
  title: string;
  /** 記事概要 → description */
  description: string;
  /** 記事の正規 URL（絶対 URL） → mainEntityOfPage */
  url: string;
  /** OGP 画像の絶対 URL → image */
  image: string;
  /** 公開日時 → datePublished */
  datePublished: Date;
  /** 更新日時（省略時は公開日時を流用） → dateModified */
  dateModified?: Date;
}

/** 運営者（記事の著者）を表す Person schema。 */
const AUTHOR = {
  "@type": "Person",
  name: "Kazuya Tanimoto",
  url: "https://byte-lark.com/about",
  sameAs: ["https://github.com/kazuya-tanimoto"],
} as const;

/** 発行元を表す Organization schema。 */
const PUBLISHER = {
  "@type": "Organization",
  name: "byte-lark",
  url: "https://byte-lark.com",
} as const;

/**
 * About ページ用の Person schema の JSON-LD オブジェクトを生成する。
 * 戻り値を `JSON.stringify` して `<script type="application/ld+json">` に埋め込む。
 */
export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    ...AUTHOR,
    jobTitle: "PM / PO・フルスタックエンジニア",
    worksFor: PUBLISHER,
  };
}

/**
 * Article schema の JSON-LD オブジェクトを生成する。
 * 戻り値を `JSON.stringify` して `<script type="application/ld+json">` に埋め込む。
 */
export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: input.image,
    datePublished: input.datePublished.toISOString(),
    dateModified: (input.dateModified ?? input.datePublished).toISOString(),
    author: AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
  };
}
