"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
}

export default function PartnerCard({
  partner,
  onEdit,
  onDelete,
}: {
  partner: Partner;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-[#1e1e2e] to-[#2a2d3a] border border-[#2f3244] rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-purple-500/20 transition">
      {partner.logo_url && (
        <img
          src={partner.logo_url}
          alt={partner.name}
          className="h-16 object-contain mb-3"
        />
      )}
      <h3 className="text-lg font-bold text-white mb-2">{partner.name}</h3>

      {partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2"
        >
          {partner.website_url}
          <ExternalLink size={14} />
        </a>
      )}

      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          partner.is_active ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {partner.is_active ? "Активен" : "Не активен"}
      </span>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm flex items-center gap-1"
        >
          <Pencil size={14} /> Редактировать
        </button>
        <button
          onClick={() => onDelete?.(partner.id)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
        >
          <Trash2 size={14} /> Удалить
        </button>
      </div>
    </div>
  );
}
