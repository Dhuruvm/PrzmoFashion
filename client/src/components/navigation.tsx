import { useState } from "react";
import { Search, ShoppingBag, User } from "lucide-react";
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
              {/* Enhanced Animated Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="relative p-3 text-black hover:bg-gray-100 rounded-full focus:outline-none transition-all duration-300 group"
                data-testid="button-mobile-menu"
                aria-label="Open menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className="w-5 h-0.5 bg-current transform transition-all duration-300 group-hover:w-6"></span>
                  <span className="w-6 h-0.5 bg-current transform transition-all duration-300 mt-1"></span>
                  <span className="w-4 h-0.5 bg-current transform transition-all duration-300 mt-1 group-hover:w-6"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Background Overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                    <span className="text-xl font-black text-black tracking-wide">MENU</span>
                  </div>
                  
                  {/* Enhanced Close Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative p-3 text-black hover:bg-gray-100 rounded-full transition-all duration-300 group"
                    data-testid="button-close-mobile-menu"
                    aria-label="Close menu"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <span className="absolute w-6 h-0.5 bg-current transform rotate-45 transition-all duration-300"></span>
                      <span className="absolute w-6 h-0.5 bg-current transform -rotate-45 transition-all duration-300"></span>
                    </div>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-6 py-8">
                  <nav className="space-y-6">
                    <button
                      onClick={scrollToDrops}
                      className="group block w-full text-left transition-all duration-300"
                      data-testid="button-mobile-drops"
                    >
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <span className="text-2xl font-bold text-black group-hover:text-przmo-red transition-colors">
                          Drops
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-przmo-red transition-colors">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleCollectionsClick}
                      className="group block w-full text-left transition-all duration-300"
                      data-testid="button-mobile-collections"
                    >
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <span className="text-2xl font-bold text-black group-hover:text-przmo-red transition-colors">
                          Collections
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-przmo-red transition-colors">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleCollectionsClick}
                      className="group block w-full text-left transition-all duration-300"
                      data-testid="button-mobile-about"
                    >
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <span className="text-2xl font-bold text-black group-hover:text-przmo-red transition-colors">
                          About
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-przmo-red transition-colors">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleCollectionsClick}
                      className="group block w-full text-left transition-all duration-300"
                      data-testid="button-mobile-contact"
                    >
                      <div className="flex items-center justify-between py-4">
                        <span className="text-2xl font-bold text-black group-hover:text-przmo-red transition-colors">
                          Contact
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-przmo-red transition-colors">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Footer Section */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Follow Us</span>
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">© 2024 PRZMO Athletic</p>
                </div>
              </div>
            </div>
          </>
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
