import { Game } from "../../../../lib/interfase"; 
import { createClient } from "../../../../lib/supabase";

// Базовые типы для jsonb-полей
type Lang = "en" | "lv" | "ru";

export type Category = {
  id: number;
  name: Record<Lang, string>;
};

// Строка из БД c join на категорию (иногда Supabase отдаёт массив)
type GameRow = Game & {
  category?: Category | Category[] | null;
};

// Игры с “развёрнутой” категорией (всегда объект или undefined)
export type GameWithCategory = Game & {
  category?: Category;
};

// Что разрешаем обновлять
type UpdatableKeys =
  | "title_key"
  | "description_key"
  | "min_players"
  | "max_players"
  | "duration_minutes"
  | "difficulty"
  | "rating"
  | "price"
  | "image_url"
  | "is_available"
  | "category_id";

export type GameUpdate = Partial<Pick<Game, UpdatableKeys>>;

// При создании игры обычно нет id/created_at/category (join)
export type CreateGamePayload = Omit<Game, "id" | "created_at">;

// --- общий клиент
const supabase = createClient();

/** Получить все игры (с категорией) */
export async function getAllGames(): Promise<GameWithCategory[]> {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      id,
      title_key,
      description_key,
      min_players,
      max_players,
      duration_minutes,
      difficulty,
      rating,
      price,
      image_url,
      is_available,
      created_at,
      category_id,
      category:game_categori ( id, name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при загрузке игр:", error.message);
    return [];
  }

  // нормализуем category: если массив — берём первый
  const rows = (data ?? []) as GameRow[];
  return rows.map((g) => ({
    ...g,
    category: Array.isArray(g.category)
      ? g.category[0]
      : g.category ?? undefined,
  }));
}

/** Создать игру */
export async function createGame(gameData: CreateGamePayload): Promise<Game> {
  const { data, error } = await supabase
    .from("games") // ← если у тебя реально другая таблица — верни "board_games"
    .insert(gameData)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

/** Загрузить картинку в Supabase Storage и вернуть публичный URL */
export async function uploadImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage.from("games").upload(filePath, file);
  if (error) throw error;

  const { data } = supabase.storage.from("games").getPublicUrl(filePath);
  return data.publicUrl;
}

/** Получить игру по id */
export async function getGameById(id: string): Promise<GameWithCategory> {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      id,
      title_key,
      description_key,
      min_players,
      max_players,
      duration_minutes,
      difficulty,
      rating,
      price,
      image_url,
      is_available,
      created_at,
      category_id,
      category:game_categori ( id, name )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const row = data as GameRow;
  return {
    ...row,
    category: Array.isArray(row.category)
      ? row.category[0]
      : row.category ?? undefined,
  };
}

/** Обновить игру по id */
export async function updateGameById(
  id: string,
  values: GameUpdate,
): Promise<Game> {
  const { data, error } = await supabase
    .from("games")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

/** Удалить игру */
export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Получить все категории */
export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("game_categori")
    .select("id, name");
  if (error) throw error;
  return (data ?? []) as Category[];
}

/** Добавить категорию */
export async function addCategory(
  name: Record<Lang, string>,
): Promise<Category> {
  const { data, error } = await supabase
    .from("game_categori")
    .insert({ name }) // ← проверь, поле точно называется "name", не "Name"
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

/** Удалить категорию */
export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from("game_categori").delete().eq("id", id);
  if (error) throw error;
}
