// 【要確認】の書式・件数・公開記事への残留を機械検査する。
// 決まりの正本は docs/writing-workflow.md「材料に無いことの扱い（ドラフト以降）」節。
// 使い方: node --experimental-strip-types scripts/check-draft-questions.ts [posts ディレクトリ]
//   （省略時は src/content/posts）。yarn posts:check で同じものが走る
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/** 1 記事に残してよい【要確認】の上限 */
export const MAX_QUESTIONS = 3;

const MARK = "【要確認";
const KINDS = "事実|主張|画像";
const HEADER = new RegExp(`^> 【要確認｜(${KINDS})】\\s*$`);
const LABELS = ["> 対象：", "> 質問：", "> 無回答なら："] as const;

/** frontmatter の draft を読む。無ければ content schema の既定（true）と同じ扱い */
export function isDraft(content: string): boolean {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return true;
  const draft = fm[1].match(/^draft:\s*(true|false)\s*$/m);
  return draft ? draft[1] === "true" : true;
}

/** 記事 1 本を検査し、NG を「L行: 内容」の配列で返す（空配列なら合格） */
export function checkPost(content: string): string[] {
  const errors: string[] = [];
  const lines = content.split(/\r?\n/);
  const draft = isDraft(content);
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(MARK)) continue;
    const at = `L${i + 1}`;

    if (!draft) {
      errors.push(`${at}: 公開記事（draft: false）に【要確認】が残っている`);
      continue;
    }
    if (!HEADER.test(line)) {
      errors.push(
        `${at}: 【要確認】が 4 行書式ではない（1 行目は「> 【要確認｜事実】」の形。種別は ${KINDS.replace(/\|/g, "／")}）`,
      );
      continue;
    }
    count++;
    for (let k = 0; k < LABELS.length; k++) {
      const label = LABELS[k];
      const got = (lines[i + 1 + k] ?? "").trimEnd();
      if (!got.startsWith(label) || got.length === label.length) {
        errors.push(
          `${at}: 【要確認】の ${k + 2} 行目が「${label}…」になっていない（空も不可）`,
        );
        break;
      }
    }
  }

  if (count > MAX_QUESTIONS) {
    errors.push(
      `【要確認】が ${count} 件（上限 ${MAX_QUESTIONS} 件）。超える分は聞かずに削る`,
    );
  }
  return errors;
}

export type ScanResult = {
  checked: number;
  failures: { file: string; errors: string[] }[];
};

/** ディレクトリ配下の .md / .mdx を再帰的に検査する */
export function scanPosts(root: string): ScanResult {
  const files = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && /\.mdx?$/.test(d.name))
    .map((d) => join(d.parentPath, d.name))
    .sort();
  const failures: ScanResult["failures"] = [];
  for (const file of files) {
    const errors = checkPost(readFileSync(file, "utf8"));
    if (errors.length > 0)
      failures.push({ file: relative(root, file), errors });
  }
  return { checked: files.length, failures };
}

function main(): void {
  const root = resolve(
    process.argv[2] ?? join(import.meta.dirname, "../src/content/posts"),
  );
  const { checked, failures } = scanPosts(root);
  for (const { file, errors } of failures) {
    for (const e of errors) console.log(`NG: ${file} ${e}`);
  }
  if (failures.length > 0) {
    console.log(
      "【要確認】の書式・件数・残留に不備あり。docs/writing-workflow.md「材料に無いことの扱い」節に従って直してください。",
    );
    process.exit(1);
  }
  console.log(`OK: 【要確認】の検査に合格（${checked} 記事）`);
}

if (process.argv[1] && /check-draft-questions\.ts$/.test(process.argv[1]))
  main();
