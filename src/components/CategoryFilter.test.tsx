// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CategoryFilter } from "./CategoryFilter";

/** Blog 一覧の SSG 済み DOM（記事カード + 空メッセージ）を再現する fixture。 */
function setupBlogItems(categories: string[]) {
  const fixture = document.createElement("div");
  fixture.innerHTML = `
    <ul>
      ${categories
        .map(
          (category, i) =>
            `<li data-blog-item data-category="${category}">post-${i}</li>`,
        )
        .join("")}
    </ul>
    <p data-blog-empty hidden>該当するカテゴリの記事はありません。</p>
  `;
  document.body.appendChild(fixture);

  return {
    items: () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-blog-item]")),
    emptyMessage: () =>
      document.querySelector<HTMLElement>("[data-blog-empty]"),
  };
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("CategoryFilter", () => {
  it("初期状態では「全て」が選択されている", () => {
    setupBlogItems(["tech", "life"]);
    render(<CategoryFilter />);

    expect(
      screen.getByRole("button", { name: "全て" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Tech" }).getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("カテゴリ選択で該当しない記事カードを hidden にする", () => {
    const { items } = setupBlogItems(["tech", "life"]);
    render(<CategoryFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Life" }));

    const [techItem, lifeItem] = items();
    expect(techItem.hidden).toBe(true);
    expect(lifeItem.hidden).toBe(false);
    expect(
      screen.getByRole("button", { name: "Life" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("「全て」に戻すと全記事カードを再表示する", () => {
    const { items } = setupBlogItems(["tech", "life"]);
    render(<CategoryFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Tech" }));
    fireEvent.click(screen.getByRole("button", { name: "全て" }));

    for (const item of items()) {
      expect(item.hidden).toBe(false);
    }
  });

  it("該当記事ゼロのカテゴリでは空メッセージを表示する", () => {
    const { emptyMessage } = setupBlogItems(["tech"]);
    render(<CategoryFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Life" }));
    expect(emptyMessage()?.hidden).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Tech" }));
    expect(emptyMessage()?.hidden).toBe(true);
  });
});
