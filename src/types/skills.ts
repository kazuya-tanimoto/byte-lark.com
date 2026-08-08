export interface Skill {
  id: number;
  name: string;
  icon?: string;
  /** 実務での経験年数。年数表示に馴染まない項目（AI 活用ツール等）は省略し、名前のみ表示する。 */
  years?: number;
}

export interface SkillSet {
  category_id: number;
  category_name: string;
  items: Skill[];
}
