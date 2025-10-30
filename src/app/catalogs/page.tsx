"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "react-i18next";
import FilterSidebar from "../../components/catalogs/CategoryFilter";
import GameItem from "../../components/ux/gameitems";
import type {
  Category,
  Game,
  GameWithCategory,
  Lang,
} from "../../lib/interfase";

/* ===================== Типы (вариант A) ===================== */

type CategoryLite = Pick<Category, "id" | "name">;

/** Что реально возвращает select по играм */
type RawGame = Game & {
  category: CategoryLite[] | null; // приходит массив (или null), берём первый
};

/** Что храним и рендерим на странице */
type ViewGame = Omit<GameWithCategory, "category"> & {
  category: CategoryLite | null;
};

/* ===================== Компонент ===================== */

export default function CatalogPage() {
  const supabase = createClientComponentClient();
  const { i18n } = useTranslation();
  const lang: Lang = (i18n.language?.slice(0, 2) as Lang) || "en";

  const [games, setGames] = useState<ViewGame[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [playerOptions, setPlayerOptions] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategories, selectedPlayers, lang]);

  const fetchData = async () => {
    setLoading(true);

    // === ИГРЫ + связанная легкая категория ===
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

    // Поиск по JSONB без any
    if (search.trim()) {
      const col = `title_key->>${lang}`;
      query = query.filter(col, "ilike", `%${search}%`);
    }

    if (selectedCategories.length > 0) {
      query = query.in("category_id", selectedCategories);
    }

    if (selectedPlayers.length > 0) {
      // хотя бы одно n внутри [min, max]
      const ors = selectedPlayers
        .map((n) => `(min_players.lte.${n},max_players.gte.${n})`)
        .join(",");
      query = query.or(ors);
    }

    // В конце — .returns
    const { data: gamesData, error: gamesErr } = await query.returns<
      RawGame[]
    >();
    if (gamesErr) console.error(gamesErr);

    // === КАТЕГОРИИ ===
    const { data: categoriesData, error: catErr } = await supabase
      .from("game_categori")
      .select("*")
      .returns<Category[]>();
    if (catErr) console.error(catErr);

    // === Подсчёт игр по категориям ===
    const { data: rawCounts, error: cntErr } = await supabase
      .from("games")
      .select("category_id")
      .eq("is_available", true)
      .returns<Array<{ category_id: number | null }>>();
    if (cntErr) console.error(cntErr);

    // === Установка состояния ===
    if (gamesData) {
      const normalized: ViewGame[] = gamesData.map((g) => ({
        ...g,
        category: g.category?.[0] ?? null, // легкая категория
      }));
      setGames(normalized);

      const uniquePlayers = Array.from(
        new Set(normalized.flatMap((g) => [g.min_players, g.max_players])),
      ).sort((a, b) => a - b);
      setPlayerOptions(uniquePlayers);
    }

    if (categoriesData) setCategories(categoriesData);

    if (rawCounts) {
      const map: Record<number, number> = {};
      rawCounts.forEach((r) => {
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

  // id категории -> локализованное название
  const categoryTitleById = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => {
      const t = c.name?.[lang] ?? c.name?.en ?? "";
      map.set(c.id, t);
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
            {games.map((g) => (
              <GameItem
                key={g.id}
                title={g.title_key[lang] || g.title_key.en}
                description={g.description_key[lang] || g.description_key.en}
                img={g.image_url}
                players={`${g.min_players}-${g.max_players}`}
                time={g.duration_minutes ? `${g.duration_minutes} мин` : ""}
                rating={g.rating ?? undefined} // сделай проп optional в GameItem
                difficulty={g.difficulty ?? undefined} // и этот тоже
                available={g.is_available}
                category={
                  g.category?.name?.[lang] ||
                  g.category?.name?.en ||
                  (g.category_id
                    ? categoryTitleById.get(g.category_id) || ""
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
