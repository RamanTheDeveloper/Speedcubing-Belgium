import { useState } from "react";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/siteData";
import logo from "../assets/logo.png";
import type { Page } from "../App";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

// Maps nav labels to their Page key for client-side routing
const NAV_PAGE_MAP: Partial<Record<string, Page>> = {
  Home: "home",
  "About Us": "about",
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (label: string) => {
    const target = NAV_PAGE_MAP[label];
    if (target) {
      onNavigate(target);
      setMobileOpen(false);
    }
  };

  const isActive = (label: string): boolean => {
    const target = NAV_PAGE_MAP[label];
    return target !== undefined && currentPage === target;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10">
            <img
              src={logo}
              alt="Speedcubing Belgium Logo"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">
            Speedcubing Belgium
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              {NAV_PAGE_MAP[label] ? (
                <button
                  onClick={() => handleClick(label)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    isActive(label)
                      ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ) : (
                <a
                  href={href}
                  className="block px-3 py-1.5 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {label}
                </a>
              )}
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
          {NAV_LINKS.map(({ label, href }) =>
            NAV_PAGE_MAP[label] ? (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className={`text-left py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive(label)
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            ) : (
              <a
                key={label}
                href={href}
                className="text-gray-300 hover:text-white py-1.5 text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ),
          )}
        </div>
      )}
    </nav>
  );
}
