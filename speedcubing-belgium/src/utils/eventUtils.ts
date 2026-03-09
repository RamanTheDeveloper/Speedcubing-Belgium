// Maps WCA event IDs to human-readable labels
const EVENT_LABELS: Record<string, string> = {
  "222":       "2×2×2",
  "333":       "3×3×3",
  "444":       "4×4×4",
  "555":       "5×5×5",
  "666":       "6×6×6",
  "777":       "7×7×7",
  "333bf":     "3×3×3 Blindfolded",
  "333fm":     "3×3×3 Fewest Moves",
  "333oh":     "3×3×3 One-Handed",
  "clock":     "Clock",
  "minx":      "Megaminx",
  "pyram":     "Pyraminx",
  "skewb":     "Skewb",
  "sq1":       "Square-1",
  "444bf":     "4×4×4 Blindfolded",
  "555bf":     "5×5×5 Blindfolded",
  "333mbf":    "3×3×3 Multi-Blind",
};

export function formatEventId(eventId: string): string {
  return EVENT_LABELS[eventId] ?? eventId;
}