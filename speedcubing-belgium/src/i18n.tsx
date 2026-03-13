import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import en from "./locales/en.json";
import {
  getLangCookie,
  setLangCookie,
} from "./utils/Cookies";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = "en" | "fr" | "nl";

// Derive the shape from the English file — all locale files must match this shape.
export type Translations = typeof en;

// ─── Locale loader ────────────────────────────────────────────────────────────

const localeModules: Record<Locale, () => Promise<Translations>> = {
  en: () => import("./locales/en.json").then((m) => m.default as Translations),
  fr: () => import("./locales/fr.json").then((m) => m.default as unknown as Translations),
  nl: () => import("./locales/nl.json").then((m) => m.default as unknown as Translations),
};

const VALID_LOCALES: Locale[] = ["en", "fr", "nl"];

function isValidLocale(value: string | null): value is Locale {
  return VALID_LOCALES.includes(value as Locale);
}

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
  // Determine initial locale: cookie (if consent given) → browser hint → "en"
  function getInitialLocale(): Locale {
    // Language cookie is always set (functional), so read it regardless of analytics consent
    const saved = getLangCookie();
    if (isValidLocale(saved)) return saved;
    // Fallback: respect browser language preference
    const browserLang = navigator.language.slice(0, 2);
    if (isValidLocale(browserLang)) return browserLang;
    return "en";
  }

  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [t, setT] = useState<Translations>(en);

  // Load non-English translations if the initial locale isn't English
  useEffect(() => {
    if (locale !== "en") {
      localeModules[locale]().then(setT);
    }
  }, []); // only on mount

  const changeLocale = useCallback(async (next: Locale) => {
    const translations = await localeModules[next]();
    setT(translations);
    setLocale(next);

    // Language cookie is functional — always persist it
    setLangCookie(next);
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