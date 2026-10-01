import { describe, expect, it } from "vitest";
import { categoryLabels } from "./categories";

describe("categoryLabels", () => {
  it("カテゴリの値を表示名に対応させる", () => {
    expect(categoryLabels).toEqual({ tech: "Tech", life: "Life" });
  });
});
