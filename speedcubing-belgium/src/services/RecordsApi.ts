import type { NationalRecord, RecordResult } from "../types/records";
import { formatEventId, ORDERED_EVENT_IDS } from "../utils/EventUtils";

const RAW_BASE =
  "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api";
const CACHE_KEY = "wca_be_national_records_v6";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RankItem {
  rankType: "single" | "average";
  personId: string;
  eventId: string;
  best: number;
  rank: { world: number; continent: number; country: number };
}

interface RankFile {
  items: RankItem[];
}

interface PersonFile {
  id: string;
  name: string;
}

// ─── Cache ─────────────────────────────────────────────────────────────────────

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
    sessionStorage.setItem(
      key,
      JSON.stringify({ fetchedAt: Date.now(), data }),
    );
  } catch {}
}

// ─── Time formatting ───────────────────────────────────────────────────────────

const FM_EVENTS = new Set(["333fm"]);
const MULTI_EVENTS = new Set(["333mbo", "333mbf"]);

export function formatResult(best: number, eventId: string): string {
  if (FM_EVENTS.has(eventId)) return String(best);

  if (MULTI_EVENTS.has(eventId)) {
    const missed = best % 100;
    const seconds = Math.floor((best % 1_000_000) / 100);
    const solved = Math.floor((1_000_000_000 - best) / 1_000_000) + missed;
    const total = solved + missed;
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${solved}/${total} ${mm}:${ss}`;
  }

  const cs = best % 100;
  const sec = Math.floor(best / 100) % 60;
  const min = Math.floor(best / 6000);
  if (min > 0)
    return `${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  return `${sec}.${String(cs).padStart(2, "0")}`;
}

// ─── Fetching ──────────────────────────────────────────────────────────────────

// Returns the rank-1 Belgian for a given event + type, or null if not found
async function fetchRank1(
  eventId: string,
  type: "single" | "average",
): Promise<RankItem | null> {
  const url = `${RAW_BASE}/rank/BE/${type}/${eventId}.json`;
  const res = await fetch(url);
  if (!res.ok) return null; // event may not exist for this type

  const data = (await res.json()) as RankFile;
  // items are already sorted by rank — first item is rank 1 in BE
  return data.items?.[0] ?? null;
}

async function fetchPersonName(personId: string): Promise<string> {
  const url = `${RAW_BASE}/persons/${personId}.json`;
  const res = await fetch(url);
  if (!res.ok) return personId;
  const data = (await res.json()) as PersonFile;
  return data.name ?? personId;
}

// ─── Main export ───────────────────────────────────────────────────────────────

export async function fetchBelgiumNationalRecords(): Promise<NationalRecord[]> {
  const cached = readCache<NationalRecord[]>(CACHE_KEY);
  if (cached) return cached;

  // Fetch rank-1 for every event in parallel
  const [singleResults, averageResults] = await Promise.all([
    Promise.all(ORDERED_EVENT_IDS.map((id) => fetchRank1(id, "single"))),
    Promise.all(ORDERED_EVENT_IDS.map((id) => fetchRank1(id, "average"))),
  ]);

  const singleMap = new Map<string, RankItem>();
  const averageMap = new Map<string, RankItem>();

  ORDERED_EVENT_IDS.forEach((id, i) => {
    if (singleResults[i]) singleMap.set(id, singleResults[i]!);
    if (averageResults[i]) averageMap.set(id, averageResults[i]!);
  });

  console.log("NR singles:", singleMap.size, "averages:", averageMap.size);

  // Fetch names for all unique person IDs in parallel
  const allPersonIds = [
    ...new Set([
      ...[...singleMap.values()].map((r) => r.personId),
      ...[...averageMap.values()].map((r) => r.personId),
    ]),
  ];

  const nameEntries = await Promise.all(
    allPersonIds.map(async (id) => [id, await fetchPersonName(id)] as const),
  );
  const nameMap = new Map(nameEntries);

  const toResult = (item: RankItem): RecordResult => ({
    best: item.best,
    formatted: formatResult(item.best, item.eventId),
    personId: item.personId,
    personName: nameMap.get(item.personId) ?? item.personId,
    worldRank: item.rank.world,
    continentRank: item.rank.continent,
  });

  const records = ORDERED_EVENT_IDS.filter(
    (id) => singleMap.has(id) || averageMap.has(id),
  ).map((eventId) => {
    const s = singleMap.has(eventId) ? toResult(singleMap.get(eventId)!) : null;
    const a = averageMap.has(eventId)
      ? toResult(averageMap.get(eventId)!)
      : null;
    const primary = s ?? a!;
    return {
      eventId,
      eventLabel: formatEventId(eventId),
      personId: primary.personId,
      personName: primary.personName,
      single: s,
      average: a,
    } satisfies NationalRecord;
  });

  writeCache(CACHE_KEY, records);
  return records;
}
