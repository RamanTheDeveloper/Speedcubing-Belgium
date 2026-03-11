import type { NationalRecord, RecordResult } from "../types/records";
import { formatEventId, ORDERED_EVENT_IDS } from "../utils/EventUtils";

const RAW_BASE =
  "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api";
const CACHE_KEY = "wca_be_national_records_v8";
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

interface EventResult {
  round: string;
  best: number;
  average: number;
}

interface PersonFile {
  id: string;
  name: string;
  results: Record<string, Record<string, EventResult[]>>;
}

interface CompetitionFile {
  id: string;
  name: string;
  date: {
    from: string; // e.g. "2024-03-15"
    till: string;
  };
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

export function formatResult(best: number, eventId: string, type: "single" | "average"): string {
  if (FM_EVENTS.has(eventId)) {
    if (type === "average") {
      return (best / 100).toFixed(2);
    }

    return String(best);
  }

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

async function fetchRank1(
  eventId: string,
  type: "single" | "average",
): Promise<RankItem | null> {
  const res = await fetch(`${RAW_BASE}/rank/BE/${type}/${eventId}.json`);
  if (!res.ok) return null;
  const data = (await res.json()) as RankFile;
  return data.items?.[0] ?? null;
}

async function fetchPersonData(personId: string): Promise<PersonFile | null> {
  const res = await fetch(`${RAW_BASE}/persons/${personId}.json`);
  if (!res.ok) return null;
  return (await res.json()) as PersonFile;
}

async function fetchCompetitionData(
  compId: string,
): Promise<CompetitionFile | null> {
  const res = await fetch(`${RAW_BASE}/competitions/${compId}.json`);
  if (!res.ok) return null;
  return (await res.json()) as CompetitionFile;
}

function findCompetitionId(
  person: PersonFile,
  eventId: string,
  best: number,
  type: "single" | "average",
): string | undefined {
  for (const [compId, events] of Object.entries(person.results)) {
    const rounds = events[eventId];
    if (!rounds) continue;
    for (const round of rounds) {
      const value = type === "single" ? round.best : round.average;
      if (value === best) return compId;
    }
  }
  return undefined;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Main export ───────────────────────────────────────────────────────────────

export async function fetchBelgiumNationalRecords(): Promise<NationalRecord[]> {
  const cached = readCache<NationalRecord[]>(CACHE_KEY);
  if (cached) return cached;

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

  const allPersonIds = [
    ...new Set([
      ...[...singleMap.values()].map((r) => r.personId),
      ...[...averageMap.values()].map((r) => r.personId),
    ]),
  ];

  const personEntries = await Promise.all(
    allPersonIds.map(async (id) => [id, await fetchPersonData(id)] as const),
  );
  const personMap = new Map(personEntries);

  // Step 3: find competition IDs for all records
  const compIdsToFetch = new Set<string>();
  const recordCompMap = new Map<string, string>(); // "personId:eventId:type" -> compId

  for (const [eventId, item] of singleMap) {
    const person = personMap.get(item.personId);
    if (!person) continue;
    const compId = findCompetitionId(person, eventId, item.best, "single");
    if (compId) {
      compIdsToFetch.add(compId);
      recordCompMap.set(`${item.personId}:${eventId}:single`, compId);
    }
  }
  for (const [eventId, item] of averageMap) {
    const person = personMap.get(item.personId);
    if (!person) continue;
    const compId = findCompetitionId(person, eventId, item.best, "average");
    if (compId) {
      compIdsToFetch.add(compId);
      recordCompMap.set(`${item.personId}:${eventId}:average`, compId);
    }
  }

  const compEntries = await Promise.all(
    [...compIdsToFetch].map(
      async (id) => [id, await fetchCompetitionData(id)] as const,
    ),
  );
  const compMap = new Map(compEntries);

  const toResult = (
    item: RankItem,
    type: "single" | "average",
  ): RecordResult => {
    const person = personMap.get(item.personId);
    const compId = recordCompMap.get(
      `${item.personId}:${item.eventId}:${type}`,
    );
    const comp = compId ? compMap.get(compId) : undefined;
    return {
      best: item.best,
      formatted: formatResult(item.best, item.eventId, type),
      personId: item.personId,
      personName: person?.name ?? item.personId,
      worldRank: item.rank.world,
      continentRank: item.rank.continent,
      competition: comp?.name ?? compId,
      competitionDate: comp?.date.from ? formatDate(comp.date.from) : undefined,
    };
  };

  const records = ORDERED_EVENT_IDS.filter(
    (id) => singleMap.has(id) || averageMap.has(id),
  ).map((eventId) => {
    const s = singleMap.has(eventId)
      ? toResult(singleMap.get(eventId)!, "single")
      : null;
    const a = averageMap.has(eventId)
      ? toResult(averageMap.get(eventId)!, "average")
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
