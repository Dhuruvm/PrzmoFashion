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
        
        {/* Content Overlay - Bottom Left */}
        <div className="absolute bottom-12 left-8 md:left-16 text-white max-w-md">
          <p className="text-lg font-medium mb-2">PRZMO Running</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tight">
            MORE CHOICE.
            <br />
            MORE RUNNING.
          </h1>
          <p className="text-lg mb-6 leading-relaxed opacity-90">
            Pegasus. Vomero. Structure. Three updated
          </p>
          <button 
            onClick={scrollToDrops}
            className="bg-white text-black px-6 py-3 font-medium text-sm hover:bg-gray-100 transition-colors duration-200"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
