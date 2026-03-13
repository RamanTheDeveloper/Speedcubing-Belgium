// ─── Cookie utilities ─────────────────────────────────────────────────────────

const LANG_COOKIE = "preferred_lang";
const CONSENT_COOKIE = "cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

// ─── Language cookie ──────────────────────────────────────────────────────────

export function getLangCookie(): string | null {
  return getCookie(LANG_COOKIE);
}

export function setLangCookie(lang: string) {
  setCookie(LANG_COOKIE, lang);
}

// ─── Consent cookie ───────────────────────────────────────────────────────────

export type ConsentState = "accepted" | "declined" | null;

export function getConsentCookie(): ConsentState {
  return getCookie(CONSENT_COOKIE) as ConsentState;
}

export function setConsentCookie(state: "accepted" | "declined") {
  // If declined, only store the consent choice itself (minimal cookie)
  // The language preference cookie is set separately only when accepted
  setCookie(CONSENT_COOKIE, state);
}