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
      {/* Promotional Banner */}
      <div className="bg-gray-100 py-3 text-center text-black font-medium text-sm">
        New Styles On Sale: Up To 40% Off
        <button className="ml-2 underline font-semibold hover:no-underline">
          Shop All Our New Markdowns
        </button>
      </div>
      <HeroSection />
      <DropsSection />
      <BrandStory />
      <Footer />
      <ComingSoonModal />
    </div>
  );
}
