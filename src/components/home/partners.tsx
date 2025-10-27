"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
}

export default function PartnersRow() {
  const supabase = createClientComponentClient();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true);

      if (!error && data) setPartners(data);
      setLoading(false);
    };

    fetchPartners();
  }, [supabase]);

  if (loading) {
    return <p className="text-gray-400 text-center">Загрузка партнёров...</p>;
  }

  if (!partners || partners.length === 0) {
    return <p className="text-gray-400 text-center">Партнёры пока не добавлены</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {partner.logo_url && (
            <img
              src={partner.logo_url}
              alt={partner.name}
              className="max-h-28 max-w-full object-contain"
            />
          )}
        </a>
      ))}
    </div>
  );
}
