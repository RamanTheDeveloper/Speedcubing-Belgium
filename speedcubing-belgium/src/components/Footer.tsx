import logo from "../assets/logo.png";
import { useTranslation } from "../i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const developerName = "Grow Easy";

  const { t } = useTranslation();
  const footer = t.footer;

  return (
    <footer className="bg-gray-950 border-t border-white/10 pt-12 pb-6">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-14 h-14">
              <img
                src={logo}
                alt="Speedcubing Belgium Logo"
                className="rounded-sm"
              />
            </div>
            <span className="text-white font-bold text-sm">
              {footer.about.heading}
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {footer.about.description}
          </p>
        </div>

        {/* Dynamic columns */}
        {footer.columns.map(({ heading, links }) => (
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
                <a
                  href="https://www.facebook.com/SpeedcubingBelgium/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6 text-gray-100 fill-current cursor-pointer"
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>{footer.social.links[0].icon}</title>
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/speedcubing_belgium/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6 text-gray-100 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>{footer.social.links[1].icon}</title>
                    <path
                      d="M7.03.08c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.12 1.39-.67.67-1.08 1.34-1.38 2.13-.3.76-.5 1.64-.55 2.91-.06 1.28-.07 1.69-.06 4.95.01 3.26.02 3.67.08 4.95.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.39 2.12.67.67 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.55 1.28.06 1.69.07 4.95.06 3.26-.01 3.67-.02 4.95-.08 1.28-.06 2.15-.27 2.91-.56.79-.31 1.46-.72 2.12-1.39.67-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.55-2.91.06-1.28.07-1.69.06-4.95-.01-3.26-.02-3.67-.08-4.95-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.39-2.12C21.3 1.33 20.63.92 19.84.62c-.76-.3-1.64-.5-2.91-.55C15.65.01 15.24-.01 11.98 0 8.72.01 8.31.02 7.03.08Z"
                      stroke="currentColor"
                    />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" />
                    <circle cx="17.5" cy="6.5" r="0.7" stroke="currentColor" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto px-6 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-600 text-xs">
          {footer.copyright.icon}
          {footer.copyright.text}
          <a
            href="https://www.groweasy.be"
            className="text-blue-600 hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Grow Easy
          </a>
          {footer.copyright.rights}
        </p>

        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-300 text-xs transition-colors"
          >
            {footer.copyright.privacy}
          </a>
          <span className="text-gray-700 text-xs">·</span>
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-300 text-xs transition-colors"
          >
            {footer.copyright.terms}
          </a>
        </div>
      </div>
    </footer>
  );
}
