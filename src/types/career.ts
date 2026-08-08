// 経歴データの型。
// 一覧カード（CareerItem）と、クリックで開くモーダル詳細（CareerDetail）を分離する。
// 詳細を持つ案件は CareerDetail を用意し、id で対応づける（持たない案件はカードのみ）。

/** 雇用形態。フリーランス＝業務委託（準委任）、副業＝在職中の請負 */
export type Employment = "会社員" | "フリーランス" | "副業";

export interface CareerItem {
  id: number;
  title: string;
  /** カードに出す 1〜2 行の要約 */
  summary: string;
  /** カードに出す技術・役割の短いキーワード列 */
  keywords: string;
  role?: string;
  employment: Employment;
  /** YYYY/MM。to 省略時は「現在」 */
  from: string;
  to?: string;
}

export interface CareerDetail {
  /** 対応する CareerItem.id */
  id: number;
  role: string;
  /** 例: "チーム17名 / 業務委託" */
  scale: string;
  /** 利用技術・ツール（行ごとに分けて表示） */
  technology: string[];
  /** 担当業務 */
  responsibilities: string[];
  /** 成果・ポイント */
  achievements: string[];
}
