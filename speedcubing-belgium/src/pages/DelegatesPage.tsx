import { Mail, ExternalLink } from "lucide-react";
import { useState } from "react";

import nicoloImg from "../assets/delegates/nicolo.jpg";
import lisaImg from "../assets/delegates/lisa.jpg";
import claraImg from "../assets/delegates/clara.jpg";
import theoImg from "../assets/delegates/theo.jpg";
import ramandeepImg from "../assets/delegates/ramandeep.jpg";
import matthiasImg from "../assets/delegates/matthias.jpg";
import { useTranslation } from "../i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Delegate {
  id: string;
  name: string;
  role: "Junior Delegate" | "Trainee Delegate";
  region: string;
  wcaId: string;
  email?: string;
  avatar?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const JUNIOR_DELEGATES: Delegate[] = [
  {
    id: "junior-1",
    name: "Nicolò Simone",
    role: "Junior Delegate",
    region: "Italy",
    wcaId: "2008SIMO02",
    avatar: nicoloImg,
  },
  {
    id: "junior-2",
    name: "Lisa Leukemans",
    role: "Junior Delegate",
    region: "Belgium",
    wcaId: "2021LEUK01",
    avatar: lisaImg,
  },
  {
    id: "junior-3",
    name: "Clara Verbraeken",
    role: "Junior Delegate",
    region: "Belgium",
    wcaId: "2019VERB02",
    avatar: claraImg,
  },
  {
    id: "junior-4",
    name: "Théo Naedenoen",
    role: "Junior Delegate",
    region: "Belgium",
    wcaId: "2019NAED01",
    avatar: theoImg,
  },
];

const TRAINEE_DELEGATES: Delegate[] = [
  {
    id: "trainee-1",
    name: "Ramandeep Singh",
    role: "Trainee Delegate",
    region: "Belgium",
    wcaId: "2022SING16",
    avatar: ramandeepImg,
  },
  {
    id: "trainee-2",
    name: "Matthias Schegers",
    role: "Trainee Delegate",
    region: "Belgium",
    wcaId: "2019SCHE10",
    avatar: matthiasImg,
  },
];

// ─── Role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Delegate["role"] }) {
  const styles: Record<Delegate["role"], string> = {
    "Junior Delegate": "bg-yellow-400 text-gray-900",
    "Trainee Delegate": "bg-gray-200 text-gray-700",
  };
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap inline-block ${styles[role]}`}
    >
      {role}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────

function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string;
  name: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "w-28 h-28" : "w-28 h-28";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [imgFailed, setImgFailed] = useState(false);

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgFailed(true)}
        className={`${dim} rounded-full object-cover border-4 border-white shadow-md`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center`}
    >
      <span className="text-gray-500 font-bold text-lg">{initials}</span>
    </div>
  );
}

// ─── Junior delegate card ─────────────────────────────────────────────────────

function JuniorDelegateCard({ delegate }: { delegate: Delegate }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <Avatar src={delegate.avatar} name={delegate.name} size="lg" />
        <div>
          <p className="font-extrabold text-gray-900 text-lg">
            {delegate.name}
          </p>
          <RoleBadge role={delegate.role} />
          <p className="text-xs text-gray-400 mt-1">
            {delegate.id !== "junior-1"
              ? `${t.delegates.roles.role.region}`
              : `${t.delegates.roles.role.region2}` }
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {delegate.email && (
          <a
            href={`mailto:${delegate.email}`}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          >
            <Mail size={14} />
            Contact
          </a>
        )}
        <a
          href={`https://www.worldcubeassociation.org/persons/${delegate.wcaId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-semibold bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-700 transition-colors"
        >
          <ExternalLink size={14} />
          {t.delegates.roles.role.profile}
        </a>
      </div>
    </div>
  );
}

// ─── Trainee delegate card ────────────────────────────────────────────────────

function TraineeDelegateCard({ delegate }: { delegate: Delegate }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex flex-col items-center text-center gap-4">
        <Avatar src={delegate.avatar} name={delegate.name} />
        <div>
          <p className="font-extrabold text-gray-900 text-lg">{delegate.name}</p>
          <RoleBadge role={delegate.role} />
          <p className="text-xs text-gray-400 mt-1">
            {t.delegates.roles.role.region}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {delegate.email && (
          <a
            href={`mailto:${delegate.email}`}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          >
            <Mail size={14} />
            Contact
          </a>
        )}
        <a
          href={`https://www.worldcubeassociation.org/persons/${delegate.wcaId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-semibold bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-700 transition-colors"
        >
          <ExternalLink size={14} />
          {t.delegates.roles.role.profile}
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DelegatesPage() {
  const { t } = useTranslation();
  const delegates = t.delegates;
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gray-950 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {delegates.hero.title}
          </h1>
          <p className="text-gray-400 text-base max-w-lg leading-relaxed">
            {delegates.hero.subtitle}
          </p>
        </div>
      </section>

      {/* What is a WCA Delegate */}
      <section className="px-6 pb-16 max-w-5xl mx-auto mt-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mt-4 mb-3">
          {delegates.info.title}
        </h2>
        <p className="text-gray-600 text-md leading-relaxed mb-4">
          {delegates.info.description}
        </p>
        <ul className="space-y-2">
          {delegates.info.responsibilities.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-md text-gray-600"
            >
              <span className="mt-1 w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Team header */}
      <section className="px-6 py-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {delegates.roles.heading}
        </h2>
      </section>

      {/* Junior Delegates */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-extrabold text-gray-900">
            {delegates.roles.role.junior}
          </h3>
          <div className="flex-1 h-px bg-yellow-400" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {JUNIOR_DELEGATES.map((d) => (
            <JuniorDelegateCard key={d.id} delegate={d} />
          ))}
        </div>
      </section>

      {/* Trainee Delegates */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-extrabold text-gray-900">
            {delegates.roles.role.trainee}
          </h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {TRAINEE_DELEGATES.map((d) => (
            <TraineeDelegateCard key={d.id} delegate={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
