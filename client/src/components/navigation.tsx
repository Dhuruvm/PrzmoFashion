import { useState } from "react";
import { Menu, X } from "lucide-react";
import przmoLogo from "@/assets/przmo-logo.png";

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <img 
                  src={przmoLogo} 
                  alt="PRZMO" 
                  className="h-8 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToDrops}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
              >
                New & Featured
              </button>
              <button
                onClick={handleCollectionsClick}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
              >
                Men
              </button>
              <button
                onClick={handleCollectionsClick}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
              >
                Women
              </button>
              <button
                onClick={handleCollectionsClick}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
              >
                Kids
              </button>
              <button
                onClick={handleCollectionsClick}
                className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
              >
                Sale
              </button>
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon */}
              <button className="p-2 text-black hover:text-gray-600 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* User Icon */}
              <button className="p-2 text-black hover:text-gray-600 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {/* Shopping Bag */}
              <button className="p-2 text-black hover:text-gray-600 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button className="p-2 text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-black focus:outline-none p-2"
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
