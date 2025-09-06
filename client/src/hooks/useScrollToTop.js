import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (behavior = 'smooth') => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, [location.pathname, location.search, behavior]);
};

export default useScrollToTop;
