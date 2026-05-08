import { getViteConfig } from "astro/config";

export default getViteConfig(
  { test: { passWithNoTests: true } } as Record<string, unknown>,
);
