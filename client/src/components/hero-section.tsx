import { ChevronDown, Play, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const scrollToDrops = () => {
    document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Athletic lifestyle fashion"
          className="w-full h-full object-cover opacity-70"
        />
        {/* Animated overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-2 h-2 bg-przmo-red rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-white rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/3 left-8 w-1 h-16 bg-gradient-to-b from-przmo-red to-transparent opacity-50"></div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto animate-fade-in">
        {/* Pre-logo text */}
        <div className="mb-4 animate-slide-up">
          <span className="inline-block border border-white/30 rounded-full px-6 py-2 text-sm font-medium uppercase tracking-widest backdrop-blur-sm bg-white/10">
            Premium Athletic Lifestyle
          </span>
        </div>

        {/* PRZMO Symbol/Logo */}
        <div className="mb-8 relative">
          <h1 className="przmo-logo text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tight mb-6 relative">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              PRZMO
            </span>
            {/* Glitch effect overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-przmo-red to-red-400 bg-clip-text text-transparent animate-pulse opacity-20">
              PRZMO
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-przmo-red to-transparent mx-auto animate-pulse"></div>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-wide leading-tight">
          <span className="inline-block animate-slide-up" style={{ animationDelay: '0.2s' }}>Own</span>
          <span className="inline-block mx-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>the</span>
          <span className="inline-block text-przmo-red animate-slide-up" style={{ animationDelay: '0.6s' }}>Motion</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.8s' }}>
          Engineered for athletes who demand performance without compromising style. 
          <br />Join the next generation of athletic excellence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '1s' }}>
          <button
            onClick={scrollToDrops}
            className="group relative inline-flex items-center space-x-3 bg-przmo-red text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-red-600 transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-przmo-red/25"
          >
            <span>Shop the Drop</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button className="group inline-flex items-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm bg-white/10">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Watch Story</span>
          </button>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs uppercase tracking-widest opacity-75">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>

      {/* Side Elements */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col space-y-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
          <div className="text-white text-sm font-medium tracking-widest vertical-text transform -rotate-90 whitespace-nowrap">
            ATHLETIC EXCELLENCE
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
