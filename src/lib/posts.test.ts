import { describe, expect, it } from "vitest";
import { isVisiblePost } from "./posts";

describe("isVisiblePost", () => {
  it("公開記事は本番でも dev でも表示する", () => {
    expect(isVisiblePost({ draft: false }, false)).toBe(true);
    expect(isVisiblePost({ draft: false }, true)).toBe(true);
    expect(isVisiblePost({}, false)).toBe(true);
  });

  it("下書きは本番では除外する", () => {
    expect(isVisiblePost({ draft: true }, false)).toBe(false);
  });

  it("下書きは dev では表示する", () => {
    expect(isVisiblePost({ draft: true }, true)).toBe(true);
  });
});
