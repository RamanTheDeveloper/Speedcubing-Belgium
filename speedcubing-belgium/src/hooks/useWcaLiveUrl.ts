import { useState, useEffect } from "react";
import { getWcaLiveUrl } from "../services/WcaLiveApi";

interface UseWcaLiveUrlResult {
  liveUrl: string | null;
  loading: boolean;
}

/**
 * Resolves the WCA Live URL for a competition.
 * Only fetches when `isLive` is true — no network call for non-live competitions.
 */
export function useWcaLiveUrl(
  wcaId: string,
  isLive: boolean
): UseWcaLiveUrlResult {
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLive) {
      setLiveUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getWcaLiveUrl(wcaId)
      .then((url) => {
        if (!cancelled) setLiveUrl(url);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wcaId, isLive]);

  return { liveUrl, loading };
}
