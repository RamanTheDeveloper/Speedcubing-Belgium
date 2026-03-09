import { useState } from "react";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTranslation, type Locale } from "../i18n";

// Maps nav link hrefs to their route paths
const NAV_ROUTE_MAP: Record<string, string> = {
  "#":     "/",
  "#about": "/about",
};

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "nl", label: "NL" },
  { code: "fr", label: "FR" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);

  const { locale, changeLocale, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    const route = NAV_ROUTE_MAP[href];
    if (route) {
      navigate(route);
    }
    setMobileOpen(false);
  };

  const handleLocaleChange = (code: Locale) => {
    changeLocale(code);
    setLocaleOpen(false);
  };

  const isActive = (href: string): boolean => {
    const route = NAV_ROUTE_MAP[href];
    if (!route) return false;
    // Exact match for home, prefix match for others
    return route === "/" ? location.pathname === "/" : location.pathname.startsWith(route);
  };

  const currentLocaleLabel = LOCALES.find((l) => l.code === locale)?.label ?? "EN";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10">
            <img
              src={logo}
              alt="Speedcubing Belgium Logo"
              className="w-full h-full object-contain rounded-sm"
            />
          </div>
          <span className="text-white font-bold text-sm tracking-wide">
            {t.nav.brand}
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {t.nav.links.map(({ label, href }) => {
            const isRouted = href in NAV_ROUTE_MAP;
            return (
              <li key={href}>
                {isRouted ? (
                  <button
                    onClick={() => handleNavClick(href)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                      isActive(href)
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
            );
          })}

          {/* Language selector */}
          <li className="relative ml-2">
            <button
              onClick={() => setLocaleOpen((prev) => !prev)}
              className="flex items-center gap-1 text-gray-300 hover:text-white text-sm px-2 py-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe size={14} />
              {currentLocaleLabel}
              <ChevronDown
                size={12}
                className={`transition-transform ${localeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {localeOpen && (
              <ul className="absolute right-0 top-full mt-1 bg-gray-900 border border-white/10 rounded-lg overflow-hidden shadow-xl w-20">
                {LOCALES.map(({ code, label }) => (
                  <li key={code}>
                    <button
                      onClick={() => handleLocaleChange(code)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        locale === code
                          ? "text-yellow-400 bg-white/5"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
          {t.nav.links.map(({ label, href }) => {
            const isRouted = href in NAV_ROUTE_MAP;
            return isRouted ? (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className={`text-left py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive(href) ? "text-yellow-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            ) : (
              <a
                key={href}
                href={href}
                className="text-gray-300 hover:text-white py-1.5 text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            );
          })}

          {/* Mobile locale switcher */}
          <div className="flex gap-3 pt-2 border-t border-white/10 mt-1">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => handleLocaleChange(code)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  locale === code ? "text-yellow-400" : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}