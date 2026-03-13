import { TIMELINE_EVENTS } from "../../data/aboutData";
import { useTranslation } from "../../i18n";

export default function Timeline() {
  const { t } = useTranslation();
  const about = t.about;

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {about.timeline.title}
          </h2>
        </div>

        {/* Timeline list */}
        <ol className="relative">
          {about.timeline.events.map((event, i) => {
            const isLast = i === TIMELINE_EVENTS.length - 1;
            const isZero = i % 3 === 0;
            const isOne = i % 3 === 1;

            return (
              <li key={event.year} className="flex gap-6 pb-10">

                {/* Left column: badge + vertical line */}
                <div className="flex flex-col items-center">
                    <div
                    className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-sm font-extrabold z-10 
                      ${
                      isZero
                      ? "bg-gray-900 text-white"
                      : isOne
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-red-600 text-white"
                    }`}
                    >
                    {event.shortYear}
                    </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Right column: card */}
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-6 py-5 mb-2">
                  <p className="text-xs font-semibold text-gray-400 mb-1 tracking-wider">
                    {event.year}
                  </p>
                  <h3 className="text-gray-900 font-bold text-lg mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>

              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}