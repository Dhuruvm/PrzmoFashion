import { useState, useRef } from "react";
import { ShoppingBag, Heart, Plus } from "lucide-react";
import OrderModal from "./order-modal";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  colors: number;
  image: string;
  alt: string;
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
      colors: 2,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop",
      alt: "PRZMO Sportswear Chill Poplin",
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "PRZMO Sportswear Women's T-shirt",
      description: "Premium Cotton Essential",
      price: "₹ 2,195.00",
      colors: 3,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      alt: "PRZMO Sportswear Women's T-shirt",
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "PRZMO Training Hoodie",
      description: "Men's Performance Fleece",
      price: "₹ 3,495.00",
      colors: 4,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      alt: "PRZMO Training Hoodie",
      inStock: true,
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 4,
      name: "PRZMO Training Shorts",
      description: "Men's Athletic Performance",
      price: "₹ 1,895.00",
      colors: 2,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
      alt: "PRZMO Training Shorts",
      inStock: false,
      sizes: ["S", "M", "L", "XL"]
    }
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [orderModal, setOrderModal] = useState<{isOpen: boolean, product: Product | null}>({
    isOpen: false,
    product: null
  });
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();
  const { toast } = useToast();
  const cartButtonRefs = useRef<{[key: number]: HTMLButtonElement | null}>({});

  const openOrderModal = (product: Product) => {
    setOrderModal({ isOpen: true, product });
  };

  const closeOrderModal = () => {
    setOrderModal({ isOpen: false, product: null });
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    // Start animation
    setAnimatingItems(prev => new Set(Array.from(prev).concat([product.id])));
    
    // Get button position for animation
    const button = cartButtonRefs.current[product.id];
    if (button) {
      // Create floating animation element
      const rect = button.getBoundingClientRect();
      const animationElement = document.createElement('div');
      animationElement.innerHTML = `
        <div class="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Added to Cart!
        </div>
      `;
      animationElement.style.position = 'fixed';
      animationElement.style.left = `${rect.left + rect.width / 2 - 60}px`;
      animationElement.style.top = `${rect.top - 50}px`;
      animationElement.style.zIndex = '9999';
      animationElement.style.pointerEvents = 'none';
      animationElement.style.animation = 'cartAddAnimation 2s ease-out forwards';
      
      document.body.appendChild(animationElement);
      
      // Remove animation element after animation completes
      setTimeout(() => {
        if (document.body.contains(animationElement)) {
          document.body.removeChild(animationElement);
        }
      }, 2000);
    }
    
    // Add to cart
    addToCart(product, "M"); // Default size M for quick add
    
    // Show toast notification
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    });
    
    // End animation after delay
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 1000);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section id="drops" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black leading-none mb-4">
            DROPS
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Latest Athletic Lifestyle Collection
          </p>
        </div>

        {/* Products Grid - Enhanced Double Card Layout for Mobile & Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => {
            // Create alternating double-wide pattern: wide-narrow-narrow-wide
            const isDoubleWide = index % 4 === 0 || index % 4 === 3;
            
            return (
              <div
                key={product.id}
                className={`group bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isDoubleWide 
                    ? 'sm:col-span-2 lg:col-span-2' 
                    : 'sm:col-span-1 lg:col-span-1'
                }`}
                data-testid={`product-card-${product.id}`}
              >
              {/* Product Image - Enhanced responsive aspect ratio */}
              <div className={`relative overflow-hidden bg-gray-50 ${
                isDoubleWide 
                  ? 'aspect-[4/3] sm:aspect-[3/2] lg:aspect-[5/3]' 
                  : 'aspect-square'
              }`}>
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  data-testid={`product-image-${product.id}`}
                />
                
                {/* Just In Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Just In
                  </span>
                </div>

                {/* Sold Out Badge */}
                {!product.inStock && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.inStock) openOrderModal(product);
                    }}
                    disabled={!product.inStock}
                    className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                    data-testid={`order-now-${product.id}`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                    data-testid={`favorite-${product.id}`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Info - Enhanced for double layout */}
              <div className={`space-y-4 ${isDoubleWide ? 'p-8' : 'p-6'}`}>
                {/* Product Name */}
                <h3 className={`font-bold text-black leading-tight ${
                  isDoubleWide ? 'text-2xl lg:text-3xl' : 'text-xl'
                }`} data-testid={`product-name-${product.id}`}>
                  {product.name}
                </h3>
                
                {/* Product Description */}
                <p className={`text-gray-600 ${
                  isDoubleWide ? 'text-base lg:text-lg' : 'text-sm'
                }`} data-testid={`product-description-${product.id}`}>
                  {product.description}
                </p>

                {/* Colors Count */}
                <p className="text-gray-500 text-sm" data-testid={`product-colors-${product.id}`}>
                  {product.colors} Colour{product.colors > 1 ? 's' : ''}
                </p>

                {/* Price - Enhanced for double cards */}
                <div className="flex items-center gap-3">
                  <span className={`text-black font-bold ${
                    isDoubleWide ? 'text-2xl lg:text-3xl' : 'text-xl'
                  }`} data-testid={`product-price-${product.id}`}>
                    MRP : {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className={`text-gray-500 line-through ${
                      isDoubleWide ? 'text-base lg:text-lg' : 'text-sm'
                    }`}>
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="pt-2">
                  <span className={`text-sm font-semibold ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
                
                {/* Action Buttons - Enhanced for double cards */}
                <div className={`flex gap-3 pt-4 ${isDoubleWide ? 'flex-col lg:flex-row' : ''}`}>
                  <Button
                    ref={(el) => cartButtonRefs.current[product.id] = el}
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.inStock}
                    className={`bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ${
                      isDoubleWide 
                        ? 'flex-1 h-14 lg:h-12 text-lg lg:text-base' 
                        : 'flex-1 h-12'
                    } ${
                      animatingItems.has(product.id) ? 'cart-button-animating' : ''
                    }`}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <Plus className={`mr-2 ${isDoubleWide ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.inStock) openOrderModal(product);
                    }}
                    disabled={!product.inStock}
                    variant="outline"
                    className={`border-2 border-black text-black hover:bg-black hover:text-white disabled:opacity-50 font-semibold ${
                      isDoubleWide 
                        ? 'flex-1 lg:px-6 h-14 lg:h-12 text-lg lg:text-base' 
                        : 'px-6 h-12'
                    }`}
                    data-testid={`order-modal-${product.id}`}
                  >
                    <ShoppingBag className={`${isDoubleWide ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    variant="outline"
                    className={`border-2 font-semibold ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                        : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                    } ${
                      isDoubleWide 
                        ? 'flex-1 lg:px-6 h-14 lg:h-12 text-lg lg:text-base' 
                        : 'px-6 h-12'
                    }`}
                    data-testid={`favorite-toggle-${product.id}`}
                  >
                    <Heart className={`${isDoubleWide ? 'w-5 h-5' : 'w-4 h-4'} ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </Button>

                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModal.isOpen}
        onClose={closeOrderModal}
        product={orderModal.product}
      />
    </section>
  );
}