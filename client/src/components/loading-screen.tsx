import { useEffect, useState } from "react";
import przmoLogo from "@assets/file_00000000db9461f9b66c666985e940de-removebg-preview_1755076093794.png";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          setTimeout(() => onLoadingComplete(), 800);
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-800 ${
      isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Logo */}
      <div className={`transform transition-all duration-1000 ${
        progress > 20 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}>
        <img 
          src={przmoLogo} 
          alt="PRZMO" 
          className="h-16 md:h-20 lg:h-24 w-auto object-contain"
        />
      </div>

      {/* Brand Text */}
      <div className={`mt-6 transform transition-all duration-1000 delay-300 ${
        progress > 40 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <h1 className="text-xl md:text-2xl font-light tracking-wider text-black">
          ATHLETIC LIFESTYLE
        </h1>
      </div>

      {/* Progress Bar */}
      <div className={`mt-12 w-64 md:w-80 transform transition-all duration-1000 delay-500 ${
        progress > 60 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Luxury Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-black/20 rounded-full animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}