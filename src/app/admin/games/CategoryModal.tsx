// CategoryModal.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Trash2, Edit2, X } from "lucide-react";
import { Category } from "../../../lib/interfase";



export default function CategoryModal({ onClose }: { onClose: () => void }) {
  const supabase = createClientComponentClient();
  const [language, setLanguage] = useState<"en" | "lv" | "ru">("en");
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState({ en: "", lv: "", ru: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Загружаем категории
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("game_categori").select();
      if (error) {
        toast.error("Ошибка загрузки категорий");
      } else {
        setCategories(data || []);
       }
      setLoading(false);
    };
    fetchCategories();
  } , []  );

  // Добавление или обновление
  const handleAddOrUpdate = async () => {
    if (!values.en || !values.lv || !values.ru) {
      toast.error("Заполните все языки");
      return;
    }

    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("game_categori")
        .update({ name: values })
        .eq("id", editingId);
      if (error) toast.error("Ошибка при обновлении");
      else toast.success("Категория обновлена");
    } else {
      const { error } = await supabase
        .from("game_categori")
        .insert([{ name: values }]);
      if (error) toast.error("Ошибка при добавлении");
      else toast.success("Категория добавлена");
    }

    // сбрасываем поля
    setValues({ en: "", lv: "", ru: "" });
    setEditingId(null);

    // обновляем список
    const { data } = await supabase.from("game_categori").select();
    setCategories(data || []);
    setSaving(false);
  };

  // Редактирование
  const handleEdit = (cat: Category) => {
    setValues(cat.name);
    setEditingId(cat.id!);
  };

  // Удаление
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("game_categori").delete().eq("id", id);
    if (error) return toast.error("Ошибка при удалении");
    toast.success("Категория удалена");
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141824] text-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide">📂 Категории</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Language switcher */}
        <div className="flex gap-2 mb-4">
          {(["en", "lv", "ru"] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => setLanguage(lng)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                language === lng
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input field */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder={`Название (${language})`}
            value={values[language]}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [language]: e.target.value }))
            }
            className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700
                       focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <button
            disabled={saving}
            onClick={handleAddOrUpdate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg 
                       font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {editingId ? "💾 Обновить" : "+ Добавить"}
          </button>
        </div>

        {/* Categories list */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="p-3 text-left">EN</th>
                  <th className="p-3 text-left">LV</th>
                  <th className="p-3 text-left">RU</th>
                  <th className="p-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-900/40 transition">
                    <td className="p-3">{cat.name.en}</td>
                    <td className="p-3">{cat.name.lv}</td>
                    <td className="p-3">{cat.name.ru}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        <Edit2 size={16} className="mr-1" /> Редакт.
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id!)}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        <Trash2 size={16} className="mr-1" /> Удалить
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-gray-400">
                      Нет категорий
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
