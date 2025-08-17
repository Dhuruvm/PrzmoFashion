/**
 * Optimized DropsSection Component - Production Ready
 * Enhanced with performance optimizations, error handling, and accessibility
 */
import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/cart-context';
import { ProductCard } from '@/components/enhanced/product-card';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { performanceMonitor, debounce } from '@/utils/performance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';

// Lazy load the OrderModal to reduce initial bundle size
const OrderModal = lazy(() => import('@/components/order-modal'));

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
  badge?: string;
  category?: string;
}

interface FilterOptions {
  category: string;
  priceRange: string;
  size: string;
  availability: string;
}

const INITIAL_PRODUCTS: Product[] = [
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
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "New Arrival",
    category: "womens"
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
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "womens"
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
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Bestseller",
    category: "mens"
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
    sizes: ["S", "M", "L", "XL"],
    category: "mens"
  }
];

export default function OptimizedDropsSection() {
  // State management
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priceRange: 'all',
    size: 'all',
    availability: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [orderModal, setOrderModal] = useState<{isOpen: boolean, product: Product | null}>({
    isOpen: false,
    product: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Performance tracking
  const trackRender = performanceMonitor.trackComponentRender('OptimizedDropsSection');
  React.useEffect(() => trackRender(), [trackRender]);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Availability filter
    if (filters.availability !== 'all') {
      if (filters.availability === 'in-stock') {
        filtered = filtered.filter(product => product.inStock);
      } else if (filters.availability === 'out-of-stock') {
        filtered = filtered.filter(product => !product.inStock);
      }
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace(/[₹,\s]/g, ''));
        switch (filters.priceRange) {
          case 'under-2000':
            return price < 2000;
          case '2000-3000':
            return price >= 2000 && price <= 3000;
          case 'over-3000':
            return price > 3000;
          default:
            return true;
        }
      });
    }

    // Size filter
    if (filters.size !== 'all') {
      filtered = filtered.filter(product => product.sizes.includes(filters.size));
    }

    return filtered;
  }, [products, searchQuery, filters]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Event handlers with error handling
  const handleQuickView = useCallback((product: Product) => {
    try {
      setOrderModal({ isOpen: true, product });
    } catch (error) {
      console.error('Quick view error:', error);
      setError('Failed to open product details');
    }
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setOrderModal({ isOpen: false, product: null });
  }, []);

  const handleToggleFavorite = useCallback((productId: number) => {
    try {
      setFavorites(prev => {
        const isCurrentlyFavorite = prev.includes(productId);
        if (isCurrentlyFavorite) {
          return prev.filter(id => id !== productId);
        } else {
          return [...prev, productId];
        }
      });
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast({
        title: 'Error',
        description: 'Unable to update favorites. Please try again.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handleFilterChange = useCallback((filterType: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      size: 'all',
      availability: 'all'
    });
    setSearchQuery('');
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="drops" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                data-testid={`loading-card-${index}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="drops" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => setError(null)}>Try Again</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary>
      <section id="drops" className="py-16 bg-gray-50" data-testid="drops-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-black mb-4">
              Latest Drops
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our newest athletic wear collection, designed for peak performance and street-style aesthetics.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  data-testid="search-input"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger className="w-32" data-testid="category-filter">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="mens">Men's</SelectItem>
                    <SelectItem value="womens">Women's</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                >
                  <SelectTrigger className="w-32" data-testid="price-filter">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-2000">Under ₹2,000</SelectItem>
                    <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                    <SelectItem value="over-3000">Over ₹3,000</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.availability}
                  onValueChange={(value) => handleFilterChange('availability', value)}
                >
                  <SelectTrigger className="w-32" data-testid="availability-filter">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                  data-testid="clear-filters"
                >
                  Clear All
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active filters display */}
            {(searchQuery || Object.values(filters).some(v => v !== 'all')) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    Search: "{searchQuery}"
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => 
                  value !== 'all' && (
                    <span
                      key={key}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm capitalize"
                    >
                      {key}: {value.replace('-', ' ')}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
                data-testid="no-results-clear-button"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div 
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
              data-testid="products-container"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                  onAddToWishlist={handleToggleFavorite}
                  isWishlisted={favorites.includes(product.id)}
                  className={viewMode === 'list' ? 'flex flex-row space-x-4' : ''}
                />
              ))}
            </div>
          )}

          {/* Results summary */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Order Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <OrderModal
            isOpen={orderModal.isOpen}
            onClose={handleCloseOrderModal}
            product={orderModal.product}
          />
        </Suspense>
      </section>
    </ErrorBoundary>
  );
}