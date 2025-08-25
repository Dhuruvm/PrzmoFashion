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
      name: "BLUELOCK OVERSIZED JERSEY",
      description: "Premium Athletic Jersey",
      price: "RS. 1,399.00",
      originalPrice: "RS. 1,899.00",
      colors: 2,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop",
      alt: "BLUELOCK OVERSIZED JERSEY",
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "GOJO OVERSIZED ZIP-UP",
      description: "Premium Zip-Up Hoodie",
      price: "RS. 1,399.00",
      originalPrice: "RS. 1,799.00",
      colors: 3,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      alt: "GOJO OVERSIZED ZIP-UP",
      inStock: true,
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "SUKUNA OVERSIZED",
      description: "Premium Oversized Tee",
      price: "RS. 1,299.00",
      colors: 4,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      alt: "SUKUNA OVERSIZED",
      inStock: true,
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 4,
      name: "LIMITED EDITION",
      description: "Exclusive Collection",
      price: "RS. 1,899.00",
      colors: 2,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
      alt: "LIMITED EDITION",
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] text-black leading-none mb-2">
            SUMMER COLLECTION
          </h1>
        </div>

        {/* Simple 2x2 Grid Layout */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white overflow-hidden cursor-pointer"
              data-testid={`product-card-${product.id}`}
              onClick={(e) => {
                e.preventDefault();
                if (product.inStock) openOrderModal(product);
              }}
            >
              {/* Product Image - Square aspect ratio */}
              <div className="relative aspect-square overflow-hidden bg-[#D4A5A5]">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                  data-testid={`product-image-${product.id}`}
                />

                {/* Sold Out Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="bg-white text-black text-sm font-medium px-4 py-2 border border-black">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info - Minimal layout matching screenshot */}
              <div className="pt-4 text-center">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-black mb-2 tracking-wide" data-testid={`product-name-${product.id}`}>
                  {product.name}
                </h3>
                
                {/* Price */}
                <div className="space-y-1">
                  <div className="text-sm font-medium text-black" data-testid={`product-price-${product.id}`}>
                    {product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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