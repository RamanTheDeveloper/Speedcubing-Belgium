import { useState, useEffect } from "react";
import { fetchBelgiumNationalRecords } from "../services/RecordsApi";
import type { NationalRecord } from "../types/records";

interface UseRecordsResult {
  records: NationalRecord[];
  loading: boolean;
  error: string | null;
}

export function useRecords(): UseRecordsResult {
  const [records, setRecords] = useState<NationalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBelgiumNationalRecords()
      .then((data) => { if (!cancelled) setRecords(data); })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load records");
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { records, loading, error };
}