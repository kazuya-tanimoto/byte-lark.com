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
