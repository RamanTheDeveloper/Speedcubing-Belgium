import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}