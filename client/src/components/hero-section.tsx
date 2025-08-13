export default function HeroSection() {
  const scrollToDrops = () => {
    document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-16 bg-white">
      {/* Main Hero Image */}
      <div className="relative w-full h-screen">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Athletic running gear"
          className="w-full h-full object-cover"
        />
        
        {/* Content Overlay - Nike Style Typography */}
        <div className="absolute bottom-12 left-8 md:left-16 text-white max-w-lg">
          <p className="text-sm md:text-lg font-light mb-4 tracking-widest uppercase">PRZMO ATHLETIC</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 tracking-tight">
            MORE CHOICE.
            <br />
            MORE RUNNING.
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed font-light max-w-md">
            Performance-driven athletic wear designed for the modern lifestyle. Engineered for excellence.
          </p>
          <button 
            onClick={scrollToDrops}
            className="bg-white text-black px-8 py-4 font-medium text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 tracking-wide"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      </div>
    </section>
  );
}
