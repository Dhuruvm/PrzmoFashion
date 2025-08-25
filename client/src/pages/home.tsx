import Navigation from "@/components/navigation";
import DropsSection from "@/components/drops-section";
import Footer from "@/components/footer";

// Promotional Banner Component
function PromotionalBanner() {
  return (
    <div className="bg-black text-white text-center py-3 text-sm font-medium tracking-wide">
      SALE ENDS TODAY | FREE SHIPPING
    </div>
  );
}

// New Divine Conflict Hero Section matching the screenshot
function DivineConflictHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black flex items-center justify-center">
      {/* Background with subtle pattern/texture */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-light text-white mb-16 tracking-[0.3em]">
          DIVINE CONFLICT
        </h1>
        
        {/* Three Character Showcase */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Character 1 - Subtle */}
          <div className="text-center">
            <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop"
                alt="Subtle Character"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-sm font-light tracking-widest">Subtle</p>
          </div>
          
          {/* Character 2 - Anime */}
          <div className="text-center">
            <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop"
                alt="Anime Character"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-sm font-light tracking-widest">Anime</p>
          </div>
          
          {/* Character 3 - Inspired */}
          <div className="text-center">
            <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop"
                alt="Inspired Character"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-sm font-light tracking-widest">Inspired</p>
          </div>
        </div>
        
        {/* Clothing Label */}
        <p className="text-white text-lg font-light tracking-[0.3em] mb-8">Clothing</p>
        
        {/* Shop All Button */}
        <button 
          onClick={() => document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-transparent border-2 border-white text-white px-12 py-4 font-medium tracking-widest hover:bg-white hover:text-black transition-all duration-300"
        >
          SHOP ALL
        </button>
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              MORE THAN ATHLETIC WEAR
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              PRZMO represents the fusion of performance and lifestyle. We don't just create athletic wear; 
              we craft experiences that empower athletes to push beyond their limits.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-2">2024</h4>
                <p className="text-gray-400">Founded</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-2">50K+</h4>
                <p className="text-gray-400">Athletes Trust Us</p>
              </div>
            </div>
            <button className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors">
              Our Story
            </button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=700&fit=crop" 
              alt="PRZMO Brand Story"
              className="rounded-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PromotionalBanner />
      <Navigation />
      <DivineConflictHero />
      <DropsSection />
      <BrandStorySection />
      <Footer />
    </div>
  );
}