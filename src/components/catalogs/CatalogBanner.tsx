"use client";

import { useTranslation } from "react-i18next";
import { Filter, RefreshCw } from "lucide-react";

export default function CatalogBanner({
  total,
  activeFilters,
  onReset,
  scrollToFiltersId = "filters",
  bg = "https://scontent.frix4-1.fna.fbcdn.net/v/t39.30808-6/552724735_122144300816843485_1778717522351932337_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=75d36f&_nc_ohc=352ip2oUFWQQ7kNvwEGU6lJ&_nc_oc=Adlr8i9X39lKmSUdmup1Wfx6RIw3gIGwLC_nbUEAaX6rmIxu3gbjrVHBmRtc2Z5i0L0&_nc_zt=23&_nc_ht=scontent.frix4-1.fna&_nc_gid=hyup-aNq-aeDV_w-ZCtTGg&oh=00_AfjHDj5ap-_Qu62wnCLs5EkrPsFLQB9Bywxh511FZTi8zA&oe=690EE7E1", // положи картинку в /public/img
}: {
  total: number;
  activeFilters: number;
  onReset: () => void;
  scrollToFiltersId?: string;
  bg?: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e17]">
      {/* bg image */}
      <div className="absolute inset-0">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e17] via-[#0e0e17]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.25),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.25),transparent_40%)]" />
      </div>

      {/* top accent */}
      <div className="relative h-1 w-full bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-400" />

      <div className="relative z-10 flex flex-col gap-10 p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            {t("catalog.hero.badge", "Каталог настолок")}
          </span>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            {t("catalog.hero.found", "Найдено")}: {total}
          </span>
          {activeFilters > 0 && (
            <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-medium text-fuchsia-300">
              {t("catalog.hero.filters", "Фильтры")}: {activeFilters}
            </span>
          )}
        </div>

        <h1 className="max-w-3xl text-2xl font-bold text-white sm:text-4xl">
          {t("catalog.hero.title", "Выбирайте игру под ваше настроение")}
        </h1>
        {/* <p className="max-w-3xl text-white/70">
          {t(
            "catalog.hero.subtitle",
            "Фильтруйте по категориям, игрокам и длительности. Всё на одном экране.",
          )}
        </p> */}

        {/* <div className="mt-2 flex flex-wrap gap-3">
          <a
            href={`#${scrollToFiltersId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            <Filter className="h-4 w-4" />
            {t("catalog.hero.toFilters", "К фильтрам")}
          </a>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500"
          >
            <RefreshCw className="h-4 w-4" />
            {t("catalog.hero.reset", "Сбросить фильтры")}
          </button>
        </div> */}
      </div>
    </section>
  );
}
