import RecordsHero from "../components/records/RecordsHero";
import RecordsTable from "../components/records/RecordsTable";
import RecordsInfo from "../components/records/RecordsInfo";

export default function RecordsPage() {
  return (
    <main>
      <RecordsHero />
      <RecordsTable />
      <RecordsInfo />
    </main>
  );
}