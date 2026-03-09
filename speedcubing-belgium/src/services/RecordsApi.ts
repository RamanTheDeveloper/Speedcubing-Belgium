import type { NationalRecord, RecordResult } from "../types/records";
import { formatEventId, ORDERED_EVENT_IDS } from "../utils/EventUtils";

// Official WCA API — public, no key required
const WCA_API_BASE = "https://www.worldcubeassociation.org/api/v0";

const CACHE_KEY = "wca_be_national_records_v2";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// ─── Official API response types ──────────────────────────────────────────────

interface RankResult {
  best: number;
  world_rank: number;
  continent_rank: number;
  national_rank: number;
}

interface PersonalRecord {
  single: RankResult;
  average?: RankResult;
}

interface OfficialPerson {
  wca_id: string;
  name: string;
  personal_records: Record<string, PersonalRecord>;
}

// ─── Cache helpers ─────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  fetchedAt: number;
  data: T;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return Date.now() - entry.fetchedAt > CACHE_TTL_MS ? null : entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data }));
  } catch {
    // sessionStorage unavailable — fail silently
  }
}

// ─── Time formatting ───────────────────────────────────────────────────────────

const FM_EVENTS    = new Set(["333fm"]);
const MULTI_EVENTS = new Set(["333mbf"]);

export function formatResult(best: number, eventId: string): string {
  if (FM_EVENTS.has(eventId)) return String(best);

  if (MULTI_EVENTS.has(eventId)) {
    // WCA MBLD encoding: value = 1000000000 - (solved-attempted)*1000000 + seconds*100 + missed
    const missed  = best % 100;
    const seconds = Math.floor((best % 1_000_000) / 100);
    const solved  = Math.floor((1_000_000_000 - best) / 1_000_000) + missed;
    const total   = solved + missed;
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${solved}/${total} ${mm}:${ss}`;
  }

  // Standard centisecond times
  const cs  = best % 100;
  const sec = Math.floor(best / 100) % 60;
  const min = Math.floor(best / 6000);

  if (min > 0) {
    return `${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }
  return `${sec}.${String(cs).padStart(2, "0")}`;
}

// ─── Fetching ──────────────────────────────────────────────────────────────────

async function fetchPage(page: number): Promise<{ persons: OfficialPerson[]; totalPages: number }> {
  const url = new URL(`${WCA_API_BASE}/persons`);
  url.searchParams.set("country_iso2", "BE");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`WCA API error: ${res.status}`);

  const total      = Number(res.headers.get("X-Total") ?? "0");
  const totalPages = Math.max(1, Math.ceil(total / 100));
  const data       = await res.json() as { items: OfficialPerson[] };

  return { persons: data.items ?? [], totalPages };
}

async function fetchAllBelgianPersons(): Promise<OfficialPerson[]> {
  const cached = readCache<OfficialPerson[]>(CACHE_KEY);
  if (cached) return cached;

  const { persons: firstPage, totalPages } = await fetchPage(1);
  let all: OfficialPerson[] = firstPage;

  if (totalPages > 1) {
    const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const rest  = await Promise.all(pages.map((p) => fetchPage(p)));
    all = all.concat(rest.flatMap((r) => r.persons));
  }

  writeCache(CACHE_KEY, all);
  return all;
}

// ─── Record extraction ─────────────────────────────────────────────────────────

function toRecordResult(
  r: RankResult,
  personId: string,
  personName: string,
  eventId: string,
): RecordResult {
  return {
    best: r.best,
    formatted: formatResult(r.best, eventId),
    personId,
    personName,
    worldRank: r.world_rank,
    continentRank: r.continent_rank,
  };
}

export async function fetchBelgiumNationalRecords(): Promise<NationalRecord[]> {
  const persons = await fetchAllBelgianPersons();

  const singleMap  = new Map<string, RecordResult>();
  const averageMap = new Map<string, RecordResult>();

  for (const person of persons) {
    for (const [eventId, record] of Object.entries(person.personal_records)) {
      if (record.single?.national_rank === 1) {
        singleMap.set(eventId, toRecordResult(record.single, person.wca_id, person.name, eventId));
      }
      if (record.average?.national_rank === 1) {
        averageMap.set(eventId, toRecordResult(record.average, person.wca_id, person.name, eventId));
      }
    }
  }

  return ORDERED_EVENT_IDS
    .filter((id) => singleMap.has(id) || averageMap.has(id))
    .map((eventId) => {
      const s = singleMap.get(eventId) ?? null;
      const a = averageMap.get(eventId) ?? null;
      const primary = s ?? a!;
      return {
        eventId,
        eventLabel: formatEventId(eventId),
        personId:   primary.personId,
        personName: primary.personName,
        single:  s,
        average: a,
      };
    });
}