import { describe, expect, it } from "vitest";
import {
  formatPostDate,
  isVisiblePost,
  postSlug,
  sortPostsByNewest,
  toIsoDate,
} from "./posts";

const post = (id: string, publishedAt: string) => ({
  id,
  data: { publishedAt: new Date(publishedAt) },
});

describe("sortPostsByNewest", () => {
  it("公開日の新しい順に並べる", () => {
    const posts = [
      post("a", "2026-08-08"),
      post("b", "2026-10-01"),
      post("c", "2026-09-16"),
    ];

    expect(sortPostsByNewest(posts).map((p) => p.id)).toEqual(["b", "c", "a"]);
  });

  it("同じ日付の記事は渡された順を保つ", () => {
    const posts = [
      post("a", "2026-08-18"),
      post("b", "2026-08-18"),
      post("c", "2026-08-23"),
    ];

    expect(sortPostsByNewest(posts).map((p) => p.id)).toEqual(["c", "a", "b"]);
  });

  it("渡した配列は並べ替えない", () => {
    const posts = [post("a", "2026-08-08"), post("b", "2026-10-01")];

    sortPostsByNewest(posts);

    expect(posts.map((p) => p.id)).toEqual(["a", "b"]);
  });
});

describe("postSlug", () => {
  it("frontmatter に slug があればそれを使う", () => {
    expect(
      postSlug({ id: "2026-08-claude-code", data: { slug: "claude-code" } }),
    ).toBe("claude-code");
  });

  it("slug が無ければフォルダ名（id）を使う", () => {
    expect(postSlug({ id: "incorporating-bytelark", data: {} })).toBe(
      "incorporating-bytelark",
    );
  });
});

describe("formatPostDate", () => {
  it("年月日を日本語の形で出す", () => {
    expect(formatPostDate(new Date(2026, 9, 1))).toBe("2026年10月1日");
  });
});

describe("toIsoDate", () => {
  it("<time datetime> 用に YYYY-MM-DD で出す", () => {
    expect(toIsoDate(new Date(Date.UTC(2026, 9, 1)))).toBe("2026-10-01");
  });
});
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
