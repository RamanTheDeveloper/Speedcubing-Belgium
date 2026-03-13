import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n";
import { Link } from "react-router-dom";

export default function JoinCTA() {
  const { t } = useTranslation();
  const cta = t.home.joinCta

  return (
    <section className="bg-gray-100 py-24 text-center">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          {cta.title}
        </h2>
        <p className="text-gray-500 text-base mb-8">
          {cta.subtitle}
        </p>
        <Link
          to="/competitions"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3 rounded transition-colors"
        >
          {cta.cta.label} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}