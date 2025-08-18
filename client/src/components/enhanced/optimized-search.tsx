import { useState, useMemo, memo } from "react";
import { Search, X, Filter, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOptimizedSearch, debounce } from "@/utils/performance-optimizer";

interface OptimizedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  products?: any[];
}

// Mock products for demonstration - in real app, fetch from API
const sampleProducts = [
  { id: 1, name: "PRZMO Athletic Shorts", category: "Activewear", price: "₹ 1,995", keywords: ["shorts", "athletic", "sports"] },
  { id: 2, name: "Performance Tank Top", category: "Tops", price: "₹ 1,495", keywords: ["tank", "performance", "workout"] },
  { id: 3, name: "Training Joggers", category: "Bottoms", price: "₹ 2,495", keywords: ["joggers", "training", "comfort"] },
  { id: 4, name: "Sport Jacket", category: "Outerwear", price: "₹ 3,995", keywords: ["jacket", "sport", "weather"] }
];

const OptimizedSearch = memo(({ isOpen, onClose, products = sampleProducts }: OptimizedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search to improve performance
  const debouncedSetQuery = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      setIsSearching(false);
    }, 300),
    []
  );

  const handleInputChange = (value: string) => {
    setIsSearching(true);
    debouncedSetQuery(value);
  };

  // Use optimized search hook
  const filteredProducts = useOptimizedSearch(products, searchQuery);
  
  // Further filter by category if selected
  const finalResults = useMemo(() => {
    if (!selectedCategory) return filteredProducts;
    return filteredProducts.filter(product => product.category === selectedCategory);
  }, [filteredProducts, selectedCategory]);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const categorySet = new Set(products.map(product => product.category));
    return Array.from(categorySet);
  }, [products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Advanced search for:", searchQuery, "Category:", selectedCategory);
      // In real app, navigate to search results page or filter products
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setIsSearching(false);
    onClose();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] p-0" aria-describedby="search-description">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-black">Search Products</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2"
              data-testid="button-close-search"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogDescription id="search-description">
            Search through our product catalog with advanced filters
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                onChange={(e) => handleInputChange(e.target.value)}
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-przmo-red rounded-lg"
                data-testid="input-search-query"
                autoFocus
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Categories:</span>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-przmo-red hover:text-white transition-colors"
                  onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                  data-testid={`filter-${category.toLowerCase()}`}
                >
                  {category}
                </Badge>
              ))}
              {(searchQuery || selectedCategory) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                  data-testid="button-clear-filters"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-przmo-red hover:bg-red-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
              data-testid="button-submit-search"
            >
              Search Products
            </Button>
          </form>
        </div>

        {/* Search Results */}
        <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
          {searchQuery && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                {isSearching ? 'Searching...' : `Results (${finalResults.length})`}
              </h4>
              
              {finalResults.length === 0 && !isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No products found matching your search.</p>
                  <p className="text-sm mt-1">Try different keywords or clear filters.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {finalResults.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-przmo-red transition-colors cursor-pointer"
                      data-testid={`result-${product.id}`}
                      onClick={() => {
                        console.log('Selected product:', product.name);
                        handleClose();
                      }}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h5 className="font-medium text-black">{product.name}</h5>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{product.category}</span>
                          <span>•</span>
                          <span className="font-medium text-black">{product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Popular/Recent Searches when no query */}
          {!searchQuery && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Athletic wear", "Performance shorts", "Training gear", "Sport jackets"].map(term => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-przmo-red hover:text-white transition-colors"
                    onClick={() => handleInputChange(term)}
                    data-testid={`popular-${term.toLowerCase().replace(' ', '-')}`}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

OptimizedSearch.displayName = 'OptimizedSearch';

export default OptimizedSearch;