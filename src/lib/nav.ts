/** ナビの項目が今いるページとどう関係するか。値はそのまま aria-current に渡す */
export type NavCurrent = "page" | "true" | undefined;

/** 末尾のスラッシュを落とす。トップ（/）はそのまま */
const trimTrailingSlash = (path: string) => path.replace(/(.)\/+$/, "$1");

/**
 * ヘッダーのナビの項目が今いるページかを判定する。
 * リンク先そのものなら "page"、その下の階層（/blog/<slug> での /blog）なら "true"、
 * どちらでもなければ undefined（aria-current を出さない）。
 * Header.astro の PC 用・スマホ用のナビが、色付けと aria-current の両方に使う
 */
export function navCurrent(currentPath: string, href: string): NavCurrent {
  const path = trimTrailingSlash(currentPath);
  const target = trimTrailingSlash(href);
  if (path === target) return "page";
  if (target !== "/" && path.startsWith(target)) return "true";
  return undefined;
}
