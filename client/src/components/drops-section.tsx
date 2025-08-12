import { useState } from "react";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  alt: string;
  badge?: string;
  rating: number;
  colors: string[];
}

export default function DropsSection() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Performance Hoodie",
      description: "Premium athletic hoodie with moisture-wicking technology",
      price: "$89",
      originalPrice: "$120",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Athletic performance hoodie",
      badge: "BESTSELLER",
      rating: 4.8,
      colors: ["#000000", "#1F2937", "#DC2626"]
    },
    {
      id: 2,
      name: "Motion Runners",
      description: "Lightweight performance running shoes with responsive cushioning",
      price: "$149",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Performance running shoes",
      badge: "NEW",
      rating: 4.9,
      colors: ["#FFFFFF", "#000000", "#EF4444"]
    },
    {
      id: 3,
      name: "Urban Tech Jacket",
      description: "Weather-resistant jacket with modern street aesthetic",
      price: "$199",
      image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "Urban tech jacket",
      badge: "LIMITED",
      rating: 4.7,
      colors: ["#000000", "#374151", "#059669"]
    }
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section id="drops" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Nike Style */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-2">
            Featured
          </h2>
        </div>

        {/* Product Grid - Nike Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-4 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                {/* Product Name */}
                <h3 className="text-black font-medium">
                  {product.name}
                </h3>
                
                {/* Category */}
                <p className="text-gray-500 text-sm">
                  {product.description}
                </p>

                {/* Colors Count */}
                <p className="text-gray-500 text-sm">
                  {product.colors.length} Color{product.colors.length > 1 ? 's' : ''}
                </p>

                {/* Price */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-black font-medium">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Products Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-black mb-8">
            Don't Miss
          </h2>
          
          {/* Large Feature Product */}
          <div className="relative w-full h-96 md:h-[500px] mb-8">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Athletic training gear"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl md:text-5xl font-black mb-4">
                TRAIN LIKE
                <br />
                A CHAMPION
              </h3>
              <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
                Shop Training
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
