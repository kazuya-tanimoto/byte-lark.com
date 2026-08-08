export interface Qualification {
  id: number;
  name: string;
  /** 取得年月（"YYYY/MM" 形式、career.ts の from/to と同形式） */
  acquiredAt: string;
}
