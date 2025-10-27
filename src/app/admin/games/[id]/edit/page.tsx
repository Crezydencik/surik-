"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGameById, updateGameById } from "../../lib/queries";
import { toast } from "sonner";
import type { Game } from "../../../../../lib/interfase";

// Языки
type Lang = "ru" | "en" | "lv";

export default function EditGamePage() {
  const { id } = useParams<{ id: string }>(); // id теперь строго string
  const router = useRouter();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getGameById(id)
        .then(setGame)
        .catch(() => toast.error("Ошибка загрузки данных"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Универсальный апдейтер (без any)
  const updateField = <K extends keyof Game>(key: K, value: Game[K]) => {
    setGame((prev) => (prev ? ({ ...prev, [key]: value } as Game) : prev));
  };

  // Апдейтер для мультиязычных полей
  const updateML = (
    key: "title_key" | "description_key",
    lang: Lang,
    val: string,
  ) => {
    if (!game) return;
    updateField(key, { ...(game[key] ?? {}), [lang]: val });
  };

  const handleSubmit = async () => {
    if (!game) return;
    try {
      await updateGameById(game.id, game);
      toast.success("Игра обновлена");
      router.push("/admin/games");
    } catch {
      toast.error("Ошибка при сохранении");
    }
  };

  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!game) return <div className="p-6 text-red-500">Игра не найдена</div>;

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold mb-4">Редактирование игры</h1>

      {/* Название RU */}
      <input
        type="text"
        value={game.title_key?.ru ?? ""}
        onChange={(e) => updateML("title_key", "ru", e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Название (RU)"
      />

      {/* Описание RU */}
      <textarea
        value={game.description_key?.ru ?? ""}
        onChange={(e) => updateML("description_key", "ru", e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Описание (RU)"
      />

      {/* Мин игроков */}
      <input
        type="number"
        value={game.min_players}
        onChange={(e) => updateField("min_players", Number(e.target.value))}
        className="w-full p-2 border rounded"
        placeholder="Мин. игроков"
      />

      {/* Макс игроков */}
      <input
        type="number"
        value={game.max_players}
        onChange={(e) => updateField("max_players", Number(e.target.value))}
        className="w-full p-2 border rounded"
        placeholder="Макс. игроков"
      />

      {/* Длительность */}
      <input
        type="number"
        value={game.duration_minutes}
        onChange={(e) =>
          updateField("duration_minutes", Number(e.target.value))
        }
        className="w-full p-2 border rounded"
        placeholder="Длительность (мин)"
      />

      {/* Сложность */}
      <input
        type="text"
        value={game.difficulty}
        onChange={(e) => updateField("difficulty", e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Сложность"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        💾 Сохранить
      </button>
    </div>
  );
}
