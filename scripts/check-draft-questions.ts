// 【要確認】の書式・件数と【要写真】の書式、公開記事への残留を機械検査する。
// 決まりの正本は docs/writing-workflow.md「材料に無いことの扱い（ドラフト以降）」節。
// 使い方: node --experimental-strip-types scripts/check-draft-questions.ts [posts ディレクトリ]
//   （省略時は src/content/posts）。yarn posts:check で同じものが走る
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/** 1 記事に残してよい【要確認】の上限 */
export const MAX_QUESTIONS = 3;

const MARK = "【要確認";
const KINDS = "事実|主張";
const HEADER = new RegExp(`^> 【要確認｜(${KINDS})】\\s*$`);
const LABELS = ["> 対象：", "> 質問：", "> 無回答なら："] as const;

// 写真・スクショの提供依頼は質問ではなく作業の依頼なので、別の印にして件数も数えない
const PHOTO_MARK = "【要写真";
const PHOTO = /^【要写真：.+】\s*$/;

/** frontmatter の draft を読む。無ければ content schema の既定（true）と同じ扱い */
export function isDraft(content: string): boolean {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return true;
  const draft = fm[1].match(/^draft:\s*(true|false)\s*$/m);
  return draft ? draft[1] === "true" : true;
}

/** 【要写真】の行を検査する。NG なら理由、OK なら null */
function checkPhotoLine(line: string, draft: boolean): string | null {
  if (!draft) return "公開記事（draft: false）に【要写真】が残っている";
  if (!PHOTO.test(line)) {
    return "【要写真】が 1 行書式ではない（「【要写真：撮影リスト No.1（何を撮るか）】」だけの行にする）";
  }
  return null;
}

/** 【要確認】の 4 行（1 行目が lines[i]）を検査する。NG なら理由、OK なら null */
function checkQuestionBlock(
  lines: string[],
  i: number,
  draft: boolean,
): string | null {
  if (!draft) return "公開記事（draft: false）に【要確認】が残っている";
  if (!HEADER.test(lines[i])) {
    return `【要確認】が 4 行書式ではない（1 行目は「> 【要確認｜事実】」の形。種別は ${KINDS.replace(/\|/g, "／")}）`;
  }
  for (let k = 0; k < LABELS.length; k++) {
    const label = LABELS[k];
    const got = (lines[i + 1 + k] ?? "").trimEnd();
    if (!got.startsWith(label) || got.length === label.length) {
      return `【要確認】の ${k + 2} 行目が「${label}…」になっていない（空も不可）`;
    }
  }
  return null;
}

/** 記事 1 本を検査し、NG を「L行: 内容」の配列で返す（空配列なら合格） */
export function checkPost(content: string): string[] {
  const errors: string[] = [];
  const lines = content.split(/\r?\n/);
  const draft = isDraft(content);
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let error: string | null = null;
    if (line.includes(PHOTO_MARK)) {
      error = checkPhotoLine(line, draft);
    } else if (line.includes(MARK)) {
      error = checkQuestionBlock(lines, i, draft);
      if (error === null) count++;
    } else {
      continue;
    }
    if (error !== null) errors.push(`L${i + 1}: ${error}`);
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
      "【要確認】【要写真】の書式・件数・残留に不備あり。docs/writing-workflow.md「材料に無いことの扱い」節に従って直してください。",
    );
    process.exit(1);
  }
  console.log(`OK: 【要確認】【要写真】の検査に合格（${checked} 記事）`);
}

if (process.argv[1] && /check-draft-questions\.ts$/.test(process.argv[1]))
  main();
