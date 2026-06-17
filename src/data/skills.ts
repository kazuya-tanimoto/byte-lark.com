import type { SkillSet } from "@/types/skills";

// 年数は運営者確認済みの実務経験年数（2026-06、PHASE1B-001）。
// 出典: career-docs/master-career-data.md + 職歴タイムライン（2014 職務経歴書 + 2024-08 スキルシート）。
// アイコンは devicon の実在を raw.githubusercontent.com/devicon.json で照合済み。
// 不在（SQL / Struts / AI 系）はアイコンなしで統一。
export const skills: SkillSet[] = [
  {
    category_id: 1,
    category_name: "OS / Middleware",
    items: [
      {
        id: 1,
        name: "Linux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
        years: 12,
      },
      {
        id: 2,
        name: "Apache",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
        years: 12,
      },
      {
        id: 3,
        name: "Nginx",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
        years: 2,
      },
      {
        id: 4,
        name: "Oracle",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
        years: 12,
      },
    ],
  },
  {
    category_id: 2,
    category_name: "Languages",
    items: [
      {
        id: 5,
        name: "PHP",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        years: 11,
      },
      {
        id: 6,
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        years: 10,
      },
      {
        id: 7,
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        years: 3,
      },
      {
        id: 8,
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        years: 3,
      },
      {
        id: 9,
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        years: 6,
      },
      {
        id: 10,
        name: "C",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
        years: 6,
      },
      {
        id: 11,
        name: "VB.Net",
        years: 6,
      },
      {
        id: 12,
        name: "ShellScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
        years: 10,
      },
      {
        id: 13,
        name: "SQL",
        // devicon に汎用 sql アイコンは存在しない（VB.Net / Struts / GAS 同様アイコンなし）
        years: 12,
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
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        years: 3,
      },
      {
        id: 15,
        name: "TailwindCSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        years: 3,
      },
      {
        id: 16,
        name: "Laravel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
        years: 5,
      },
      {
        id: 17,
        name: "CodeIgniter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg",
        years: 6,
      },
      {
        id: 18,
        name: "Flask",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        years: 2,
      },
      {
        id: 19,
        name: "Struts",
        // devicon に struts アイコンは存在しない（URL は 404）。VB.Net / SQL / GAS 同様アイコンなし
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
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        years: 11,
      },
      {
        id: 21,
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        years: 2,
      },
    ],
  },
  {
    category_id: 5,
    category_name: "Tools",
    items: [
      {
        id: 22,
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        years: 12,
      },
      {
        id: 23,
        name: "JetBrains",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jetbrains/jetbrains-original.svg",
        years: 8,
      },
      {
        id: 24,
        name: "Neovim",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neovim/neovim-original.svg",
        years: 3,
      },
      {
        id: 25,
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
        years: 6,
      },
      {
        id: 26,
        name: "GAS",
        // devicon に GAS（Google Apps Script）アイコンは存在しない
        years: 3,
      },
      {
        id: 27,
        name: "Selenium",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg",
        years: 5,
      },
    ],
  },
  {
    category_id: 6,
    category_name: "AI 活用",
    // 年数表示に馴染まないため名前のみ。devicon に該当アイコンなし。
    items: [
      { id: 28, name: "Claude" },
      { id: 29, name: "Claude Code" },
      { id: 30, name: "Cursor" },
      { id: 31, name: "GitHub Copilot" },
      { id: 32, name: "ChatGPT" },
      { id: 33, name: "Gemini" },
      { id: 34, name: "MCP" },
    ],
  },
];
