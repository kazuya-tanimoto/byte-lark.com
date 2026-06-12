import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => data.draft !== true);
  const sorted = posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: "byte-lark.com",
    description:
      "byte-lark — PM/PO・フルスタックエンジニア谷本和也のポートフォリオ・技術ブログ",
    site: context.site ?? "https://byte-lark.com",
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.data.slug ?? post.id}/`,
    })),
  });
}
