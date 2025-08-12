import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToDrops = () => {
    document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Athletic lifestyle fashion"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
        {/* PRZMO Symbol/Logo */}
        <div className="mb-8">
          <h1 className="przmo-logo text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4">
            PRZMO
          </h1>
          <div className="w-24 h-1 bg-przmo-red mx-auto"></div>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-wide">
          Own the Motion
        </h2>

        {/* CTA Button */}
        <button
          onClick={scrollToDrops}
          className="bg-przmo-red text-white px-12 py-4 text-lg font-bold uppercase tracking-wider hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
        >
          Shop the Drop
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
