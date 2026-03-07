import AboutHero from "../components/about/AboutHero";
import Timeline from "../components/about/Timeline";
import MissionStatement from "../components/about/Mission";
import GetInvolved from "../components/about/GetInvolved";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <Timeline />
      <MissionStatement />
      <GetInvolved />
    </main>
  );
}