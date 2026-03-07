import { FOOTER_COLUMNS } from "../data/siteData";
import logo from "../assets/logo.png";

const SOCIAL_LINKS = [
  { label: "f",  href: "#", ariaLabel: "Facebook" },
  { label: "i", href: "#", ariaLabel: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 pt-12 pb-6">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-14 h-14">
              <img src={logo} alt="Speedcubing Belgium Logo" className="rounded-sm" />
            </div>
            <span className="text-white font-bold text-sm">About SCB</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Speedcubing Belgium is the official representative organization for
            competitive Rubik's Cube solving in Belgium, affiliated with the
            World Cube Association (WCA).
          </p>
        </div>

        {/* Dynamic columns */}
        {FOOTER_COLUMNS.map(({ heading, links }) => (
          <div key={heading}>
            <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social icons under Contact Us */}
            {heading === "Contact Us" && (
              <div className="flex gap-3 mt-4">
                {SOCIAL_LINKS.map(({ label, href, ariaLabel }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={ariaLabel}
                    className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 border-t border-white/10 pt-5 text-center">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Speedcubing Belgium. Made by <a href="https://www.groweasy.be" className="text-blue-600 hover:text-gray-300 transition-colors" target="_blank" rel="noopener noreferrer">Grow Easy</a>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}