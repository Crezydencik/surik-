"use client";

import { useState, useEffect } from "react";
import { Dice6, X, Trash, ImagePlus } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { toast } from "sonner";
import { Category, Game, Lang, MultiLangField } from "../../../lib/interfase";

export default function EditGameModal({
  game,
  onClose,
  onUpdate,
}: {
  game: Game;
  onClose: () => void;
  onUpdate: (updated: Game) => void;
}) {
  const supabase = createClientComponentClient();

  const [activeLang, setActiveLang] = useState<Lang>("ru");
  const [title, setTitle] = useState<MultiLangField>(game?.title_key || {});
  const [description, setDescription] = useState<MultiLangField>(
    game?.description_key || {},
  );
  const [minPlayers, setMinPlayers] = useState<number>(game.min_players ?? 0);
  const [maxPlayers, setMaxPlayers] = useState<number>(game.max_players ?? 0);
  const [durationMinutes, setDurationMinutes] = useState<number>(
    game.duration_minutes ?? 0,
  );
  const [difficulty, setDifficulty] = useState<string>(game.difficulty ?? "");
  const [rating, setRating] = useState<number | null>(game.rating ?? null);
  const [price, setPrice] = useState<number | null>(game.price ?? null);
  const [imageUrl, setImageUrl] = useState<string>(game.image_url ?? "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    game.category_id ?? null,
  );

  // загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("game_categori")
        .select("id, name");
      if (error) {
        toast.error("Ошибка загрузки категорий: " + error.message);
      } else {
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, []);

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const baseName =
      title[activeLang]
        ?.toLowerCase()
        .replace(/[^a-z0-9а-яё\s_-]/gi, "")
        .replace(/\s+/g, "-") || "image";

    let fileName = `${baseName}.${ext}`;
    let index = 2;
    let { data: existing } = await supabase.storage
      .from("games-covers")
      .list("", { search: fileName });

    while (existing?.some((f) => f.name === fileName)) {
      fileName = `${baseName}-${index}.${ext}`;
      index++;
      const check = await supabase.storage
        .from("games-covers")
        .list("", { search: fileName });
      existing = check.data;
    }

    const { error } = await supabase.storage
      .from("games-covers")
      .upload(fileName, file);

    if (error) {
      toast.error(`Upload error: ${error.message}`);
    } else {
      const url = supabase.storage.from("games-covers").getPublicUrl(fileName)
        .data.publicUrl;
      setImageUrl(url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removeImage = () => {
    setImageUrl("");
  };

  const handleSave = async () => {
    const updatedGame = {
      title_key: title,
      description_key: description,
      min_players: minPlayers,
      max_players: maxPlayers,
      duration_minutes: durationMinutes,
      difficulty,
      rating,
      price,
      image_url: imageUrl,
      category_id: selectedCategoryId || null,
    };

    const { error } = await supabase
      .from("games")
      .update(updatedGame)
      .eq("id", game.id);

    if (error) {
      toast.error("Ошибка при сохранении: " + error.message);
    } else {
      toast.success("Изменения сохранены");
      onUpdate({ ...game, ...updatedGame });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className="w-full max-w-3xl mx-auto bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Редактирование игры</h2>
          <Dice6 size={28} />
        </div>

        <div className="flex gap-2 mb-6">
          {(["ru", "en", "lv"] as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                activeLang === lang
                  ? "bg-white text-black border-white"
                  : "bg-slate-800 text-gray-400 border-slate-700"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Название */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Название ({activeLang})
          </label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            value={title[activeLang] || ""}
            onChange={(e) =>
              setTitle((prev) => ({ ...prev, [activeLang]: e.target.value }))
            }
          />
        </div>

        {/* Описание */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Описание ({activeLang})
          </label>
          <textarea
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            value={description[activeLang] || ""}
            onChange={(e) =>
              setDescription((prev) => ({
                ...prev,
                [activeLang]: e.target.value,
              }))
            }
          />
        </div>

        {/* Категория */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Категория</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            value={selectedCategoryId ?? ""}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          >
            <option value="">-- выберите категорию --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name[activeLang] || cat.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Числовые поля */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={minPlayers}
            onChange={(e) => setMinPlayers(+e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Min Players"
          />
          <input
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(+e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Max Players"
          />
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(+e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Duration (min)"
          />
          <input
            type="text"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Difficulty"
          />
          <input
            type="number"
            step="0.1"
            value={rating ?? ""}
            onChange={(e) => setRating(+e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Rating"
          />
          <input
            type="number"
            step="0.01"
            value={price ?? ""}
            onChange={(e) => setPrice(+e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded"
            placeholder="Price"
          />
        </div>

        {/* Картинка */}
        <div className="mt-6 border-2 border-dashed border-slate-600 rounded-xl p-4 text-center">
          {imageUrl ? (
            <div className="relative w-full max-w-xs mx-auto">
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                width={300}
                height={300}
                className="rounded-lg mx-auto"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-90"
              >
                <Trash size={16} />
              </button>
            </div>
          ) : (
            <label className="block text-center text-gray-400 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center">
                <ImagePlus size={32} />
                <p className="mt-2 text-sm">Кликни или перетащи изображение</p>
              </div>
            </label>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ❌ Отмена
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            💾 Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
