import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../i18n";
import { Link } from "react-router-dom";

export default function GetInvolved() {
  const { t } = useTranslation();
  const about = t.about;

  return (
    <section className="bg-gray-100 py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          {about.getInvolved.title}
        </h2>
        <p className="text-gray-500 text-base mb-10">
          {about.getInvolved.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {about.getInvolved.actions.map(({ label, href, variant }) => (
            <Link
              key={label}
              to={href}
              className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full transition-colors text-sm ${
                variant === "dark"
                  ? "bg-gray-900 hover:bg-gray-700 text-white"
                  : "border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900"
              }`}
            >
              {label} <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
