import { ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Logo card — shown above text on mobile, right side on desktop */}
        <div className="md:hidden shrink-0 w-52 h-52 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col items-center justify-center gap-3 p-6">
          <img
            src={logo}
            alt="Speedcubing Belgium Logo"
            className="w-full h-full object-contain"
          />
          <div className="w-12 h-1 bg-red-500 rounded" />
        </div>

        {/* Text content */}
        <div className="flex-1">
          <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
            Who We Are
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
            What is
            <br />
            Speedcubing Belgium?
          </h2>

          <p className="text-gray-600 text-md leading-relaxed mb-4">
            Speedcubing Belgium (SCB) is the official representative
            organization for speedcubing in Belgium, working in close
            collaboration with the World Cube Association (WCA).
          </p>
          <p className="text-gray-600 text-md leading-relaxed mb-4">
            We organize and oversee official speedcubing competitions throughout
            Belgium, where cubers of all skill levels compete to solve various
            twisty puzzles as fast as possible.
          </p>
          <p className="text-gray-600 text-md leading-relaxed mb-8">
            Whether you're a beginner who just learned to solve a Rubik's Cube
            or an experienced speedcuber chasing national records, SCB provides
            a welcoming community and competitive platform for all.
          </p>

          <a
            href="/about"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm"
          >
            Learn More About Us <ArrowRight size={16} />
          </a>
        </div>

        {/* Logo card — hidden on mobile, visible on desktop */}
        <div className="hidden md:flex shrink-0 w-64 h-64 bg-white rounded-xl shadow-xl border border-gray-100 flex-col items-center justify-center gap-3 p-6">
          <img
            src={logo}
            alt="Speedcubing Belgium Logo"
            className="w-full h-full object-contain"
          />
          <div className="w-12 h-1 bg-red-500 rounded" />
        </div>
      </div>
    </section>
  );
}
