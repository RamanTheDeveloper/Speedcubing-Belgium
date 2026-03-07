import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center bg-gray-900 overflow-hidden pt-14">

      {/* Background gradient blobs */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 40%, #f5c518 0%, transparent 45%),
            radial-gradient(circle at 75% 60%, #e63946 0%, transparent 40%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-gray-900/60" />

      <div className="relative z-10 px-6 max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-yellow-400 uppercase mb-4">
          Official WCA Organisation
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
          Welcome to
          <br />
          Speedcubing Belgium
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          Join the fastest growing puzzle sport in Belgium
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#competitions"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
          >
            View Competitions <ArrowRight size={16} />
          </a>
          <a
            href="#records"
            className="flex items-center gap-2 border border-white/40 hover:border-white text-white font-semibold px-6 py-2.5 rounded transition-colors text-sm"
          >
            National Records <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}