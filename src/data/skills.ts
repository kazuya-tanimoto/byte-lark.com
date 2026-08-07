import type { SkillSet } from "@/types/skills";

// 年数は運営者確認済みの実務経験年数（2026-06、PHASE1B-001）。
// 出典: career-docs/master-career-data.md + 職歴タイムライン（2014 職務経歴書 + 2024-08 スキルシート）。
// アイコンは public/icons/ に自前ホストする（PHASE1C-014 で外部 CDN 直リンクから移行）。
// 出典とライセンスは public/icons/LICENSE.txt を参照。
export const skills: SkillSet[] = [
  {
    category_id: 1,
    category_name: "OS / Middleware",
    items: [
      {
        id: 1,
        name: "Linux",
        icon: "/icons/linux.svg",
        years: 12,
      },
      {
        id: 2,
        name: "Apache",
        icon: "/icons/apache.svg",
        years: 12,
      },
      {
        id: 3,
        name: "Nginx",
        icon: "/icons/nginx.svg",
        years: 2,
      },
    ],
  },
  {
    category_id: 2,
    category_name: "Languages",
    items: [
      {
        id: 4,
        name: "PHP",
        icon: "/icons/php.svg",
        years: 11,
      },
      {
        id: 5,
        name: "JavaScript",
        icon: "/icons/javascript.svg",
        years: 10,
      },
      {
        id: 6,
        name: "TypeScript",
        icon: "/icons/typescript.svg",
        years: 3,
      },
      {
        id: 7,
        name: "Python",
        icon: "/icons/python.svg",
        years: 3,
      },
      {
        id: 8,
        name: "Java",
        icon: "/icons/java.svg",
        years: 6,
      },
      {
        id: 9,
        name: "C",
        icon: "/icons/c.svg",
        years: 6,
      },
      {
        id: 10,
        name: "VB.Net",
        icon: "/icons/visualbasic.svg",
        years: 6,
      },
      {
        id: 11,
        name: "ShellScript",
        icon: "/icons/bash.svg",
        years: 10,
      },
      {
        id: 12,
        name: "SQL",
        // SQL は標準規格でロゴが存在しないため、唯一の汎用アイコン（tabler）
        icon: "/icons/sql.svg",
        years: 12,
      },
      {
        id: 13,
        name: "GAS",
        icon: "/icons/gas.svg",
        years: 3,
      },
    ],
  },
  {
    category_id: 3,
    category_name: "Frameworks / Libraries",
    items: [
      {
        id: 14,
        name: "React",
        icon: "/icons/react.svg",
        years: 3,
      },
      {
        id: 15,
        name: "TailwindCSS",
        icon: "/icons/tailwindcss.svg",
        years: 3,
      },
      {
        id: 16,
        name: "Laravel",
        icon: "/icons/laravel.svg",
        years: 5,
      },
      {
        id: 17,
        name: "CodeIgniter",
        icon: "/icons/codeigniter.svg",
        years: 6,
      },
      {
        id: 18,
        name: "Flask",
        icon: "/icons/flask.svg",
        years: 2,
      },
      {
        id: 19,
        name: "Struts",
        icon: "/icons/struts.svg",
        years: 6,
      },
    ],
  },
  {
    category_id: 4,
    category_name: "Databases",
    items: [
      {
        id: 20,
        name: "Oracle",
        icon: "/icons/oracle.svg",
        years: 12,
      },
      {
        id: 21,
        name: "MySQL",
        icon: "/icons/mysql.svg",
        years: 11,
      },
      {
        id: 22,
        name: "PostgreSQL",
        icon: "/icons/postgresql.svg",
        years: 2,
      },
    ],
  },
  {
    category_id: 5,
    category_name: "Tools",
    items: [
      {
        id: 23,
        name: "Git",
        icon: "/icons/git.svg",
        years: 12,
      },
      {
        id: 24,
        name: "JetBrains",
        icon: "/icons/jetbrains.svg",
        years: 8,
      },
      {
        id: 25,
        name: "Neovim",
        icon: "/icons/neovim.svg",
        years: 3,
      },
      {
        id: 26,
        name: "Docker",
        icon: "/icons/docker.svg",
        years: 6,
      },
      {
        id: 27,
        name: "Selenium",
        icon: "/icons/selenium.svg",
        years: 5,
      },
    ],
  },
  {
    category_id: 6,
    category_name: "AI 活用",
    // 年数表示に馴染まないため名前のみ。
    items: [
      { id: 28, name: "Claude", icon: "/icons/claude.svg" },
      { id: 29, name: "Claude Code", icon: "/icons/claude-code.svg" },
      { id: 30, name: "Cursor", icon: "/icons/cursor.svg" },
      { id: 31, name: "GitHub Copilot", icon: "/icons/copilot.svg" },
      { id: 32, name: "ChatGPT", icon: "/icons/chatgpt.svg" },
      { id: 33, name: "Gemini", icon: "/icons/gemini.svg" },
      { id: 34, name: "MCP", icon: "/icons/mcp.svg" },
    ],
  },
];
