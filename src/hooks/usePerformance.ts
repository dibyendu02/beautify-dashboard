import { useCallback, useEffect, useRef, useState } from 'react';

// Performance monitoring hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    reRenderCount: 0,
    memoryUsage: 0,
    isSlowRender: false
  });

  const renderStartTime = useRef(performance.now());
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Get memory usage if available
    const memoryUsage = (performance as any).memory 
      ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      : 0;

    setMetrics({
      renderTime,
      reRenderCount: renderCountRef.current,
      memoryUsage,
      isSlowRender: renderTime > 16 // 60fps threshold
    });

    renderStartTime.current = performance.now();
  });

  return metrics;
};

// Optimized debounce hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Optimized throttle hook
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRunRef.current;

    if (timeSinceLastRun >= limit) {
      setThrottledValue(value);
      lastRunRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastRunRef.current = Date.now();
      }, limit - timeSinceLastRun);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, limit]);

  return throttledValue;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
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
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

// Optimized API call hook with caching
export const useOptimizedApi = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    cacheTime?: number;
    staleTime?: number;
    retryOnError?: boolean;
  } = {}
) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    retryOnError = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController>();

  const cacheKey = JSON.stringify(dependencies);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cacheRef.current.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < staleTime) {
      setData(cached.data);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: now
      });

      // Clean old cache entries
      for (const [key, value] of cacheRef.current.entries()) {
        if (now - value.timestamp > cacheTime) {
          cacheRef.current.delete(key);
        }
      }

      setData(result);
    } catch (err) {
      const error = err as Error;
      if (error.name !== 'AbortError') {
        setError(error);
        
        if (retryOnError) {
          // Retry after 1 second
          setTimeout(() => fetchData(), 1000);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, cacheTime, staleTime, retryOnError]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleEndIndex, setVisibleEndIndex] = useState(0);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = Math.floor(visibleItemsCount / 2);

  useEffect(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleItemsCount + 2 * bufferSize
    );

    setVisibleStartIndex(startIndex);
    setVisibleEndIndex(endIndex);
  }, [scrollTop, itemHeight, items.length, visibleItemsCount, bufferSize]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleStartIndex,
    visibleEndIndex
  };
};

// Resource preloader hook
export const useResourcePreloader = () => {
  const preloadedResources = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (preloadedResources.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        preloadedResources.current.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadScript = useCallback((src: string): Promise<void> => {
    if (preloadedResources.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = () => {
        preloadedResources.current.add(src);
        resolve();
      };
      script.onerror = reject;
      script.src = src;
      document.head.appendChild(script);
    });
  }, []);

  const preloadCSS = useCallback((href: string): Promise<void> => {
    if (preloadedResources.current.has(href)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => {
        preloadedResources.current.add(href);
        resolve();
      };
      link.onerror = reject;
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  return { preloadImage, preloadScript, preloadCSS };
};

// Web Workers hook for heavy computations
export const useWebWorker = <T, R>(
  workerFunction: (data: T) => R,
  dependencies: any[] = []
) => {
  const [result, setResult] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const workerRef = useRef<Worker>();

  useEffect(() => {
    // Create worker blob
    const workerCode = `
      self.onmessage = function(e) {
        try {
          const result = (${workerFunction.toString()})(e.data);
          self.postMessage({ success: true, result });
        } catch (error) {
          self.postMessage({ success: false, error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      const { success, result, error } = e.data;
      setLoading(false);
      
      if (success) {
        setResult(result);
        setError(null);
      } else {
        setError(new Error(error));
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, dependencies);

  const execute = useCallback((data: T) => {
    if (workerRef.current) {
      setLoading(true);
      setError(null);
      workerRef.current.postMessage(data);
    }
  }, []);

  return { result, loading, error, execute };
};

// Performance measurement utilities
export const measurePerformance = (name: string) => {
  return {
    start: () => performance.mark(`${name}-start`),
    end: () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      
      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
      
      return measure.duration;
    }
  };
};

// Core Web Vitals monitoring
export const useCoreWebVitals = () => {
  const [vitals, setVitals] = useState({
    FCP: 0, // First Contentful Paint
    LCP: 0, // Largest Contentful Paint
    FID: 0, // First Input Delay
    CLS: 0, // Cumulative Layout Shift
    TTFB: 0 // Time to First Byte
  });

  useEffect(() => {
    // FCP
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setVitals(prev => ({ ...prev, FCP: entry.startTime }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        setVitals(prev => ({ 
          ...prev, 
          FID: (entry as any).processingStart - entry.startTime 
        }));
      }
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setVitals(prev => ({ ...prev, CLS: clsValue }));
        }
      }
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
};