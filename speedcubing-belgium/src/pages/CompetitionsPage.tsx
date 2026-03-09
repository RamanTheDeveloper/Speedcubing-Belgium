import CompetitionsHero from "../components/competitions/CompetitionsHero";
import CompetitionsList from "../components/competitions/CompetitionList";
import FirstTimeCompeting from "../components/competitions/FirstTimeCompeting";

export default function CompetitionsPage() {
  return (
    <main>
      <CompetitionsHero />
      <CompetitionsList />
      <FirstTimeCompeting />
    </main>
  );
}