import { useEffect, useState } from "react";

export type AdminLang = "lv" | "ru" | "en";

export const useAdminLanguage = () => {
  const [language, setLanguage] = useState<AdminLang>("lv");

  useEffect(() => {
    const stored = localStorage.getItem("adminLang") as AdminLang | null;
    if (stored && ["lv", "ru", "en"].includes(stored)) {
      setLanguage(stored);
    }
  }, []);

  const changeLanguage = (lang: AdminLang) => {
    setLanguage(lang);
    localStorage.setItem("adminLang", lang);
  };

  return { language, changeLanguage };
};
