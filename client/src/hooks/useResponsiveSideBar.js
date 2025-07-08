import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

export const useResponsiveSidebar = () => {
  const openSidebar = useUIStore((s) => s.openSidebar);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  useEffect(() => {
    // Set sidebar open based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        openSidebar();
      } else {
        closeSidebar();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openSidebar, closeSidebar]);
};