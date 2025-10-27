"use client";

import { Bell, Settings, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { AdminLang, useAdminLanguage } from "../../../hook/useAdminLanguage";

const getTitleByPath = (pathname: string) => {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/games")) return "Games";
  if (pathname.startsWith("/admin/users")) return "Users";
  if (pathname.startsWith("/admin/content")) return "Content";
  if (pathname.startsWith("/admin/translations")) return "Translations";
  return "Admin";
};

export default function Topbar() {
  const pathname = usePathname();
  const title = getTitleByPath(pathname);

  const { language, changeLanguage } = useAdminLanguage();

  return (
    <div className="h-16 bg-[#0e0e1a] border-b border-gray-800 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        {/* ЯЗЫКОВЫЕ КНОПКИ */}
        <div className="flex gap-1">
          {["lv", "ru", "en"].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang as AdminLang)}
              className={`text-sm px-2 py-1 rounded ${
                language === lang
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Поиск и иконки */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-black text-white text-sm px-3 py-1 rounded-md border border-gray-700 focus:outline-none"
          />
          <Search className="absolute right-2 top-1.5 w-4 h-4 text-gray-400" />
        </div>
        <Bell className="w-5 h-5 text-gray-400" />
        <Settings className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
