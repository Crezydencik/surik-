"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  Languages,
  FileText,
  LogOut,
  Handshake,
} from "lucide-react";
import { createClient } from "../../../lib/supabase";
import { Button } from "../../../components/ux/button";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/games",
    label: "Games",
    icon: <Gamepad2 className="w-5 h-5" />,
  },
  {
    href: "/admin/partners",
    label: "Partners",
    icon: <Handshake  className="w-5 h-5" />,
  },
  {
    href: "/admin/content",
    label: "Content",
    icon: <FileText className="w-5 h-5" />,
  },
  { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  {
    href: "/admin/translations",
    label: "Translations",
    icon: <Languages className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const supabase = createClient();
  return (
    <aside className="w-64 bg-[#0e0e1a] border-r border-gray-800 flex flex-col justify-between">
      <div className="p-6 space-y-4">
        <div className="text-xl font-bold text-purple-500">Meeple Cave</div>
        <nav className="space-y-2">
          {links.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm"
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-6 text-sm text-gray-500 border-t border-gray-800">
        Admin Panel
        <Button
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          <LogOut />
        </Button>
      </div>
    </aside>
  );
}
