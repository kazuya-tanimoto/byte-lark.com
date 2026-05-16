/**
 * Frontmatter migration script scaffold (R-02).
 *
 * Usage:
 *   npx tsx scripts/migrate-frontmatter.ts [--dry-run]
 *
 * Add migration functions below when the frontmatter schema changes.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POSTS_DIR = join(import.meta.dirname, "../src/content/posts");
const DRY_RUN = process.argv.includes("--dry-run");

interface Migration {
  name: string;
  transform: (content: string) => string;
}

const migrations: Migration[] = [
  // Add migrations here as schema evolves, e.g.:
  // {
  //   name: "add-schema-version",
  //   transform(content) {
  //     return content.replace(/^(---\n)/, "$1schema_version: 2\n");
  //   },
  // },
];

function run() {
  if (migrations.length === 0) {
    console.log("No migrations to run.");
    return;
  }

  const files = readdirSync(POSTS_DIR).filter((f) => /\.(md|mdx)$/.test(f));

  for (const file of files) {
    const path = join(POSTS_DIR, file);
    let content = readFileSync(path, "utf-8");
    let changed = false;

    for (const migration of migrations) {
      const result = migration.transform(content);
      if (result !== content) {
        console.log(`[${migration.name}] ${file}`);
        content = result;
        changed = true;
      }
    }

    if (changed && !DRY_RUN) {
      writeFileSync(path, content);
    }
  }

  if (DRY_RUN) {
    console.log("(dry-run: no files were modified)");
  }
}

run();
