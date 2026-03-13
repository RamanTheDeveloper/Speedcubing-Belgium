import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";
import hero4 from "../../assets/hero4.jpg";
import hero5 from "../../assets/hero5.jpg";
import { useTranslation } from "../../i18n";

interface Slide {
  id: number;
  backgroundImage: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    alt: "Speedcubing competition",
    backgroundImage: `url(${hero1})`,
  },
  {
    id: 2,
    alt: "Feliks Zemdegs competing at an event",
    backgroundImage: `url(${hero2})`,
  },
  {
    id: 3,
    alt: "Community of speedcubers",
    backgroundImage: `url(${hero3})`,
  },
  {
    id: 4,
    alt: "Speedcuber solving",
    backgroundImage: `url(${hero4})`,
  },
  {
    id: 5,
    alt: "Delegate checking solve",
    backgroundImage: `url(${hero5})`,
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 400);
    },
    [current, isTransitioning],
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [goNext]);

  const { badge, title, subtitle, primaryCta, secondaryCta } = t.home.hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-14 bg-gray-900">
      {/* Background slides — only these rotate */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          role="img"
          aria-label={slide.alt}
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: slide.backgroundImage,
            opacity: i === current && !isTransitioning ? 1 : 0,
          }}
        />
      ))}

      {/* Persistent dark overlay */}
      <div className="absolute inset-0 bg-gray-900/65 z-10" />

      {/* Static text — never changes between slides */}
      <div className="relative z-20 px-6 max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest text-yellow-400 uppercase mb-4">
          {badge}
        </p>

        <h1 className="text-5xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
          {title}
        </h1>

        <p className="text-gray-300 text-lg mb-8">{subtitle}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/competitions"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
          >
            {primaryCta.label} <ArrowRight size={16} />
          </a>
          <a
            href="/records"
            className="flex items-center gap-2 border border-white/40 hover:border-white text-white font-semibold px-6 py-2.5 rounded transition-colors text-sm"
          >
            {secondaryCta.label} <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next arrow */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "bg-yellow-400 w-6 h-2.5"
                : "bg-white/40 hover:bg-white/60 w-2.5 h-2.5"
            }`}
          />
        ))}
      </div>

      {/* Photo credit */}
      <div className="absolute bottom-2 md:bottom-4 right-4 z-30">
        <a
          href="https://irenedriessen.smugmug.com/Speedcubing/Hasselt-Sunday-Open-2025"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 text-[10px] md:text-xs transition-colors"
        >
          © Photos by Irene Driessen
        </a>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div
          key={current}
          className="h-full bg-yellow-400"
          style={{
            animation: `progress ${AUTOPLAY_INTERVAL}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
