import { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>Search through our product catalog</DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-black">Search</h3>
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
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-przmo-red rounded-none"
                data-testid="input-search-query"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-przmo-red hover:bg-red-600 text-white font-bold uppercase tracking-wider rounded-none transition-colors"
              data-testid="button-submit-search"
            >
              Search Products
            </Button>
          </form>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Hoodies", "Joggers", "Sneakers", "T-shirts", "Jackets"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  data-testid={`button-search-suggestion-${term.toLowerCase()}`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}