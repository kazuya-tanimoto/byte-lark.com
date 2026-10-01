/**
 * 経歴を新しい順（from の降順）に並べた新しい配列を返す。
 * from は YYYY/MM 形式のため文字列比較で時系列順になる。同じ from の経歴は渡された順を保つ
 */
export function sortCareerByNewest<T extends { from: string }>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => b.from.localeCompare(a.from));
}
