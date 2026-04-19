import type { Competition } from "../types/Wca";

const WCA_OFFICIAL_BASE = "https://www.worldcubeassociation.org/api/v0";

// Cache lives for 6 hours — WCA data updates at most once a day
const CACHE_KEY = "wca_be_competitions";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// ─── Official WCA API types ───────────────────────────────────────────────────

interface OfficialWCACompetition {
  id: string;
  name: string;
  venue: string;
  city: string;
  country_iso2: string;
  start_date: string;
  end_date: string;
  event_ids: string[];
  competitor_limit: number | null;
  registration_open: string;
  registration_close: string;
  url: string;
  announced_at: string;
}

interface CacheEntry {
  fetchedAt: number;
  data: OfficialWCACompetition[];
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function readCache(): OfficialWCACompetition[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    const isExpired = Date.now() - entry.fetchedAt > CACHE_TTL_MS;
    return isExpired ? null : entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: OfficialWCACompetition[]): void {
  try {
    const entry: CacheEntry = { fetchedAt: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage can be unavailable (e.g. private browsing quota exceeded) — fail silently
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-GB", opts);
  }
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}–${end.toLocaleDateString("en-GB", opts)}`;
  }
  return `${start.toLocaleDateString("en-GB", { month: "long", day: "numeric" })} – ${end.toLocaleDateString("en-GB", opts)}`;
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function enrichCompetition(raw: OfficialWCACompetition): Competition {
  const now = new Date();
  const startDate = new Date(raw.start_date);
  const endDate = new Date(raw.end_date);
  endDate.setHours(23, 59, 59, 999);
  const registrationOpen = new Date(raw.registration_open);
  const registrationClose = new Date(raw.registration_close);

  return {
    id: raw.id,
    name: raw.name,
    date: formatDateRange(startDate, endDate),
    startDate,
    endDate,
    venue: raw.venue,
    city: raw.city,
    events: raw.event_ids,
    competitorLimit: raw.competitor_limit,
    registrationOpen,
    registrationClose,
    url: raw.url,
    isRegistrationOpen: now >= registrationOpen && now <= registrationClose,
    isUpcoming: endDate >= now,
  };
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function fetchBelgiumCompetitions(): Promise<Competition[]> {
  // Return cached data if still fresh
  const cached = readCache();
  if (cached) {
    return cached
      .map(enrichCompetition)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  // Cache miss — fetch from WCA and populate cache
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const startDate = toISODate(thirtyDaysAgo);
  const url = new URL(`${WCA_OFFICIAL_BASE}/competitions`);
  url.searchParams.set("country_iso2", "BE");
  url.searchParams.set("start", startDate);
  url.searchParams.set("per_page", "50");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch competitions: ${response.status}`);
  }

  const data: OfficialWCACompetition[] = await response.json();
  writeCache(data);

  return data
    .map(enrichCompetition)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}