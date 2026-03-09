import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n";

export default function RecordsInfo() {
  const { t } = useTranslation();
  const { badge, title, titleAccent, description, facts } = t.records.info;

  return (
    <section className="bg-gray-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded mb-6 uppercase tracking-wider">
          {badge}
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          {title}{" "}
          <span className="text-yellow-400">{titleAccent}</span>
        </h2>

        <p className="text-gray-400 text-base mb-8 leading-relaxed">{description}</p>

        <ul className="space-y-4">
          {facts.map((fact, i) => (
            <li key={i} className="flex items-start gap-3">
              <ArrowRight size={16} className="text-yellow-400 mt-0.5 shrink-0" />
              <span
                className="text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fact }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}