// Performance optimization utilities
import React from 'react';

// Lazy loading utility with error boundary
export const createLazyComponent = <T extends React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef<React.ElementRef<T>, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense 
      fallback={
        fallback ? 
        React.createElement(fallback) : 
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <LazyComponent {...props} {...(ref ? { ref } : {})} />
    </React.Suspense>
  ));
};

// Debounce utility for performance-critical operations
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
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
};

// Throttle utility for scroll and resize events
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer hook for performance-optimized animations
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, hasIntersected, options]);
  
  return { isIntersecting, hasIntersected };
};

// Preload images for better performance
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};

// Memory-efficient animation frame utility
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();
  const isActive = React.useRef(true);
  
  const animate = React.useCallback((time: number) => {
    if (!isActive.current) return;
    
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      isActive.current = false;
    };
  }, [animate]);
  
  return {
    start: () => {
      isActive.current = true;
      requestRef.current = requestAnimationFrame(animate);
    },
    stop: () => {
      isActive.current = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };
};

// Virtual scrolling utility for large lists
export const useVirtualScroll = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop
  };
};

// Performance monitoring utility
export const performanceMonitor = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },
  
  getMetrics: () => {
    if (typeof performance !== 'undefined') {
      return {
        navigation: performance.getEntriesByType('navigation')[0],
        paint: performance.getEntriesByType('paint'),
        marks: performance.getEntriesByType('mark'),
        measures: performance.getEntriesByType('measure')
      };
    }
    return null;
  }
};

// Bundle size optimization - dynamic imports
export const dynamicImport = async <T,>(
  importFn: () => Promise<T>,
  retries: number = 3
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Dynamic import failed after retries');
};

// React import for TypeScript
export default {
  createLazyComponent,
  debounce,
  throttle,
  useIntersectionObserver,
  preloadImage,
  preloadImages,
  useAnimationFrame,
  useVirtualScroll,
  performanceMonitor,
  dynamicImport
};