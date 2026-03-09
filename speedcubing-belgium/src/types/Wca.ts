export interface WCACompetition {
  id: string;
  name: string;
  venue: string;
  country: string;
  countryIso2: string;
  city: string;
  startDate: string;
  endDate: string;
  events: string[];
  wcaDelegate: string;
  organisers: string[];
  competitorLimit: number | null;
  registrationOpen: string;
  registrationClose: string;
  url: string;
}

export interface WCACompetitionsResponse {
  items: WCACompetition[];
  pagination: {
    currentPage: number;
    firstPage: number;
    lastPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}

// Derived type used in the UI — enriched from raw API data
export interface Competition {
  id: string;
  name: string;
  date: string;          // formatted display string
  startDate: Date;
  endDate: Date;
  venue: string;
  city: string;
  events: string[];
  competitorLimit: number | null;
  registrationOpen: Date;
  registrationClose: Date;
  url: string;
  isRegistrationOpen: boolean;
  isUpcoming: boolean;
}