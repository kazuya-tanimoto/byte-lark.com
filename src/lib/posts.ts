/**
 * 記事を表示対象にするかの判定。
 * draft: true の記事は build（本番）から除外するが、dev サーバーでは表示して見た目を確認できるようにする。
 * dev で表示中の下書きには BlogCard / PostLayout が「draft」チップを付ける。
 */
export function isVisiblePost(
  data: { draft?: boolean },
  isDev: boolean = import.meta.env.DEV,
) {
  return data.draft !== true || isDev;
}

/** 記事を新しい順に並べた新しい配列を返す。同じ日付の記事は渡された順を保つ */
export function sortPostsByNewest<T extends { data: { publishedAt: Date } }>(
  posts: T[],
): T[] {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

/** 記事 URL の末尾（/blog/<slug>/）。frontmatter の slug が無ければフォルダ名を使う */
export function postSlug(post: { id: string; data: { slug?: string } }) {
  return post.data.slug ?? post.id;
}

const postDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** 記事の日付の表示（2026年10月1日） */
export function formatPostDate(date: Date) {
  return postDateFormatter.format(date);
}

/** <time datetime> 用の日付（YYYY-MM-DD） */
export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
