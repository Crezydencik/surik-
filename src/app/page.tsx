import AboutSection from "../components/home/about";
import MissionSection from "../components/home/mission";
import FAQ from "../components/home/faq";
import Catalogsmini from "../components/home/catalogsmini";
import HeroSection from "../components/home/hero";
import PartnersRow from "../components/home/partners";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <Catalogsmini />
      <PartnersRow />
      <FAQ />
    </div>
  );
}
