import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("複数のクラス名を結合する", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("falsy な値を除外する", () => {
    expect(cn("px-2", false, undefined, null, "text-sm")).toBe("px-2 text-sm");
  });

  it("条件付きオブジェクト記法を解決する", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("競合する Tailwind クラスは後勝ちでマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });
});
