import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { requireSiteOrigin } from "../lib/og";
import { postSlug, sortPostsByNewest } from "../lib/posts";

export async function GET(context: APIContext) {
  // isVisiblePost は使わない。一覧・記事ページと違い、dev サーバーでも下書きをフィードに出さない
  const posts = await getCollection("posts", ({ data }) => data.draft !== true);

  return rss({
    title: "byte-lark.com",
    description:
      "byte-lark — PM/PO・フルスタックエンジニア谷本和也のポートフォリオ・技術ブログ",
    site: requireSiteOrigin(context.site),
    items: sortPostsByNewest(posts).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${postSlug(post)}/`,
    })),
  });
}
