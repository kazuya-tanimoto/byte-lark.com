import type { Qualification } from "@/types/qualifications";

/** 保有資格（FR-15: Home 内セクション表示、独立ページなし）。取得年月の降順。 */
export const qualifications: Qualification[] = [
  {
    id: 1,
    name: "プロジェクトマネージャ",
    acquiredAt: "2011/06",
  },
  {
    id: 2,
    name: "データベーススペシャリスト",
    acquiredAt: "2010/06",
  },
  {
    id: 3,
    name: "ORACLE MASTER Silver 10g",
    acquiredAt: "2010/01",
  },
  {
    id: 4,
    name: "システムアーキテクト",
    acquiredAt: "2009/12",
  },
  {
    id: 5,
    name: "ソフトウェア開発技術者",
    acquiredAt: "2008/12",
  },
];
