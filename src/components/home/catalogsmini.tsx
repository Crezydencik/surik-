"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GameItem from "../ux/gameitems";
import styles from "./styles/catalogsmini.module.scss";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Game as DbGame } from "../../lib/interfase";

// языки для jsonb
type Lang = "en" | "lv" | "ru";

// Чип категории для UI (название + количество игр)
type CategoryChip = {
  id: number;
  title: Record<Lang, string>;
  count: number;
};

// Ответ по категориям с вложенным массивом games(id)
type CategoryRow = {
  id: number;
  name: Record<Lang, string>;
  games: { id: string }[] | null;
};

// Ответ по играм со связанной категорией (массивом или объектом)
type GameRow = DbGame & {
  // supabase иногда возвращает массив связанных строк
  category:
    | { id: number; name: Record<Lang, string> }
    | { id: number; name: Record<Lang, string> }[]
    | null;
};

const Catalogsmini = () => {
  const supabase = createClientComponentClient();
  const [games, setGames] = useState<
    (DbGame & { category?: { id: number; name: Record<Lang, string> } })[]
  >([]);
  const [categories, setCategories] = useState<CategoryChip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(6);

  const { i18n } = useTranslation();
  const lang = (i18n.language as keyof DbGame["title_key"]) || "en";

  // Загружаем топ-5 непустых категорий
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("game_categori")
        .select("id, name, games(id)");

      if (error) {
        console.error("Ошибка при загрузке категорий:", error.message);
        return;
      }

      if (data) {
        const rows = data as unknown as CategoryRow[];
        const withCount: CategoryChip[] = rows.map((cat) => ({
          id: cat.id,
          title: cat.name,
          count: cat.games?.length ?? 0,
        }));

        const top5 = withCount
          .filter((c) => c.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setCategories(top5);
      }
    };

    fetchCategories();
  }, [supabase]);

  // Загружаем игры
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);

      let query = supabase
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
          category_id,
          category:game_categori ( id, name )
        `,
          { count: "exact" },
        )
        .limit(limit);

      if (search) {
        query = query.ilike(`title_key->>${String(lang)}`, `%${search}%`);
      }
      if (category !== "all") {
        query = query.eq("category_id", Number(category)); // <- category_id числовой
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Ошибка при загрузке игр:", error.message);
        setGames([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as unknown as GameRow[];

      // Превращаем category из массива (если пришёл массив) в одиночный объект
      const mapped = rows.map((game) => {
        const cat = Array.isArray(game.category)
          ? game.category[0]
          : game.category || undefined;
        return { ...game, category: cat };
      });

      setGames(mapped);
      setTotal(count ?? 0);
      setLoading(false);
    };

    fetchGames();
  }, [supabase, search, category, lang, limit]);

  return (
    <section className="bg-[#050119] text-white py-16 px-6">
      <div className="container mx-auto text-center space-y-8">
        {/* Заголовки */}
        <h2 className="text-4xl font-bold">
          {lang === "ru"
            ? "Каталог игр"
            : lang === "lv"
            ? "Spēļu katalogs"
            : "Game Catalog"}
        </h2>
        <p className="text-gray-300">
          {lang === "ru"
            ? `Более ${total} настольных игр для всех возрастов и предпочтений`
            : lang === "lv"
            ? `Vairāk nekā ${total} galda spēles visām vecuma grupām un gaumēm`
            : `Over ${total} board games for all ages and preferences`}
        </p>

        {/* Поиск */}
        <div className={styles["searchbox"]}>
          <Search size={18} className={styles["icon"]} />
          <input
            type="text"
            placeholder={
              lang === "ru"
                ? "Поиск игр..."
                : lang === "lv"
                ? "Meklēt spēles..."
                : "Search games..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Категории */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-full transition ${
              category === "all"
                ? "bg-purple-600 text-white"
                : "bg-[#1E1E2F] text-gray-300 hover:bg-purple-700"
            }`}
          >
            {lang === "ru"
              ? "Все игры"
              : lang === "lv"
              ? "Visas spēles"
              : "All Games"}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(String(cat.id))}
              className={`px-4 py-2 rounded-full transition ${
                category === String(cat.id)
                  ? "bg-purple-600 text-white"
                  : "bg-[#1E1E2F] text-gray-300 hover:bg-purple-700"
              }`}
            >
              {cat.title[lang as Lang] || cat.title.en} ({cat.count})
            </button>
          ))}
        </div>

        {/* Игры */}
        {loading ? (
          <p className="text-white"></p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {games.length > 0 ? (
                games.map((game) => (
                  <GameItem
                    key={game.id}
                    title={game.title_key[lang] || game.title_key["en"]}
                    description={
                      game.description_key[lang] || game.description_key["en"]
                    }
                    img={game.image_url}
                    players={`${game.min_players}-${game.max_players}`}
                    time={`${game.duration_minutes} мин`}
                    rating={game.rating ?? undefined}
                    difficulty={game.difficulty}
                    available={game.is_available}
                    category={
                      game.category?.name?.[lang as Lang] ||
                      game.category?.name?.en
                    }
                  />
                ))
              ) : (
                <p className="text-gray-400">
                  {lang === "ru"
                    ? "Игры не найдены"
                    : lang === "lv"
                    ? "Spēles nav atrastas"
                    : "No games found"}
                </p>
              )}
            </div>

            {/* Пагинация */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-400">
                {lang === "ru"
                  ? `Показано ${games.length} из ${total} игр`
                  : lang === "lv"
                  ? `Parādītas ${games.length} no ${total} spēlēm`
                  : `Showing ${games.length} of ${total} games`}
              </p>
              {games.length < total && (
                <button
                  onClick={() => setLimit(limit + 6)}
                  className="px-6 py-2 bg-[#1E1E2F] hover:bg-purple-600 rounded-lg transition"
                >
                  {lang === "ru"
                    ? "Загрузить ещё"
                    : lang === "lv"
                    ? "Ielādēt vēl"
                    : "Load more"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Catalogsmini;
