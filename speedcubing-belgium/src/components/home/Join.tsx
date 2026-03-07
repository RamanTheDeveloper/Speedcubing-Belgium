import { ArrowRight } from "lucide-react";

export default function JoinCTA() {
  return (
    <section className="bg-gray-100 py-24 text-center">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Ready to Join Us?
        </h2>
        <p className="text-gray-500 text-base mb-8">
          Check out our upcoming competitions and become part of the Belgian
          speedcubing scene!
        </p>
        <a
          href="#competitions"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3 rounded transition-colors"
        >
          View Upcoming Events <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}