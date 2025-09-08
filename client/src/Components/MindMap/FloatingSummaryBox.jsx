import React from "react";
import { FloatingDialog } from "../shared";

export function FloatingSummaryBox({ summary, isOpen, onClose }) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <FloatingDialog
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? "full" : "lg"}
      className={isMobile ? "w-[92vw] max-w-[95vw] h-[80vh]" : "w-[480px] h-[380px]"}
    >
      <div
        className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-6"
        style={{ paddingRight: 0 }}
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </FloatingDialog>
  );
}