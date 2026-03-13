import { useTranslation } from "../../i18n";

export default function MissionStatement() {
  const {t} = useTranslation();
  const about = t.about

  return (
    <section className="bg-gray-950 py-20 px-6">
      <div className="max-w-5xl mx-auto flex justify-center">
        <div className="bg-white border border-gray-100 rounded-2xl px-8 py-10 max-w-2xl">
          <span className="inline-block bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            {about.mission.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-snug">
            {about.mission.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {about.mission.description}
          </p>
        </div>
      </div>
    </section>
  );
}
