import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";

export function FloatingSummaryBox({ summary, onClose }) {
  const boxRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [summary]);

  // Centered floating box, always
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      id="floating-summary-box"
    >
      <div
        ref={boxRef}
        className={`
        bg-white dark:bg-zinc-gray shadow-lg rounded-2xl overflow-hidden
          flex flex-col relative pointer-events-auto
          ${isMobile
            ? "w-[92vw] max-w-[95vw] h-[80vh] p-6"
            : "w-[480px] h-[380px] p-8"
          }
        `}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition z-10"
          onClick={onClose}
          aria-label="Close summary"
        >
          <X className="w-5 h-5" />
        </button>
        <div
          className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
          style={{ paddingRight: 0 }}
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      </div>
    </div>
  );
}