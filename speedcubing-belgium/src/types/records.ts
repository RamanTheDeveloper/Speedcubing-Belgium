export type RecordType = "single" | "average";

export interface RawRankEntry {
  personId: string;
  personName: string;
  personCountry: string;
  eventId: string;
  best: number; // time in centiseconds, or move count for FM
  worldRank: number;
  continentRank: number;
  countryRank: number;
}

export interface RawRanksResponse {
  items: RawRankEntry[];
  pagination: {
    currentPage: number;
    lastPage: number;
    nextPage: number | null;
  };
}

export interface NationalRecord {
  eventId: string;
  eventLabel: string;
  personId: string;
  personName: string;
  single: RecordResult | null;
  average: RecordResult | null;
}

export interface RecordResult {
  best: number;
  formatted: string;
  personId: string;
  personName: string;
  worldRank: number;
  continentRank: number;
  competition?: string;
  competitionDate?: string;
}
