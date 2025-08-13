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
      name: "PRZMO Sportswear Chill Poplin",
      description: "Women's Striped Boxy Top",
      price: "₹2,995.00",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's striped boxy top",
      badge: "BESTSELLER",
      rating: 4.8,
      colors: ["#FFC0CB", "#FFFFFF"]
    },
    {
      id: 2,
      name: "PRZMO Sportswear",
      description: "Women's T-Shirt",
      price: "₹2,195.00",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's black t-shirt",
      badge: "NEW",
      rating: 4.6,
      colors: ["#000000", "#FFFFFF", "#808080"]
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
            New Drops
          </h2>
        </div>

        {/* Product Grid - Nike Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Product Image */}
              <div className="relative w-full h-[500px] mb-4 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Just In Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-orange-600 text-sm font-medium">Just In</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1 px-1">
                {/* Product Name */}
                <h3 className="text-black font-medium text-base leading-tight">
                  {product.name}
                </h3>
                
                {/* Category */}
                <p className="text-gray-600 text-sm">
                  {product.description}
                </p>

                {/* Colors Count */}
                <p className="text-gray-600 text-sm">
                  {product.colors.length} Colour{product.colors.length > 1 ? 's' : ''}
                </p>

                {/* Price */}
                <div className="pt-2">
                  <span className="text-black font-medium text-base">MRP : {product.price}</span>
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
              <h3 className="text-3xl md:text-5xl font-playfair font-bold mb-4 leading-tight">
                TRAIN LIKE
                <br />
                A CHAMPION
              </h3>
              <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors font-sans">
                Shop Training
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
