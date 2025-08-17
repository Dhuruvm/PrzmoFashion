/**
 * Enhanced Product Card Component for PRZMO Athletic Lifestyle App
 * Production-ready with accessibility, performance optimization, and error handling
 */
import React, { memo, useState, useCallback } from 'react';
import { Heart, ShoppingBag, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/cart-context';
import { cn } from '@/lib/utils';
import { performanceMonitor } from '@/utils/performance';

interface ProductCardProps {
  /** Product data */
  product: {
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
    badge?: string;
  };
  /** Callback when product is clicked for quick view */
  onQuickView?: (product: ProductCardProps['product']) => void;
  /** Callback when add to wishlist is clicked */
  onAddToWishlist?: (productId: number) => void;
  /** Whether product is in wishlist */
  isWishlisted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
}

/**
 * ProductCard component displays a single product with interactive features
 * Optimized for performance with memoization and proper event handling
 */
export const ProductCard = memo<ProductCardProps>(({
  product,
  onQuickView,
  onAddToWishlist,
  isWishlisted = false,
  className,
  loading = false,
  error
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Performance tracking
  const trackRender = performanceMonitor.trackComponentRender('ProductCard');
  React.useEffect(() => trackRender(), [trackRender]);

  // Handlers with proper error handling
  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    console.warn(`Failed to load image for product ${product.id}: ${product.image}`);
  }, [product.id, product.image]);

  const handleQuickView = useCallback(() => {
    try {
      onQuickView?.(product);
    } catch (error) {
      console.error('Quick view error:', error);
      toast({
        title: 'Error',
        description: 'Unable to open product details. Please try again.',
        variant: 'destructive'
      });
    }
  }, [onQuickView, product, toast]);

  const handleAddToWishlist = useCallback(() => {
    try {
      onAddToWishlist?.(product.id);
      toast({
        title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
      });
    } catch (error) {
      console.error('Wishlist error:', error);
      toast({
        title: 'Error',
        description: 'Unable to update wishlist. Please try again.',
        variant: 'destructive'
      });
    }
  }, [onAddToWishlist, product.id, product.name, isWishlisted, toast]);

  const handleQuickAdd = useCallback(() => {
    try {
      if (!product.inStock) {
        toast({
          title: 'Out of Stock',
          description: 'This item is currently out of stock.',
          variant: 'destructive'
        });
        return;
      }

      // Add with default size (first available)
      const defaultSize = product.sizes[0];
      addToCart(product, defaultSize);
      
      toast({
        title: 'Added to Cart',
        description: `${product.name} (Size: ${defaultSize}) added to your cart.`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: 'Error',
        description: 'Unable to add item to cart. Please try again.',
        variant: 'destructive'
      });
    }
  }, [product, addToCart, toast]);

  // Error state
  if (error) {
    return (
      <div 
        className={cn(
          'aspect-square bg-gray-100 rounded-lg flex items-center justify-center',
          className
        )}
        data-testid={`product-card-error-${product.id}`}
      >
        <div className="text-center p-4">
          <p className="text-sm text-gray-500">Unable to load product</p>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div 
        className={cn(
          'aspect-square bg-gray-100 rounded-lg animate-pulse',
          className
        )}
        data-testid={`product-card-loading-${product.id}`}
      >
        <div className="space-y-4 p-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'group relative bg-white rounded-lg overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`product-card-${product.id}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.alt}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              'group-hover:scale-110',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            data-testid={`product-image-${product.id}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Image unavailable</span>
          </div>
        )}
        
        {/* Loading skeleton */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Badge */}
        {product.badge && (
          <Badge 
            className="absolute top-3 left-3 bg-primary text-primary-foreground"
            data-testid={`product-badge-${product.id}`}
          >
            {product.badge}
          </Badge>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Action buttons overlay */}
        <div 
          className={cn(
            'absolute inset-0 bg-black/40 flex items-center justify-center gap-2',
            'transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            onClick={handleQuickView}
            disabled={!product.inStock}
            aria-label={`Quick view ${product.name}`}
            data-testid={`button-quick-view-${product.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            onClick={handleAddToWishlist}
            aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart 
              className={cn(
                'h-4 w-4',
                isWishlisted ? 'fill-red-500 text-red-500' : ''
              )} 
            />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Quick add ${product.name} to cart`}
            data-testid={`button-quick-add-${product.id}`}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className="font-medium text-sm text-gray-900 line-clamp-2"
              data-testid={`product-name-${product.id}`}
            >
              {product.name}
            </h3>
            <p 
              className="text-xs text-gray-500 line-clamp-1"
              data-testid={`product-description-${product.id}`}
            >
              {product.description}
            </p>
          </div>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {product.colors} {product.colors === 1 ? 'Color' : 'Colors'}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(product.colors, 4) }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gray-300 border border-gray-200"
              />
            ))}
            {product.colors > 4 && (
              <span className="text-xs text-gray-400">+{product.colors - 4}</span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span 
            className="font-semibold text-sm text-gray-900"
            data-testid={`product-price-${product.id}`}
          >
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Sizes */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Sizes:</span>
          <span>{product.sizes.join(', ')}</span>
        </div>

        {/* Quick add button (always visible on mobile) */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 md:hidden"
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          data-testid={`button-mobile-quick-add-${product.id}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';