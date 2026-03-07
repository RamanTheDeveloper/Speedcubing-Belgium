import Hero from "../components/home/Hero";
import StatsBar from "../components/home/Statsbar";
import AboutSection from "../components/home/About";
import WhatWeDoSection from "../components/home/Whatwedo";
import JoinCTA from "../components/home/Join";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <AboutSection />
      <WhatWeDoSection />
      <JoinCTA />
    </main>
  );
}