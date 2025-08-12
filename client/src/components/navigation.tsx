import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="przmo-logo text-3xl font-black text-black hover:text-przmo-red transition-colors duration-300">
                <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">PRZMO</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <button
                onClick={scrollToDrops}
                className="relative group text-black font-semibold hover:text-przmo-red transition-colors duration-300"
              >
                <span className="relative z-10">Drops</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-przmo-red transform origin-left transition-transform duration-300"></div>
              </button>
              <button
                onClick={handleCollectionsClick}
                className="relative group text-gray-500 font-medium hover:text-black transition-colors duration-300"
              >
                <span className="relative z-10">Collections</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></div>
              </button>
              
              {/* Search Icon */}
              <button className="p-2 text-gray-600 hover:text-black transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Shopping Bag */}
              <button className="p-2 text-gray-600 hover:text-black transition-colors duration-300 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-przmo-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">3</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-black focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 right-6 text-black"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="mt-12 space-y-6">
                  <button
                    onClick={scrollToDrops}
                    className="block text-black text-xl font-semibold hover:text-przmo-red transition-colors"
                  >
                    Drops
                  </button>
                  <button
                    onClick={handleCollectionsClick}
                    className="block text-gray-500 text-xl font-medium hover:text-black transition-colors"
                  >
                    Collections
                  </button>
                </div>
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
    </>
  );
}
