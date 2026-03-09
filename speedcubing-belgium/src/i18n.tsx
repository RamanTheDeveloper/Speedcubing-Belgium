import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import en from "./locales/en.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = "en" | "fr" | "nl";

// Derive the shape from the English file — all locale files must match this shape.
export type Translations = typeof en;

// ─── Locale loader ────────────────────────────────────────────────────────────

const localeModules: Record<Locale, () => Promise<Translations>> = {
  en:  () => import("./locales/en.json").then((m) => m.default as Translations),
  fr:  () => import("./locales/fr.json").then((m) => m.default as unknown as Translations),
  nl:  () => import("./locales/nl.json").then((m) => m.default as unknown as Translations),
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  changeLocale: (locale: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [t, setT] = useState<Translations>(en);

  const changeLocale = useCallback(async (next: Locale) => {
    const translations = await localeModules[next]();
    setT(translations);
    setLocale(next);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside <I18nProvider>");
  return ctx;
}