export default function BrandStory() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
              Innovation in Motion
            </h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              PRZMO represents the intersection of cutting-edge technology and street-inspired design.
              Every piece is engineered for the modern athlete who demands both performance and style.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From our signature moisture-wicking fabrics to our revolutionary fit technology,
              we're redefining what athletic wear can be. Join the movement of athletes who refuse to compromise.
            </p>
            <button className="bg-przmo-red text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-red-600 transition-colors duration-300">
              Learn Our Story
            </button>
          </div>

          {/* Image */}
          <div className="animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Athletic design innovation process"
              className="w-full h-96 object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
