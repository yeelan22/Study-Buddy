import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Function that can be called directly to scroll to top
export const scrollToTop = () => {
  // Find the main scrollable container (the one with overflow-y-auto)
  const scrollableContainer = document.querySelector('.flex-1.overflow-y-auto') || 
                             document.querySelector('[class*="overflow-y-auto"]') ||
                             document.querySelector('main') ||
                             document.querySelector('#root');
  
  if (scrollableContainer) {
    // Scroll the main container to top with smooth behavior
    scrollableContainer.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  
  // Also try window scroll as fallback with smooth behavior
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  // Add CSS for faster smooth scrolling
  const style = document.createElement('style');
  style.textContent = `
    * {
      scroll-behavior: smooth !important;
    }
    html {
      scroll-behavior: smooth !important;
    }
  `;
  document.head.appendChild(style);
  
  // Remove the style after scrolling completes
  setTimeout(() => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, 1000);
};

// Component that automatically scrolls on route changes
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname, search]);

  return null; // This component doesn't render anything
};
