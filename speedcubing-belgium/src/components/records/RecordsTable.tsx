import { useState } from "react";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useRecords } from "../../hooks/useRecords";
import { useTranslation } from "../../i18n";

type Tab = "single" | "average";

export default function RecordsTable() {
  const { records, loading, error } = useRecords();
  const { t } = useTranslation();
  const record = t.records;

  const [tab, setTab] = useState<Tab>("single");

  if (loading) {
    return (
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">{}</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <span className="text-sm">
            {record.error.failload}
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header + toggle */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {record.table.title}<span className="text-yellow-500">{record.table.accentTitle}</span>
          </h2>

          <div className="flex items-center bg-gray-900 rounded-full p-1 text-sm font-semibold">
            {(["single", "average"] as Tab[]).map((type) => (
              <button
                key={type}
                onClick={() => setTab(type)}
                className={`px-5 py-1.5 rounded-full transition-colors cursor-pointer ${
                  tab === type
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase w-32">
                  {record.table.event}
                </th>
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase w-24">
                  {record.table.time}
                </th>
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase">
                  {record.table.holder}
                </th>
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase hidden md:table-cell w-28">
                  {record.table.worldRank}
                </th>
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase hidden md:table-cell">
                  {record.table.competition}
                </th>
                <th className="text-left px-6 py-4 font-semibold tracking-wider text-xs uppercase hidden md:table-cell w-28">
                  {record.table.date}
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => {
                const result =
                  tab === "single" ? record.single : record.average;

                return (
                  <tr
                    key={record.eventId}
                    className={`border-t border-gray-100 transition-colors ${
                      result ? "hover:bg-gray-50" : "opacity-40"
                    } ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {record.eventLabel}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-yellow-500 text-base">
                      {result?.formatted ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {result ? (
                        <a
                          href={`https://www.worldcubeassociation.org/persons/${result.personId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yellow-500 transition-colors inline-flex items-center gap-1.5 font-semibold"
                        >
                          {result.personName}
                          <ExternalLink size={12} className="text-gray-400" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                      {result ? `#${result.worldRank}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                      {result?.competition ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                      {result?.competitionDate ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          {record.table.disclaimer}
          <a
            href="https://www.worldcubeassociation.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            {record.table.source}
          </a>
          {record.table.disclaimerEnd}
        </p>
      </div>
    </section>
  );
}
