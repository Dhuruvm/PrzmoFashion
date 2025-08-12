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
    <section id="drops" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text">
              Latest Drop
            </h2>
            <div className="w-24 h-1 bg-przmo-red mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge athletic wear designed for the next generation of athletes. 
            <span className="text-przmo-red font-semibold"> Limited quantities available.</span>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id} className="group relative animate-slide-up">
              {/* Product Card */}
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-gray-200">
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white ${
                      product.badge === 'NEW' ? 'bg-green-500' :
                      product.badge === 'BESTSELLER' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      favorites.includes(product.id) 
                        ? 'text-przmo-red fill-current' 
                        : 'text-gray-400 hover:text-przmo-red'
                    }`}
                  />
                </button>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                    <button className="bg-white text-black p-3 rounded-full hover:bg-przmo-red hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="bg-przmo-red text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">(247 reviews)</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-przmo-red transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Colors */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colors:</span>
                    <div className="flex space-x-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-black text-black">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-semibold">
                        SAVE {Math.round(((parseInt(product.originalPrice.slice(1)) - parseInt(product.price.slice(1))) / parseInt(product.originalPrice.slice(1))) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-black to-gray-800 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:from-przmo-red hover:to-red-600 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl">
            <span>Explore All Drops</span>
            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
