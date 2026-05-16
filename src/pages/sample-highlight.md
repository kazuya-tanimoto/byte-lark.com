---
title: "Syntax Highlight Sample"
---

# Syntax Highlight Sample

## TypeScript

```typescript
interface BlogPost {
  title: string;
  slug: string;
  publishedAt: Date;
  tags: string[];
}

function getRecentPosts(posts: BlogPost[], limit = 5): BlogPost[] {
  return posts
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

export { getRecentPosts, type BlogPost };
```

## JSX / TSX

```tsx
import { useState } from "react";

interface CounterProps {
  initial?: number;
}

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      className="rounded bg-primary px-4 py-2 text-primary-foreground"
    >
      Count: {count}
    </button>
  );
}
```
