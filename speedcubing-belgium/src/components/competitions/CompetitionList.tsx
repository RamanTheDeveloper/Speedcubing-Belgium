import { Loader2, AlertCircle } from "lucide-react";
import CompetitionCard from "./CompetitionCard";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useTranslation } from "../../i18n";

export default function CompetitionsList() {
  const { upcoming, loading, error } = useCompetitions();
  const { t } = useTranslation();

  if (loading) {
    return (
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading competitions...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <span className="text-sm">Failed to load competitions. Please try again later.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {t.competitions.upcoming.title}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {upcoming.length > 0
              ? `${upcoming.length} competition${upcoming.length !== 1 ? "s" : ""} scheduled`
              : t.competitions.upcoming.empty}
          </p>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {t.competitions.upcoming.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}