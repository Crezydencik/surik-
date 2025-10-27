export type Lang = "en" | "lv" | "ru";
export type MultiLangField = Record<Lang, string>;
export interface Game {
  id: string;
  title_key: MultiLangField;
  description_key: MultiLangField;
  min_players: number;
  max_players: number;
  duration_minutes: number;
  difficulty: string;
  rating: number | null;
  price?: number | null;
  image_url: string;
  is_available: boolean;
  category_id: number | null; // ← исправляем на number
  category?: {
    id: number; // ← исправляем на number
    name: MultiLangField;
  };
}

export interface Category {
  id: number; // ← тоже number
  name: MultiLangField;
}
export interface GameWithCategory extends Game {
  category?: {
    id: number;
    name: MultiLangField;
  };
}

export interface GameCardProps {
  game: GameWithCategory;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}
