import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import EventBadge from "./EventsBadge";
import type { Competition } from "../../types/Wca";
import { formatEventId } from "../../utils/EventUtils";

interface CompetitionCardProps {
  competition: Competition;
}

type RegistrationStatus = "open" | "closed" | "not-yet-open" | "live";

function getRegistrationStatus(competition: Competition): RegistrationStatus {
  const now = new Date();
  if (now < competition.registrationOpen) return "not-yet-open";
  if (now > competition.registrationClose) return "closed";
  if(now >= competition.startDate && now <= competition.endDate) return "live";
  return "open";
}

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  "open":         "bg-green-100 text-green-700 border border-green-200",
  "closed":       "bg-red-100 text-red-700 border border-red-200",
  "not-yet-open": "bg-gray-100 text-gray-600 border border-gray-200",
  "live":          "bg-blue-100 text-blue-700 border border-blue-200",
};

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  "open":         "Registration Open",
  "closed":       "Registration Closed",
  "not-yet-open": "Registration Soon",
  "live":          "Registration Live",
};

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { name, date, venue, city, events, competitorLimit, url } = competition;

  const status = getRegistrationStatus(competition);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-yellow-400">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-gray-900 font-bold text-lg leading-snug">{name}</h3>
        <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Meta info */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 text-md text-gray-500">
          <Calendar size={15} className="shrink-0 text-gray-400" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2.5 text-md text-gray-500">
          <MapPin size={15} className="shrink-0 text-gray-400" />
          <span>{venue}, {city}</span>
        </div>
        {competitorLimit != null && (
          <div className="flex items-center gap-2.5 text-md text-gray-500">
            <Users size={15} className="shrink-0 text-gray-400" />
            <span>{competitorLimit} competitor limit</span>
          </div>
        )}
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Events
          </p>
          <div className="flex flex-wrap gap-1.5">
            {events.map((event) => (
              <EventBadge key={event} event={formatEventId(event)} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          {status === "open" ? "Register Now" : "View Details"} <ArrowRight size={15} />
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-lg"
        >
          Details
        </a>
      </div>
    </div>
  );
}