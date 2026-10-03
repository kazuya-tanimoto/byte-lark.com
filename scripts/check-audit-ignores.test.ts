// audit の除外を見張る純関数のテスト。
// ここが緩むと、除外した勧告に修正版が出ても CI が通り続け、古い版が残る。
// `--ignore` と表の 1 対 1、修正版が出たとき・勧告が取り下げられたときに止まることを見る。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type Advisory,
  checkAdvisory,
  checkTable,
  IGNORED,
  type IgnoredAdvisory,
  parseIgnoredIds,
} from "./check-audit-ignores.ts";

const entry: IgnoredAdvisory = {
  id: "1240991",
  ghsa: "GHSA-ch52-4w7c-c8xp",
  package: "http-cache-semantics",
};

const advisory = (
  patched: string | null,
  withdrawn: string | null = null,
  name = "http-cache-semantics",
): Advisory => ({
  withdrawn_at: withdrawn,
  vulnerabilities: [{ package: { name }, first_patched_version: patched }],
});

const audit = (flags = "") =>
  `      - name: Audit dependencies\n        run: yarn npm audit --all --recursive --severity high --environment production${flags}\n`;

describe("parseIgnoredIds", () => {
  it("--ignore が無ければ空", () => {
    expect(parseIgnoredIds(audit())).toEqual([]);
  });

  it("--ignore の ID を並んだ順に取り出す", () => {
    expect(parseIgnoredIds(audit(" --ignore 1240991 --ignore 99"))).toEqual([
      "1240991",
      "99",
    ]);
  });

  it("--ignore=ID の形も読む", () => {
    expect(parseIgnoredIds(audit(" --ignore=1240991"))).toEqual(["1240991"]);
  });

  it("audit 以外の行の --ignore は数えない", () => {
    expect(
      parseIgnoredIds(`${audit()}        run: other --ignore 1240991\n`),
    ).toEqual([]);
  });
});

describe("checkTable", () => {
  it("--ignore と表が同じなら合格", () => {
    expect(checkTable(["1240991"], [entry])).toEqual([]);
  });

  it("--ignore にあって表に無い ID は NG", () => {
    const errors = checkTable(["1240991", "99"], [entry]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("99");
    expect(errors[0]).toContain("表に無い");
  });

  it("表にあって --ignore に無い ID は NG", () => {
    const errors = checkTable([], [entry]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("1240991");
    expect(errors[0]).toContain("--ignore に無い");
  });
});

describe("checkAdvisory", () => {
  it("修正版が無ければ除外のまま（合格）", () => {
    expect(checkAdvisory(entry, advisory(null))).toEqual([]);
  });

  it("修正版が出たら NG にして版を表示する", () => {
    const errors = checkAdvisory(entry, advisory("4.2.1"));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("4.2.1");
    expect(errors[0]).toContain("GHSA-ch52-4w7c-c8xp");
  });

  it("別のパッケージの修正版では止めない", () => {
    expect(checkAdvisory(entry, advisory("1.0.0", null, "other"))).toEqual([]);
  });

  it("勧告が取り下げられたら NG", () => {
    const errors = checkAdvisory(entry, advisory(null, "2026-10-10T00:00:00Z"));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("取り下げ");
  });
});

describe("repo の実物", () => {
  it("quality.yml の --ignore と表が 1 対 1", () => {
    const workflow = readFileSync(
      join(import.meta.dirname, "../.github/workflows/quality.yml"),
      "utf8",
    );
    expect(checkTable(parseIgnoredIds(workflow), IGNORED)).toEqual([]);
  });
});
