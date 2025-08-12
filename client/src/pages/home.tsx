import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import DropsSection from "@/components/drops-section";
import BrandStory from "@/components/brand-story";
import Footer from "@/components/footer";
import ComingSoonModal from "@/components/coming-soon-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <DropsSection />
      <BrandStory />
      <Footer />
      <ComingSoonModal />
    </div>
  );
}
