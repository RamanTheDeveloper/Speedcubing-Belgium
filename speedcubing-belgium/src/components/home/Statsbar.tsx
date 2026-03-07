import { STATS } from "../../data/siteData";

export default function StatsBar() {
  return (
    <div className="bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <p className="text-yellow-400 text-3xl font-extrabold">{value}</p>
            <p className="text-gray-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}