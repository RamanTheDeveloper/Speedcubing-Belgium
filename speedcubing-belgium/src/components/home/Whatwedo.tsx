import { Star, Trophy, Users } from "lucide-react";
import { useTranslation } from "../../i18n";

const ICONS_MAP = {
  Trophy,
  Star,
  Users,
};


export default function WhatWeDoSection() {
  const { t } = useTranslation();
  const whatWeDo = t.home.whatWeDo;

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-12">
          {whatWeDo.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whatWeDo.items.map(({ icon: iconName, title, description }) => {
            const Icon = ICONS_MAP[iconName as keyof typeof ICONS_MAP];

            return (
              <div
                key={title}
                className="bg-gray-800 border border-white/10 rounded-xl p-7 text-left hover:border-yellow-400/30 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-5">
                  {Icon && <Icon size={20} className="text-yellow-400" />}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-400 text-md leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
