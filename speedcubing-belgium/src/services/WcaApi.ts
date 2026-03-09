import type { Competition } from "../types/Wca";

const WCA_OFFICIAL_BASE = "https://www.worldcubeassociation.org/api/v0";

// ─── Official WCA API types ───────────────────────────────────────────────────

interface OfficialWCACompetition {
  id: string;
  name: string;
  venue: string;
  city: string;
  country_iso2: string;
  start_date: string;   // "YYYY-MM-DD"
  end_date: string;     // "YYYY-MM-DD"
  event_ids: string[];
  competitor_limit: number | null;
  registration_open: string;   // ISO datetime
  registration_close: string;  // ISO datetime
  url: string;
  announced_at: string;
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
  // Set end of day so a comp ending today is still considered upcoming
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

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchBelgiumCompetitions(): Promise<Competition[]> {
  const today = toISODate(new Date());

  // Fetch upcoming competitions in Belgium from today onward
  // The official API supports country_iso2 and start/end date filtering
  const url = new URL(`${WCA_OFFICIAL_BASE}/competitions`);
  url.searchParams.set("country_iso2", "BE");
  url.searchParams.set("start", today);
  url.searchParams.set("per_page", "50");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch competitions: ${response.status}`);
  }

  const data: OfficialWCACompetition[] = await response.json();

  return data
    .map(enrichCompetition)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}