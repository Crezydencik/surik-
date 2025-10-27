"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import GameModal from "./GameModal";
import EditGameModal from "./GameEditModal";
import CategoryModal from "./CategoryModal"; // 👈 подключаем новую модалку
import { deleteGame, getAllGames } from "./lib/queries";
import { Game } from "../../../lib/interfase";
import GameCard from "./GameCardAdmin";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [openGameModal, setOpenGameModal] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    getAllGames().then(setGames);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      toast.success("Игра удалена успешно");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при удалении игры");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление играми</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenGameModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Добавить игру
          </button>
          <button
            onClick={() => setCategoryOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Добавить категорию
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={handleDelete}
            onEdit={() => {
              setEditId(game.id);
              setSelectedGame(game);
            }}
          />
        ))}
      </div>

      {openGameModal && (
        <GameModal
          onClose={() => setOpenGameModal(false)}
          onCreate={(game) => setGames([game, ...games])}
        />
      )}

      {categoryOpen && <CategoryModal onClose={() => setCategoryOpen(false)} />}

      {editId && selectedGame && (
        <EditGameModal
          game={selectedGame}
          onClose={() => {
            setEditId(null);
            setSelectedGame(null);
          }}
          onUpdate={(updatedGame) => {
            setGames((prev) =>
              prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)),
            );
          }}
        />
      )}
    </div>
  );
}
