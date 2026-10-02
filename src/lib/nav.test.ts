import { describe, expect, it } from "vitest";
import { navCurrent } from "./nav";

describe("navCurrent", () => {
  it("リンク先が今いるページなら page を返す", () => {
    expect(navCurrent("/about", "/about")).toBe("page");
  });

  it("末尾のスラッシュの有無で判定が変わらない", () => {
    expect(navCurrent("/about/", "/about")).toBe("page");
    expect(navCurrent("/about", "/about/")).toBe("page");
    expect(navCurrent("/blog/some-post/", "/blog")).toBe("true");
  });

  it("トップでは Home だけが page になる", () => {
    expect(navCurrent("/", "/")).toBe("page");
    expect(navCurrent("/", "/about")).toBeUndefined();
  });

  it("トップ以外のページで Home は該当しない", () => {
    expect(navCurrent("/about", "/")).toBeUndefined();
    expect(navCurrent("/blog/some-post", "/")).toBeUndefined();
  });

  it("下の階層にいるときは親の項目が true になる", () => {
    expect(navCurrent("/blog/some-post", "/blog")).toBe("true");
  });

  it("ナビに無いページではどの項目も該当しない", () => {
    for (const href of [
      "/",
      "/about",
      "/career",
      "/skills",
      "/blog",
      "/contact",
    ]) {
      expect(navCurrent("/privacy", href)).toBeUndefined();
    }
  });
});
