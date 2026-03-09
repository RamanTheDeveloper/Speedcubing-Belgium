import { useTranslation } from "../../i18n";

export default function RecordsHero() {
  const { t } = useTranslation();
  return (
    <section className="bg-gray-950 pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          {t.records.hero.title}{" "}
        </h1>
        <p className="text-gray-400 text-base max-w-lg leading-relaxed">
          {t.records.hero.subtitle}
        </p>
      </div>
    </section>
  );
}