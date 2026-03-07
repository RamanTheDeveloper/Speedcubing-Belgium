import { useState } from "react";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/siteData";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-7 h-7">
            <img src={logo} alt="Speedcubing Belgium Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">
            Speedcubing Belgium
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }, i) => (
            <li key={label}>
              <a
                href={href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <button className="ml-2 flex items-center gap-1 text-gray-300 hover:text-white text-sm px-2 cursor-pointer">
              <Globe size={14} />
              EN
              <ChevronDown size={12} />
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-950 border-t border-white/10 px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-gray-300 hover:text-white py-1.5 text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}