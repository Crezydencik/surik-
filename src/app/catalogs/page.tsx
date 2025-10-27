"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "react-i18next";
import type { Category, Game } from "@/lib/interfase";
import FilterSidebar from "../../components/catalogs/CategoryFilter";
import GameItem from "../../components/ux/gameitems";

// расширяем тип Game полем связанной категории
type GameWithCategory = Game & {
  category?: {
    id: number;
    name: { en: string; lv: string; ru: string };
  };
};

export default function CatalogPage() {
  const supabase = createClientComponentClient();
  const { i18n } = useTranslation();
  // нормализуем код языка до en/lv/ru
  const lang = (i18n.language?.slice(0, 2) as "en" | "lv" | "ru") || "en";

  const [games, setGames] = useState<GameWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [playerOptions, setPlayerOptions] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategories, selectedPlayers, lang]);

  const fetchData = async () => {
    setLoading(true);

    // --- основная выборка ИГР со связанной категорией ---
    let query = supabase
      .from("games")
      .select(
        `
        id, title_key, description_key, image_url,
        min_players, max_players, duration_minutes,
        difficulty, rating, is_available, price, category_id,
        category:game_categori ( id, name )
      `,
      )
      .eq("is_available", true);

    if (search) query = query.ilike(`title_key->>${lang}`, `%${search}%`);
    if (selectedCategories.length > 0)
      query = query.in("category_id", selectedCategories);
    if (selectedPlayers.length > 0) {
      // для каждого выбранного числа игроков условие: min<=n AND max>=n
      query = query.or(
        selectedPlayers
          .map((n) => `(min_players.lte.${n},max_players.gte.${n})`)
          .join(","),
      );
    }

    const { data: gamesData, error: gamesErr } = await query;
    if (gamesErr) console.error(gamesErr);

    // --- категории ---
    const { data: categoriesData, error: catErr } = await supabase
      .from("game_categori")
      .select("*");
    if (catErr) console.error(catErr);

    // --- подсчёт игр по категориям ---
    const { data: rawCounts, error: cntErr } = await supabase
      .from("games")
      .select("category_id")
      .eq("is_available", true);
    if (cntErr) console.error(cntErr);

    // --- сформировать состояние ---
    if (gamesData) {
      setGames(gamesData as GameWithCategory[]);

      // опции игроков (уникальные значения из min/max)
      const uniquePlayers = Array.from(
        new Set(
          (gamesData as GameWithCategory[]).flatMap((g) => [
            g.min_players,
            g.max_players,
          ]),
        ),
      ).sort((a, b) => a - b);
      setPlayerOptions(uniquePlayers);
    }

    if (categoriesData) setCategories(categoriesData as Category[]);

    if (rawCounts) {
      const map: Record<number, number> = {};
      (rawCounts as { category_id: number | null }[]).forEach((r) => {
        if (typeof r.category_id === "number") {
          map[r.category_id] = (map[r.category_id] || 0) + 1;
        }
      });
      setCounts(map);
    }

    setLoading(false);
  };

  const toggleCategory = (id: number) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const togglePlayer = (num: number) =>
    setSelectedPlayers((prev) =>
      prev.includes(num) ? prev.filter((p) => p !== num) : [...prev, num],
    );

  // мемо названия категории для карточек (id -> title)
  const categoryTitleById = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => {
      const t = (c as any).name?.[lang] || (c as any).name?.en || "";
      if (c.id) map.set(c.id, t);
    });
    return map;
  }, [categories, lang]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8">
      <FilterSidebar
        search={search}
        setSearch={setSearch}
        categories={categories}
        counts={counts}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        playerOptions={playerOptions}
        selectedPlayers={selectedPlayers}
        togglePlayer={togglePlayer}
        lang={lang}
      />

      <main className="flex-1">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : games.length === 0 ? (
          <p className="text-gray-500">No games found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameItem
                key={game.id}
                title={game.title_key[lang] || game.title_key["en"]}
                description={
                  game.description_key[lang] || game.description_key["en"]
                }
                img={game.image_url}
                players={`${game.min_players}-${game.max_players}`}
                time={`${game.duration_minutes} мин`}
                rating={game.rating}
                difficulty={game.difficulty}
                available={game.is_available}
                // если пришла связанная категория — берём её,
                // иначе подставляем из справочника по id
                category={
                  game.category?.name?.[lang] ||
                  game.category?.name?.en ||
                  (game.category_id
                    ? categoryTitleById.get(game.category_id) || ""
                    : "")
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
