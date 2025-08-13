import { useState } from "react";
import { ShoppingBag, Heart, Plus } from "lucide-react";
import OrderModal from "./order-modal";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  alt: string;
  colors: number;
  inStock: boolean;
  sizes: string[];
}

export default function DropsSection() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "PRZMO Sportswear Chill Poplin",
      description: "Women's Striped Boxy Top",
      price: "₹ 2,995.00",
      originalPrice: "₹ 3,495.00",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's striped boxy top",
      colors: 2,
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "PRZMO Sportswear",
      description: "Women's T-shirt",
      price: "₹ 2,195.00",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Women's black t-shirt",
      colors: 3,
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "PRZMO Performance Hoodie",
      description: "Unisex Athletic Wear",
      price: "₹ 3,495.00",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Performance hoodie",
      colors: 3,
      inStock: true,
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 4,
      name: "PRZMO Training Shorts",
      description: "Men's Athletic Shorts",
      price: "₹ 1,795.00",
      originalPrice: "₹ 2,295.00",
      image: "https://images.unsplash.com/photo-1506629905607-d405b8fc7aab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      alt: "PRZMO Training shorts",
      colors: 3,
      inStock: false,
      sizes: ["S", "M", "L", "XL"]
    }
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [orderModal, setOrderModal] = useState<{isOpen: boolean, product: Product | null}>({
    isOpen: false,
    product: null
  });
  const { addToCart } = useCart();

  const openOrderModal = (product: Product) => {
    setOrderModal({ isOpen: true, product });
  };

  const closeOrderModal = () => {
    setOrderModal({ isOpen: false, product: null });
  };

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product, "M"); // Default size M for quick add
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section id="drops" className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Nike Style Typography */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-black leading-none">
            DROPS
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-2 font-light">
            Latest Athletic Lifestyle Collection
          </p>
        </div>

        {/* Product Grid - Nike Double Card Style */}
        <div className="grid grid-cols-2 gap-1 md:gap-3">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer" data-testid={`product-card-${product.id}`}>
              {/* Product Image */}
              <div className="relative w-full aspect-square mb-2 md:mb-3 overflow-hidden bg-gray-50 group">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-testid={`product-image-${product.id}`}
                />
                
                {/* Badges and Actions */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                  <span className="text-orange-600 text-xs md:text-sm font-medium bg-white/90 px-2 py-1 rounded">
                    Just In
                  </span>
                </div>

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4">
                    <span className="text-red-600 text-xs md:text-sm font-medium bg-white/90 px-2 py-1 rounded">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Quick Actions - Show on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.inStock) openOrderModal(product);
                    }}
                    disabled={!product.inStock}
                    className="bg-white text-black p-2 md:p-3 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`order-now-${product.id}`}
                  >
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className={`p-2 md:p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                    data-testid={`favorite-${product.id}`}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-0.5 md:space-y-1 px-1">
                {/* Product Name */}
                <h3 className="text-black font-medium text-sm md:text-base leading-tight" data-testid={`product-name-${product.id}`}>
                  {product.name}
                </h3>
                
                {/* Category */}
                <p className="text-gray-600 text-xs md:text-sm" data-testid={`product-description-${product.id}`}>
                  {product.description}
                </p>

                {/* Colors Count */}
                <p className="text-gray-600 text-xs md:text-sm" data-testid={`product-colors-${product.id}`}>
                  {product.colors} Colour{product.colors > 1 ? 's' : ''}
                </p>

                {/* Price */}
                <div className="pt-1 md:pt-2 flex items-center gap-2">
                  <span className="text-black font-medium text-sm md:text-base" data-testid={`product-price-${product.id}`}>
                    MRP : {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-xs md:text-sm line-through">
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status & Action Buttons */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs md:text-sm font-medium ${
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Sold Out'}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => handleQuickAddToCart(product, e)}
                      disabled={!product.inStock}
                      size="sm"
                      className="flex-1 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed h-8 text-xs"
                      data-testid={`quick-add-cart-${product.id}`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Quick Add
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.inStock) openOrderModal(product);
                      }}
                      disabled={!product.inStock}
                      variant="outline"
                      size="sm"
                      className="px-3 h-8 border-black text-black hover:bg-black hover:text-white disabled:opacity-50"
                      data-testid={`order-modal-${product.id}`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product.id);
                      }}
                      variant="outline"
                      size="sm"
                      className={`px-3 h-8 ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                          : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                      }`}
                      data-testid={`favorite-toggle-${product.id}`}
                    >
                      <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Order Modal */}
      <OrderModal 
        isOpen={orderModal.isOpen}
        onClose={closeOrderModal}
        product={orderModal.product}
      />
      </div>
    </section>
  );
}