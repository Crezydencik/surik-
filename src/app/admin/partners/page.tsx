"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import PartnerCard from "./PartnerCard";
import PartnerModal from "./PartnerModal";
import { Plus } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description_key: Record<string, string>;
  is_active: boolean;
}

export default function PartnersPage() {
  const supabase = createClientComponentClient();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) setPartners(data as Partner[]);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Партнёры</h1>
        <button
          onClick={() => {
            setSelectedPartner(null);
            setModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Добавить партнёра
        </button>
      </div>

      {/* Список */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            onEdit={() => {
              setSelectedPartner(partner);
              setModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Модалка */}
      {modalOpen && (
        <PartnerModal
          partner={selectedPartner || undefined}
          onClose={() => setModalOpen(false)}
          onSave={() => {
            fetchPartners();
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
