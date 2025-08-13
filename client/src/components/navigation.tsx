import { useState } from "react";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import przmoLogo from "@assets/PRZMO_20250812_222429_0000_1755021196697.png";
import SearchModal from "./search-modal";
import CartDrawer from "./cart-drawer";
import { useCart } from "./cart-context";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();

  const handleCollectionsClick = () => {
    setIsComingSoonModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const scrollToDrops = () => {
    document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-18 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <img 
                  src={przmoLogo} 
                  alt="PRZMO Athletic Lifestyle" 
                  className="h-12 w-auto md:h-14 lg:h-16 object-contain hover:opacity-80 transition-all duration-200"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToDrops}
                className="text-black font-semibold hover:text-przmo-red transition-colors duration-200 uppercase tracking-wide"
                data-testid="link-drops"
              >
                Drops
              </button>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-black hover:text-przmo-red hover:bg-gray-50 rounded-full transition-all duration-200"
                data-testid="button-open-search"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* User Icon */}
              <button 
                onClick={handleCollectionsClick}
                className="p-3 text-black hover:text-przmo-red hover:bg-gray-50 rounded-full transition-all duration-200"
                data-testid="button-account"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              
              {/* Shopping Bag */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-3 text-black hover:text-przmo-red hover:bg-gray-50 rounded-full transition-all duration-200 relative"
                data-testid="button-open-cart"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-przmo-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-1">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-black hover:text-przmo-red transition-colors"
                data-testid="button-mobile-search"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-black hover:text-przmo-red transition-colors relative"
                data-testid="button-mobile-cart"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-0 -right-0 bg-przmo-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-black focus:outline-none p-2 hover:text-przmo-red transition-colors"
                data-testid="button-mobile-menu"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50">
            <div className="h-full w-full bg-white">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <span className="text-xl font-bold text-black">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-black hover:text-przmo-red transition-colors"
                  data-testid="button-close-mobile-menu"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-6 py-8 space-y-8">
                <button
                  onClick={scrollToDrops}
                  className="block w-full text-left text-2xl font-bold text-black hover:text-przmo-red transition-colors py-4 border-b border-gray-100"
                  data-testid="button-mobile-drops"
                >
                  Drops
                </button>
                <button
                  onClick={handleCollectionsClick}
                  className="block w-full text-left text-2xl font-bold text-black hover:text-przmo-red transition-colors py-4 border-b border-gray-100"
                  data-testid="button-mobile-collections"
                >
                  Collections
                </button>
                <button
                  onClick={handleCollectionsClick}
                  className="block w-full text-left text-2xl font-bold text-black hover:text-przmo-red transition-colors py-4 border-b border-gray-100"
                  data-testid="button-mobile-about"
                >
                  About
                </button>
                <button
                  onClick={handleCollectionsClick}
                  className="block w-full text-left text-2xl font-bold text-black hover:text-przmo-red transition-colors py-4"
                  data-testid="button-mobile-contact"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Coming Soon Modal */}
      {isComingSoonModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center animate-slide-up">
            <h3 className="text-2xl font-black text-black mb-4">Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              Stay tuned for our first collection. We're working on something amazing.
            </p>
            <button
              onClick={() => setIsComingSoonModalOpen(false)}
              className="bg-przmo-red text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-red-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
