"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS } from "@/lib/i18n";

const LangContext = createContext({
  lang: "az",
  setLang: () => {},
  t: TRANSLATIONS.az,
});

export function LangProvider({ children, defaultLang = "az" }) {
  const [lang, setLangState] = useState(defaultLang);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("adda_lang");
    if (stored === "az" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (v) => {
    setLangState(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("adda_lang", v);
      document.documentElement.lang = v;
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
