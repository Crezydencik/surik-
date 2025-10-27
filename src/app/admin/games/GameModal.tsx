"use client";

import { useState, useEffect } from "react";
import { Dice6, X, Trash, ImagePlus } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { toast } from "sonner";
import { Category, Game, Lang, MultiLangField } from "../../../lib/interfase";
export type GameModalProps = {
  onClose: () => void;
  onCreate: (game: Game) => void; // ← важное
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AddGameModal({ onClose, onCreate }: GameModalProps) {
  const supabase = createClientComponentClient();

  const [activeLang, setActiveLang] = useState<Lang>("en");
  const [title, setTitle] = useState<MultiLangField>({
    en: "",
    ru: "",
    lv: "",
  });
  const [description, setDescription] = useState<MultiLangField>({
    en: "",
    ru: "",
    lv: "",
  });
  const [minPlayers, setMinPlayers] = useState<number>(1);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // категории
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("game_categori")
        .select("id, name");
      if (error) {
        toast.error("Ошибка загрузки категорий");
      } else {
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, []);

  // === Загрузка файла с уникальным именем ===
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
      .list("", {
        search: fileName,
      });

    while (existing?.some((f) => f.name === fileName)) {
      fileName = `${baseName}-${index}.${ext}`;
      index++;
      const check = await supabase.storage.from("games-covers").list("", {
        search: fileName,
      });
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

  const handleSubmit = async () => {
    if (!selectedCategoryId) {
      toast.error("Выберите категорию");
      return;
    }

    const newGame = {
      title_key: title,
      description_key: description,
      min_players: minPlayers,
      max_players: maxPlayers,
      duration_minutes: durationMinutes,
      difficulty,
      rating,
      price,
      image_url: imageUrl,
      category_id: selectedCategoryId, // <-- категория
    };

    const { error } = await supabase.from("games").insert(newGame);

    if (error) {
      toast.error("❌ Ошибка при сохранении игры: " + error.message);

      if (imageUrl) {
        const filePath = imageUrl.split("/").pop();
        await supabase.storage
          .from("games-covers")
          .remove([filePath as string]);
        setImageUrl("");
        toast.info("🗑️ Картинка удалена из хранилища");
      }
    } else {
      toast.success("✅ Игра успешно добавлена!");
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
          <h2 className="text-2xl font-semibold">Добавить игру</h2>
          <Dice6 size={28} />
        </div>

        {/* Переключатель языков */}
        <div className="flex gap-2 mb-6">
          {(["en", "ru", "lv"] as Lang[]).map((lang) => (
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

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Название ({activeLang})
          </label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={title[activeLang]}
            onChange={(e) =>
              setTitle((prev) => ({ ...prev, [activeLang]: e.target.value }))
            }
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Описание ({activeLang})
          </label>
          <textarea
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={description[activeLang]}
            onChange={(e) =>
              setDescription((prev) => ({
                ...prev,
                [activeLang]: e.target.value,
              }))
            }
          />
        </div>

        {/* Категория */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Категория</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none"
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

        {/* Grid числовых полей */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300">Min Players</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={minPlayers}
              onChange={(e) => setMinPlayers(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Max Players</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">
              Duration (min)
            </label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Difficulty</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Rating</label>
            <input
              type="number"
              step="0.1"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={rating ?? ""}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
              value={price ?? ""}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Загрузка картинки */}
        <div className="mt-6 border-2 border-dashed border-slate-600 rounded-xl p-4 relative text-center">
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
                <p className="mt-2 text-sm">
                  Перетащите изображение или кликните, чтобы выбрать
                </p>
              </div>
            </label>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
        >
          💾 Сохранить игру
        </button>
      </div>
    </div>
  );
}
