import { ArrowRight } from "lucide-react";

interface InvolvedAction {
  label: string;
  href: string;
  variant: "dark" | "outline";
}

const ACTIONS: InvolvedAction[] = [
  { label: "Compete",   href: "#competitions", variant: "dark" },
  { label: "Volunteer", href: "#volunteer",    variant: "dark" },
  { label: "Organize",  href: "#organize",     variant: "outline" },
];

export default function GetInvolved() {
  return (
    <section className="bg-gray-100 py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Get{" "}
          <span className="text-yellow-500">Involved</span>
        </h2>
        <p className="text-gray-500 text-base mb-10">
          Want to contribute to the Belgian speedcubing community? There are
          many ways to get involved!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {ACTIONS.map(({ label, href, variant }) => (
            <a
              key={label}
              href={href}
              className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full transition-colors text-sm ${
                variant === "dark"
                  ? "bg-gray-900 hover:bg-gray-700 text-white"
                  : "border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900"
              }`}
            >
              {label} <ArrowRight size={16} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}