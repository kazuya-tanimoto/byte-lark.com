export interface Skill {
  id: number;
  name: string;
  icon?: string;
  years: number;
}

export interface SkillSet {
  category_id: number;
  category_name: string;
  items: Skill[];
}
