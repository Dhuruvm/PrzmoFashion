export default function BrandStory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nike-style Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Men's Section */}
          <div className="relative h-96">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Men's Athletic Gear"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-playfair font-bold mb-4">Men's</h3>
              <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors font-sans">
                Shop Men's
              </button>
            </div>
          </div>

          {/* Women's Section */}
          <div className="relative h-96">
            <img
              src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Women's Athletic Gear"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-playfair font-bold mb-4">Women's</h3>
              <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors font-sans">
                Shop Women's
              </button>
            </div>
          </div>
        </div>

        {/* Kids Section */}
        <div className="relative h-96 mb-12">
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600"
            alt="Kids Athletic Gear"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-4xl font-playfair font-bold mb-2">Kids</h3>
            <p className="text-lg mb-4 font-cormorant">Gear designed for the next generation</p>
            <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors font-sans">
              Shop Kids
            </button>
          </div>
        </div>

        {/* Simple Text Section */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-playfair font-bold text-black mb-6">
            Movement is Life
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-cormorant">
            From the track to the street, PRZMO delivers performance-driven athletic wear 
            that moves with you. Every piece is crafted for those who refuse to slow down.
          </p>
        </div>
      </div>
    </section>
  );
}
