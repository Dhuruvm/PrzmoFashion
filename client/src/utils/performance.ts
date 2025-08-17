/**
 * Performance optimization utilities for PRZMO Athletic Lifestyle App
 * Production-ready utilities for monitoring and optimizing performance
 */

// Debounce function for search and input optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading utility for images
export function createImageLoader() {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for browsers without IntersectionObserver
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  return imageObserver;
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Mark performance timing
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        return performance.getEntriesByName(name, 'measure')[0];
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return null;
      }
    }
    return null;
  },

  // Get all performance entries
  getEntries: () => {
    if (typeof performance !== 'undefined' && performance.getEntries) {
      return performance.getEntries();
    }
    return [];
  },

  // Clear performance entries
  clear: (name?: string) => {
    if (typeof performance !== 'undefined') {
      if (name) {
        performance.clearMarks(name);
        performance.clearMeasures(name);
      } else {
        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  }
};

// Memory usage monitoring (development only)
export const memoryMonitor = {
  getUsage: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },

  logUsage: (label = 'Memory Usage') => {
    const usage = memoryMonitor.getUsage();
    if (usage) {
      console.log(`${label}:`, {
        used: `${(usage.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(usage.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(usage.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      });
    }
  }
};

// Bundle size analysis utilities
export const bundleAnalyzer = {
  // Track component render times
  trackComponentRender: (componentName: string) => {
    performanceMonitor.mark(`${componentName}-render-start`);
    
    return () => {
      performanceMonitor.mark(`${componentName}-render-end`);
      const measurement = performanceMonitor.measure(
        `${componentName}-render`,
        `${componentName}-render-start`,
        `${componentName}-render-end`
      );
      
      if (measurement && process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${measurement.duration.toFixed(2)}ms`);
      }
    };
  },

  // Track async operation times
  trackAsyncOperation: async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    performanceMonitor.mark(`${operationName}-start`);
    
    try {
      const result = await operation();
      performanceMonitor.mark(`${operationName}-end`);
      
      const measurement = performanceMonitor.measure(
        operationName,
        `${operationName}-start`,
        `${operationName}-end`
      );
      
      if (measurement && process.env.NODE_ENV === 'development') {
        console.log(`${operationName} took: ${measurement.duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      performanceMonitor.mark(`${operationName}-error`);
      throw error;
    }
  }
};

// Preload utilities for better performance
export const preloadUtils = {
  // Preload images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Preload multiple images
  preloadImages: (sources: string[]): Promise<void[]> => {
    return Promise.all(sources.map(src => preloadUtils.preloadImage(src)));
  },

  // Preload CSS
  preloadCSS: (href: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  },

  // Preload JavaScript
  preloadJS: (href: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = href;
    document.head.appendChild(link);
  }
};