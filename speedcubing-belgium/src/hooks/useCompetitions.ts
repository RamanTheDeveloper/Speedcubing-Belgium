import { useState, useEffect } from "react";
import { fetchBelgiumCompetitions } from "../services/WcaApi";
import type { Competition } from "../types/Wca";

interface UseCompetitionsResult {
  upcoming: Competition[];
  past: Competition[];
  loading: boolean;
  error: string | null;
}

export function useCompetitions(): UseCompetitionsResult {
  const [upcoming, setUpcoming] = useState<Competition[]>([]);
  const [past, setPast] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBelgiumCompetitions()
      .then((competitions) => {
        if (cancelled) return;
        setUpcoming(competitions.filter((c) => c.isUpcoming));
        setPast(competitions.filter((c) => !c.isUpcoming).reverse());
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load competitions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { upcoming, past, loading, error };
}