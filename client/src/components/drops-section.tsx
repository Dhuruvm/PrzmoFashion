import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  alt: string;
}

export default function DropsSection() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Performance Hoodie",
      description: "Premium athletic hoodie with moisture-wicking technology",
      price: "$89",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Athletic performance hoodie"
    },
    {
      id: 2,
      name: "Motion Runners",
      description: "Lightweight performance running shoes with responsive cushioning",
      price: "$149",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Performance running shoes"
    },
    {
      id: 3,
      name: "Urban Tech Jacket",
      description: "Weather-resistant jacket with modern street aesthetic",
      price: "$199",
      image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Urban tech jacket"
    }
  ]);

  return (
    <section id="drops" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
            Latest Drop
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium athletic wear engineered for performance and style. Limited quantities available.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer animate-slide-up">
              <div className="relative overflow-hidden bg-gray-100 aspect-square mb-4">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-black px-6 py-2 font-bold uppercase tracking-wider hover:bg-przmo-red hover:text-white transition-colors duration-300">
                    Quick View
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-2xl font-black text-black">{product.price}</p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="border-2 border-black text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
            View All Drops
          </button>
        </div>
      </div>
    </section>
  );
}
