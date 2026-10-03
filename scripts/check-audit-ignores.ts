// audit で除外した勧告に修正版が出たら止める。
// 除外の決まりの正本は .github/workflows/quality.yml の「Audit dependencies」のコメント。
// 使い方: node --experimental-strip-types scripts/check-audit-ignores.ts
//   yarn audit:ignores で同じものが走る。GITHUB_TOKEN があれば勧告の取得に使う
//
// なぜ要るか: `--ignore` に並べた勧告は audit が黙って通すので、修正版が出ても誰も気づかない。
// 除外した勧告を下の表に書き、GitHub の勧告データに修正版が載った時点で CI を落とす。
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type IgnoredAdvisory = {
  /** `yarn npm audit` の出力に出る ID。quality.yml の `--ignore` に書くのと同じ値 */
  id: string;
  /** GitHub の勧告 ID。修正版の有無はこの ID で調べる */
  ghsa: string;
  package: string;
};

/** audit で除外している勧告。quality.yml の `--ignore` と 1 対 1 に保つ */
export const IGNORED: IgnoredAdvisory[] = [
  {
    id: "1240991",
    ghsa: "GHSA-ch52-4w7c-c8xp",
    package: "http-cache-semantics",
  },
];

/** GitHub の勧告 API（GET /advisories/{ghsa_id}）の応答のうち、使う項目だけ */
export type Advisory = {
  withdrawn_at: string | null;
  vulnerabilities: {
    package: { name: string } | null;
    first_patched_version: string | null;
  }[];
};

/** workflow の `yarn npm audit` の行から `--ignore` の ID を取り出す */
export function parseIgnoredIds(workflow: string): string[] {
  const ids: string[] = [];
  for (const line of workflow.split(/\r?\n/)) {
    if (!line.includes("yarn npm audit")) continue;
    for (const m of line.matchAll(/--ignore[= ]+(\S+)/g)) ids.push(m[1]);
  }
  return ids;
}

/** `--ignore` の ID と表を突き合わせ、片方にしか無い ID を NG として返す */
export function checkTable(
  workflowIds: string[],
  table: IgnoredAdvisory[],
): string[] {
  const errors: string[] = [];
  const known = new Set(table.map((a) => a.id));
  const used = new Set(workflowIds);
  for (const id of workflowIds) {
    if (!known.has(id))
      errors.push(
        `${id}: quality.yml の --ignore にあるが、scripts/check-audit-ignores.ts の表に無い`,
      );
  }
  for (const a of table) {
    if (!used.has(a.id))
      errors.push(
        `${a.id}: 表にあるが、quality.yml の --ignore に無い（除外を外したなら表からも消す）`,
      );
  }
  return errors;
}

/** 勧告 1 件を見て、除外を外すべきなら理由を返す（空配列なら除外のままでよい） */
export function checkAdvisory(
  entry: IgnoredAdvisory,
  advisory: Advisory,
): string[] {
  if (advisory.withdrawn_at !== null) {
    return [
      `${entry.id}（${entry.ghsa}）: 勧告が取り下げられた。--ignore と表から外す`,
    ];
  }
  const patched = advisory.vulnerabilities
    .filter((v) => v.package?.name === entry.package)
    .map((v) => v.first_patched_version)
    .filter((v): v is string => v !== null);
  if (patched.length === 0) return [];
  return [
    `${entry.id}（${entry.ghsa}）: ${entry.package} の修正版 ${patched.join(" / ")} が出た。版を上げて、--ignore と表から外す`,
  ];
}

async function fetchAdvisory(ghsa: string): Promise<Advisory> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com/advisories/${ghsa}`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(`${ghsa}: 勧告を取得できない（HTTP ${res.status}）`);
  }
  return (await res.json()) as Advisory;
}

async function main(): Promise<void> {
  const workflow = readFileSync(
    join(import.meta.dirname, "../.github/workflows/quality.yml"),
    "utf8",
  );
  const errors = checkTable(parseIgnoredIds(workflow), IGNORED);
  for (const entry of IGNORED) {
    errors.push(...checkAdvisory(entry, await fetchAdvisory(entry.ghsa)));
  }
  for (const e of errors) console.log(`NG: ${e}`);
  if (errors.length > 0) {
    console.log(
      "audit の除外に不備あり。.github/workflows/quality.yml の「Audit dependencies」のコメントに従って直してください。",
    );
    process.exit(1);
  }
  console.log(
    `OK: audit で除外した勧告 ${IGNORED.length} 件に、修正版はまだ無い`,
  );
}

if (process.argv[1] && /check-audit-ignores\.ts$/.test(process.argv[1])) {
  main().catch((e: unknown) => {
    console.log(`NG: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  });
}
