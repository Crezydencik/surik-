"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { X, ImagePlus, Trash } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Partner {
  id: string;
  name: string; // ⚡ теперь просто строка
  description_key: Record<string, string>;
  logo_url: string;
  website_url: string;
  is_active: boolean;
}

export default function PartnerModal({
  onClose,
  onSave,
  partner,
}: {
  onClose: () => void;
  onSave: () => void;
  partner?: Partner;
}) {
  const supabase = createClientComponentClient();

  const [name, setName] = useState<string>(partner?.name || "");
  const [description] = useState<Record<string, string>>(
    partner?.description_key || { ru: "", en: "", lv: "" },
  );
  const [logoUrl, setLogoUrl] = useState<string>(partner?.logo_url || "");
  const [websiteUrl, setWebsiteUrl] = useState<string>(
    partner?.website_url || "",
  );
  const [isActive, setIsActive] = useState<boolean>(partner?.is_active ?? true);

  const [saving, setSaving] = useState(false);

  // === Загрузка файла ===
  const handleFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const fileName = `partner-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("partners-logos")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast.error("Ошибка загрузки: " + error.message);
    } else {
      const { data } = supabase.storage
        .from("partners-logos")
        .getPublicUrl(fileName);

      setLogoUrl(data.publicUrl);
      toast.success("Логотип загружен ✅");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      name,
      description_key: description,
      logo_url: logoUrl,
      website_url: websiteUrl,
      is_active: isActive,
    };

    let error;

    if (partner) {
      ({ error } = await supabase
        .from("partners")
        .update(payload)
        .eq("id", partner.id));
    } else {
      ({ error } = await supabase.from("partners").insert([payload]));
    }

    if (error) {
      toast.error("Ошибка при сохранении: " + error.message);
    } else {
      toast.success(partner ? "Партнёр обновлён" : "Партнёр добавлен");
      onSave();
      onClose();
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141824] text-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {partner ? "Редактировать партнёра" : "Добавить партнёра"}
        </h2>

        {/* Название (одно поле, без языков) */}
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-gray-800 rounded border border-gray-700"
        />

        {/* Переключатель языков для описания
        <div className="flex gap-2 mb-4">
          {(["ru", "en", "lv"] as Language[]).map((lng) => (
            <button
              key={lng}
              onClick={() => setActiveLang(lng)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeLang === lng
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Описание */}
        {/* <textarea
          placeholder={`Описание (${activeLang})`}
          value={description[activeLang] || ""}
          onChange={(e) =>
            setDescription((prev) => ({
              ...prev,
              [activeLang]: e.target.value,
            }))
          }
          className="w-full mb-3 px-3 py-2 bg-gray-800 rounded border border-gray-700"
        /> */}

        {/* Website */}
        <input
          type="url"
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="w-full mb-3 px-3 py-2 bg-gray-800 rounded border border-gray-700"
        />

        {/* Логотип */}
        <div className="mb-3">
          {logoUrl ? (
            <div className="relative w-32 h-32 mb-2">
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-contain rounded bg-white"
              />
              <button
                onClick={() => setLogoUrl("")}
                className="absolute top-1 right-1 bg-black/70 p-1 rounded-full"
              >
                <Trash size={14} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white">
              <ImagePlus size={20} /> Загрузить логотип
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          )}
        </div>
        {/* Активен */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Активен
        </label>

        {/* Кнопки */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Сохраняю..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
