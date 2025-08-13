import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import DropsSection from "@/components/drops-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <DropsSection />
    </div>
  );
}