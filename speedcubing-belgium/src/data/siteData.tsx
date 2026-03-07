import { Trophy, Star, Users } from "lucide-react";
import type { NavLink, Stat, Service, FooterColumn } from "../types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home",         href: "#" },
  { label: "About Us",     href: "#about" },
  { label: "Competitions", href: "#competitions" },
  { label: "Records",      href: "#records" },
  { label: "Delegates",    href: "#delegates" },
];

export const STATS: Stat[] = [
  { value: "500+", label: "Active Cubers" },
  { value: "50+",  label: "Competitions to Date" },
  { value: "15+",  label: "Official Events" },
  { value: "14",   label: "Years Active" },
];

export const SERVICES: Service[] = [
  {
    icon: Trophy,
    title: "Organize Competitions",
    description:
      "We organize official WCA competitions across Belgium, ensuring fair play and professional event management.",
  },
  {
    icon: Star,
    title: "Promote Speedcubing",
    description:
      "We work to raise awareness about speedcubing through demonstrations, workshops, and community outreach.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "We foster a welcoming community where cubers can meet, share techniques, and support each other's growth.",
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "WCA Competition",       href: "#" },
      { label: "Become a Member",       href: "#" },
      { label: "Organize a Competition",href: "#" },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      { label: "info@speedcubing.be", href: "mailto:info@speedcubing.be" },
    ],
  },
];