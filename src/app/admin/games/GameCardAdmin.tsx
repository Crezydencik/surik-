import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { GameCardProps } from "../../../lib/interfase";

export default function GameCard({ game, onDelete, onEdit }: GameCardProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as "en" | "lv" | "ru") || "en";

  const pickLang = (ml?: Record<string, string>) =>
    ml?.[lang] ?? ml?.en ?? ml?.lv ?? ml?.ru ?? "";

  const title = pickLang(game.title_key) || "Без названия";
  const description = pickLang(game.description_key);

  // безопасно получаем имя категории (если она вообще есть)
  const categoryName =
    ("category" in game &&
      game.category &&
      (game.category.name?.[lang] ?? game.category.name?.en ?? "")) ||
    "—";

  const ratingText =
    typeof game.rating === "number" && Number.isFinite(game.rating)
      ? game.rating.toFixed(1)
      : "—";

  const durationText =
    typeof game.duration_minutes === "number" && game.duration_minutes > 0
      ? `${game.duration_minutes} мин`
      : "—";

  return (
    <div className="bg-[#111118] border border-[#22222c] rounded-xl overflow-hidden shadow-md">
      {/* Картинка */}
      <div className="relative h-[200px] w-full">
        <Image
          src={game.image_url || "/placeholder.jpg"}
          alt={title || "Game Cover"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {game.difficulty && (
          <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-900 text-xs px-2 py-1 rounded">
            {game.difficulty}
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>

        {/* Инфо */}
        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mb-2">
          <div className="flex items-center gap-1">
            👥 {game.min_players}–{game.max_players}
          </div>
          <div className="flex items-center gap-1">⏱ {durationText}</div>
          <div className="flex items-center gap-1">🏆 {ratingText}</div>
          <div className="flex items-center gap-1">🏷 {categoryName}</div>
        </div>

        {/* Описание */}
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Нижняя панель */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              game.is_available
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {game.is_available ? "Доступна" : "Недоступна"}
          </span>

          <div className="flex gap-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => onEdit?.(game.id)}
              aria-label="Редактировать"
            >
              <Pencil size={18} />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete?.(game.id)}
              aria-label="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
