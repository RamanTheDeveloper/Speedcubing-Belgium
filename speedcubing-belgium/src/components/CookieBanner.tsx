import { useState, useEffect } from "react";
import { Cookie, X, ChevronDown, ChevronUp, ShieldCheck, BarChart2 } from "lucide-react";
import {
  getConsentCookie,
  setConsentCookie,
  setLangCookie,
} from "../utils/Cookies";
import { useTranslation } from "../i18n";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { locale } = useTranslation();

  useEffect(() => {
    if (getConsentCookie() === null) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  function handleRequiredOnly() {
    setConsentCookie("declined");
    // Language cookie is functional — always set regardless of analytics consent
    setLangCookie(locale);
    setVisible(false);
  }

  function handleAcceptAll() {
    setConsentCookie("accepted");
    setLangCookie(locale);
    // TODO: initialise Google Analytics here, e.g.:
    // gtag('consent', 'update', { analytics_storage: 'granted' })
    setVisible(false);
  }

  return (
    <>
      <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm md:hidden" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-[999] animate-slide-up"
      >
        <div className="bg-gray-900 border border-white/10 shadow-2xl md:rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-3 p-4 pb-3">
            <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
              <Cookie size={16} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">We use cookies</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                We use functional cookies to remember your language, and optional
                analytics cookies to understand how the site is used.
              </p>
            </div>
            <button
              onClick={handleRequiredOnly}
              aria-label="Dismiss — required cookies only"
              className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer mt-0.5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Expandable details */}
          <div className="px-4">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer pb-2"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? "Hide details" : "What do we store?"}
            </button>

            {expanded && (
              <div className="border border-white/8 rounded-lg bg-white/4 p-3 mb-3 text-xs text-gray-400 space-y-3">
                {/* Required */}
                <div>
                  <p className="text-white/50 uppercase tracking-widest text-[10px] font-semibold mb-2">
                    Required
                  </p>
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={13} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">preferred_lang</p>
                      <p>Remembers your chosen language (en / fr / nl). Always set. Expires after 1 year.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <ShieldCheck size={13} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">cookie_consent</p>
                      <p>Stores your consent choice so we don't ask again. Always set.</p>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div>
                  <p className="text-white/50 uppercase tracking-widest text-[10px] font-semibold mb-2">
                    Analytics (optional)
                  </p>
                  <div className="flex items-start gap-2">
                    <BarChart2 size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Google Analytics</p>
                      <p>Helps us understand which pages are visited. No personal data is sold. Only set if you accept all.</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 pt-1">No advertising or third-party tracking cookies.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={handleRequiredOnly}
              className="flex-1 text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-lg py-2.5 transition-colors cursor-pointer"
            >
              Required only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg py-2.5 transition-colors cursor-pointer"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.35s ease-out forwards;
        }
      `}</style>
    </>
  );
}