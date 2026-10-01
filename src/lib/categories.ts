import type { CollectionEntry } from "astro:content";

export type PostCategory = CollectionEntry<"posts">["data"]["category"];

/**
 * カテゴリの表示名。チップ（PostChips.astro）と /blog の絞り込み（CategoryFilter.tsx）が使う。
 * CategoryFilter はブラウザに配るので、posts.ts の日付書式などを巻き込まないよう別ファイルに置く
 */
export const categoryLabels: Record<PostCategory, string> = {
  tech: "Tech",
  life: "Life",
};
