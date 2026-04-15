import { useTranslation } from "../i18n";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const privacy = t.privacy;

  return (
    <main className="bg-gray-950 min-h-screen">
      <section className="pt-28 pb-16 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {privacy.hero.title}
          </h1>
          <p className="text-gray-500 text-sm">{privacy.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {privacy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-white text-lg font-bold mb-3">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-400 text-sm leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
