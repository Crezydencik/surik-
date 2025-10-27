"use client";

import {
  Search as SearchIcon,
  X,
  Folder,
  Users2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { Category, Lang } from "@/lib/interfase";
import { useTranslation } from "react-i18next";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  categories: ReadonlyArray<Category>;
  counts: Record<number, number>;
  selectedCategories: number[];
  toggleCategory: (id: number) => void;

  playerOptions: number[];
  selectedPlayers: number[];
  togglePlayer: (num: number) => void;

  lang: Lang;
  className?: string;
};

export default function FilterSidebar({
  search,
  setSearch,
  categories,
  counts,
  selectedCategories,
  toggleCategory,
  playerOptions,
  selectedPlayers,
  togglePlayer,
  lang,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const [openCat, setOpenCat] = useState(true);
  const [openPlayers, setOpenPlayers] = useState(true);

  const hasAnyFilters =
    selectedCategories.length > 0 || selectedPlayers.length > 0 || !!search;

  const selectedChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void; key: string }[] = [];

    // категории
    selectedCategories.forEach((id) => {
      const c = categories.find((x) => x.id === id);
      const label = c ? c.name[lang] ?? c.name.en : t("filters.notitle");
      chips.push({
        key: `c-${id}`,
        label,
        onRemove: () => toggleCategory(id),
      });
    });

    // игроки
    selectedPlayers.forEach((n) =>
      chips.push({
        key: `p-${n}`,
        label: t("filters.playersCount", { count: n }),
        onRemove: () => togglePlayer(n),
      }),
    );

    return chips;
  }, [
    categories,
    lang,
    selectedCategories,
    selectedPlayers,
    t,
    toggleCategory,
    togglePlayer,
  ]);

  const clearAll = () => {
    if (search) setSearch("");
    // снимаем все выбранные чекбоксы
    selectedCategories.forEach((id) => toggleCategory(id));
    selectedPlayers.forEach((n) => togglePlayer(n));
  };

  return (
    <aside
      className={`md:sticky md:top-6 w-full md:w-72 bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm ${className}`}
    >
      {/* Заголовок + Clear */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {t("filters.title")}
        </h3>
        {hasAnyFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>

      {/* Поиск */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("filters.search")}
          className="w-full pl-9 pr-9 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60
                     text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2
                     focus:ring-indigo-500/60 focus:border-indigo-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Чипы выбранных фильтров */}
      {selectedChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedChips.map((chip) => (
            <span
              key={chip.key}
              className="group inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full
                         bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 border
                         border-indigo-200/60 dark:border-indigo-800"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="p-0.5 rounded-full hover:bg-indigo-200/60 dark:hover:bg-indigo-800/60"
                aria-label={`Remove ${chip.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Категории */}
      <SectionHeader
        icon={<Folder className="h-4 w-4 text-amber-500" />}
        title={t("filters.categories")}
        open={openCat}
        onToggle={() => setOpenCat((v) => !v)}
      />
      {openCat && (
        <div className="mb-4 grid grid-cols-1 gap-2">
          {categories.map((c) => {
            const id = c.id;
            const label = c.name[lang] ?? c.name.en;
            const checked = selectedCategories.includes(id);
            const qty = counts[id] ?? 0;

            return (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                className={`group w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm
                 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                 ${
                   checked
                     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                     : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                 }`}
                aria-pressed={checked}
              >
                <span className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <span
                    className={`h-4 w-4 rounded-md border
                      ${
                        checked
                          ? "bg-indigo-600 border-indigo-600"
                          : "bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600"
                      }`}
                  />
                  {label}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border
                  ${
                    checked
                      ? "border-indigo-300 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {qty}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Игроки */}
      <SectionHeader
        icon={<Users2 className="h-4 w-4 text-violet-600" />}
        title={t("filters.players")}
        open={openPlayers}
        onToggle={() => setOpenPlayers((v) => !v)}
      />
      {openPlayers && (
        <div className="grid grid-cols-2 gap-2">
          {playerOptions.map((n) => {
            const checked = selectedPlayers.includes(n);
            return (
              <button
                key={n}
                onClick={() => togglePlayer(n)}
                className={`w-full rounded-xl border px-3 py-2 text-sm transition
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                  ${
                    checked
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-zinc-900 dark:text-zinc-100"
                      : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-100"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-md border
                      ${
                        checked
                          ? "bg-indigo-600 border-indigo-600"
                          : "bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600"
                      }`}
                  />
                  {t("filters.playersCount", { count: n })}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}

/** Заголовок секции со сворачиванием */
function SectionHeader({
  icon,
  title,
  open,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full mb-2 flex items-center justify-between text-sm font-medium text-zinc-900 dark:text-zinc-100"
      aria-expanded={open}
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {title}
      </span>
      {open ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}
