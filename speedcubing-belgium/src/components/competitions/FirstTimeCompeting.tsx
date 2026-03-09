import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n";

export default function FirstTimeCompeting() {
  const { t } = useTranslation();
  const { title, titleAccent, subtitle, tips, cta } = t.competitions.firstTime;

  return (
    <section className="bg-gray-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">


        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          {title}{" "}
          <span className="text-yellow-400">{titleAccent}</span>
        </h2>

        <p className="text-gray-400 text-base mb-8">{subtitle}</p>

        <ul className="space-y-4 mb-10">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <ArrowRight size={16} className="text-yellow-400 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>

        <a
          href="https://www.worldcubeassociation.org/competitions?region=BE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
        >
          {cta.label} <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}