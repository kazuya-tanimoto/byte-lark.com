import { useState } from "react";
import { Button } from "@/components/ui/button";

type Category = "all" | "tech" | "life";

const options: { value: Category; label: string }[] = [
  { value: "all", label: "全て" },
  { value: "tech", label: "Tech" },
  { value: "life", label: "Life" },
];

export function CategoryFilter() {
  const [selected, setSelected] = useState<Category>("all");

  // 記事カードは SSG 済みの DOM（data-blog-item）なので、React 側は表示/非表示だけ切り替える
  const apply = (category: Category) => {
    setSelected(category);
    let visibleCount = 0;
    for (const item of document.querySelectorAll<HTMLElement>(
      "[data-blog-item]",
    )) {
      const visible = category === "all" || item.dataset.category === category;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    }
    const emptyMessage =
      document.querySelector<HTMLElement>("[data-blog-empty]");
    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  };

  return (
    <fieldset aria-label="カテゴリフィルタ" className="flex gap-2">
      {options.map(({ value, label }) => (
        <Button
          key={value}
          size="sm"
          variant={selected === value ? "default" : "outline"}
          aria-pressed={selected === value}
          onClick={() => apply(value)}
        >
          {label}
        </Button>
      ))}
    </fieldset>
  );
}
