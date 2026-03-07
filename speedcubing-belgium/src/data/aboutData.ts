export interface TimelineEvent {
  year: string;
  shortYear: string;
  title: string;
  description: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2009",
    shortYear: "09",
    title: "The Beginning",
    description:
      "Speedcubing Belgium was founded by passionate cubers who wanted to create an organized structure for competitive cubing in Belgium.",
  },
  {
    year: "2010",
    shortYear: "10",
    title: "First Major Competition",
    description:
      "We hosted our first large-scale WCA competition, bringing together cubers from across the country.",
  },
  {
    year: "2014",
    shortYear: "14",
    title: "Community Growth",
    description:
      "Our community expanded significantly, with new delegates joining and more competitions being organized nationwide.",
  },
  {
    year: "2018",
    shortYear: "18",
    title: "Record Breaking Year",
    description:
      "Belgian cubers achieved multiple national records, putting Belgium on the map in the international speedcubing scene.",
  },
  {
    year: "2023",
    shortYear: "23",
    title: "Expanding Horizons",
    description:
      "We introduced new event formats and expanded our reach to underrepresented regions in Belgium.",
  },
  {
    year: "2026",
    shortYear: "26",
    title: "Today",
    description:
      "We proudly serve hundreds of active competitors and continue to grow the Belgian speedcubing community.",
  },
];