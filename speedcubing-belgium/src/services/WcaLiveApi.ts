const WCA_LIVE_GRAPHQL = "https://live.worldcubeassociation.org/api/graphql";

// Short cache — live data can appear at any time on competition day
const CACHE_KEY = "wca_live_competitions";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Types ────────────────────────────────────────────────────────────────────

interface WcaLiveCompetition {
  id: string;   // numeric string, used in the URL
  wcaId: string; // e.g. "WezemaalOpen2026", matches our competition.id
}

interface CacheEntry {
  fetchedAt: number;
  data: WcaLiveCompetition[];
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function readCache(): WcaLiveCompetition[] | null {
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

function writeCache(data: WcaLiveCompetition[]): void {
  try {
    const entry: CacheEntry = { fetchedAt: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // sessionStorage can be unavailable — fail silently
  }
}

// ─── API call ─────────────────────────────────────────────────────────────────

const COMPETITIONS_QUERY = `{
  competitions {
    id
    wcaId
  }
}`;

async function fetchLiveCompetitions(): Promise<WcaLiveCompetition[]> {
  const cached = readCache();
  if (cached) return cached;

  const response = await fetch(WCA_LIVE_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: COMPETITIONS_QUERY }),
  });

  if (!response.ok) {
    throw new Error(`WCA Live API error: ${response.status}`);
  }

  const json = await response.json();
  const competitions: WcaLiveCompetition[] = json.data?.competitions ?? [];
  writeCache(competitions);
  return competitions;
}

// ─── Persistent URL Cache ───────────────────────────────────────────────────

function readUrlFromCache(wcaId: string): string | null {
  try {
    return localStorage.getItem(`wca_live_url_${wcaId}`);
  } catch {
    return null;
  }
}

function saveUrlToCache(wcaId: string, url: string): void {
  try {
    localStorage.setItem(`wca_live_url_${wcaId}`, url);
  } catch {
    //
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Looks up the WCA Live URL for a competition by its WCA website ID.
 * Returns the full URL (e.g. "https://live.worldcubeassociation.org/competitions/9795")
 * or `null` if the competition hasn't been imported into WCA Live yet.
 */
export async function getWcaLiveUrl(wcaId: string): Promise<string | null> {
  const cachedUrl = readUrlFromCache(wcaId);
  if (cachedUrl) return cachedUrl;

  try {
    const competitions = await fetchLiveCompetitions();
    const match = competitions.find((c) => c.wcaId === wcaId);
    
    if (match) {
      const url = `https://live.worldcubeassociation.org/competitions/${match.id}`;
      saveUrlToCache(wcaId, url);
      return url;
    }
    
    return null;
  } catch {
    return null;
  }
}
