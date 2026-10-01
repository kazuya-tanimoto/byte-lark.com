import { describe, expect, it } from "vitest";
import { sortCareerByNewest } from "./career";

const item = (id: number, from: string) => ({ id, from });

describe("sortCareerByNewest", () => {
  it("開始年月の新しい順に並べる", () => {
    const items = [item(1, "2019/04"), item(2, "2024/10"), item(3, "2021/01")];

    expect(sortCareerByNewest(items).map((i) => i.id)).toEqual([2, 3, 1]);
  });

  it("同じ年の中でも月の新しい順に並べる", () => {
    const items = [item(1, "2023/02"), item(2, "2023/11"), item(3, "2023/05")];

    expect(sortCareerByNewest(items).map((i) => i.id)).toEqual([2, 3, 1]);
  });

  it("開始年月が同じ経歴は渡された順を保つ", () => {
    const items = [item(1, "2022/04"), item(2, "2022/04"), item(3, "2023/01")];

    expect(sortCareerByNewest(items).map((i) => i.id)).toEqual([3, 1, 2]);
  });

  it("渡した配列は並べ替えない", () => {
    const items = [item(1, "2019/04"), item(2, "2024/10")];

    sortCareerByNewest(items);

    expect(items.map((i) => i.id)).toEqual([1, 2]);
  });
});
