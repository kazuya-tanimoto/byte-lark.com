import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(["tech", "life"]),
      tags: z.array(z.string().transform((t) => t.toLowerCase())),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      draft: z.boolean().optional(),
      cover: image().optional(),
      slug: z.string().optional(),
    }),
});

export const collections = { posts };
