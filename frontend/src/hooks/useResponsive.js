import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Provides breakpoint values and current screen size information
 */
function useResponsive() {
  // Define breakpoints (matching Tailwind's default breakpoints)
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };
  
  // Initialize state with default values
  const [state, setState] = useState({
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });
  
  useEffect(() => {
    // Skip if running on the server
    if (typeof window === 'undefined') return;
    
    // Function to update state based on window size
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        windowWidth: width,
        windowHeight: height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg
      });
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Helper functions for media queries
  const lessThan = (breakpoint) => {
    return state.windowWidth < breakpoints[breakpoint];
  };
  
  const greaterThan = (breakpoint) => {
    return state.windowWidth >= breakpoints[breakpoint];
  };
  
  const between = (minBreakpoint, maxBreakpoint) => {
    return (
      state.windowWidth >= breakpoints[minBreakpoint] && 
      state.windowWidth < breakpoints[maxBreakpoint]
    );
  };
  
  return {
    ...state,
    breakpoints,
    lessThan,
    greaterThan,
    between
  };
}

export default useResponsive;
