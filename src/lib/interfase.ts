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
export interface GameItemProps {
  title: string;
  description?: string;
  img: string;
  players?: string;
  time: string;
  rating?: number;
  difficulty?: string;
  available?: boolean;
  status?: "available" | "busy" | "queue"; // 🟢 🟠 ⚪
  category?: string; // 👈 новое поле
}

export interface Category {
  id: number; // ← тоже number
  name: MultiLangField;
}
export type GameWithCategory = Game & { category: Category | null };

export type AdminGame = Game | GameWithCategory;

export type GameCardProps = {
  game: AdminGame;
  onDelete?: (id: string) => void | Promise<void>;
  onEdit?: (id: string) => void;
};
