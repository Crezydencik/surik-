import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import lv from "./locales/lv.json";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    // Проверяем, доступен ли `localStorage`
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      return savedLanguage;
    }
    // Если язык не сохранён, используем язык браузера
    const browserLanguage = navigator.language.split("-")[0];
    const supportedLanguages = ["en", "ru", "lv"];
    return supportedLanguages.includes(browserLanguage)
      ? browserLanguage
      : "en";
  }
  return "en"; // Язык по умолчанию для сервера
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
    lv: {
      translation: lv,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    localStorage.setItem("selectedLanguage", lng);
  });
}

export default i18n;
