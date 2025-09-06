import React, { useState, useRef, useEffect } from 'react';
import { NotesCard, ToolCard, FloatingSummaryBox } from '../MindMap';
import { Tooltip }  from "../shared"
import { Sparkle, StickyNote } from 'lucide-react';
import { gsap } from 'gsap';
import { useUIStore } from '../../store/uiStore';
import { FloatingAskAIBOX } from '../MindMap/FloatingAskAIBOX'; // Make sure this path is correct

export function MindMapSidebar() {
  const [open, setOpen] = useState(null); // 'tools' | 'notes' | null
  const cardRef = useRef();
  const [showSummary, setShowSummary] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
  const summary = useUIStore((s) => s.selectedNoteSummary);

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open && cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  }, [open]);

  // Handler to close all
  const closeAll = () => {
    setOpen(null);
    setShowSummary(false);
    setShowAskAI(false);
  };

  // Overlay for closing on click anywhere (including React Flow)
  const showOverlay = open !== null || showSummary || showAskAI;

  // Handler to open summary box from ToolCard
  const handleShowSummary = (show) => {
    setShowSummary(show);
    if (show) setShowAskAI(false);
  };
  const handleShowAskAI = (show) => {
    setShowAskAI(show);
    if (show) setShowSummary(false);
  };

  return (
    <>
      {/* Overlay for closing on click anywhere */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-30"
          style={{ cursor: "default" }}
          onMouseDown={closeAll}
        />
      )}

      {/* Floating action buttons */}
      {!isMobile ? (
        <div className="fixed right-6 top-1/4 z-40 flex flex-col gap-3">
          <Tooltip text="Tools">
            <button
              aria-label="Show Tools"
              className={`rounded-full toolCard cursor-pointer transition-colors ${open === 'tools' ? 'ring-2 ring-blue' : ''}`}
              onClick={e => {
                e.stopPropagation();
                setOpen(open === 'tools' ? null : 'tools');
                setShowSummary(false);
                setShowAskAI(false);
              }}
            >
              <Sparkle className="w-6 h-6 text-blue" />
            </button>
          </Tooltip>
          <Tooltip text="Notes">
            <button
              aria-label="Show Notes"
              className={`toolCard transition-colors cursor-pointer ${open === 'notes' ? 'ring-2 ring-emerald' : ''}`}
              onClick={e => {
                e.stopPropagation();
                setOpen(open === 'notes' ? null : 'notes');
                setShowSummary(false);
                setShowAskAI(false);
              }}
            >
              <StickyNote className="w-6 h-6 text-emerald" />
            </button>
          </Tooltip>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 flex flex-row gap-3">
          <Tooltip text="Tools">
            <button
              aria-label="Show Tools"
              className={`rounded-full toolCard cursor-pointer transition-colors ${open === 'tools' ? 'ring-2 ring-blue' : ''}`}
              onClick={e => {
                e.stopPropagation();
                setOpen(open === 'tools' ? null : 'tools');
                setShowSummary(false);
                setShowAskAI(false);
              }}
            >
              <Sparkle className="w-6 h-6 text-blue" />
            </button>
          </Tooltip>
          <Tooltip text="Notes">
            <button
              aria-label="Show Notes"
              className={`toolCard transition-colors cursor-pointer ${open === 'notes' ? 'ring-2 ring-emerald' : ''}`}
              onClick={e => {
                e.stopPropagation();
                setOpen(open === 'notes' ? null : 'notes');
                setShowSummary(false);
                setShowAskAI(false);
              }}
            >
              <StickyNote className="w-6 h-6 text-emerald" />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Floating card */}
      {open && (
        <div
          ref={cardRef}
          className={`
            fixed z-50
            ${isMobile
              ? "bottom-24 right-2 w-[260px] max-w-[95vw]"
              : "top-1/4 right-24 w-[260px] max-w-[70vw]"}
            card p-0 overflow-hidden
          `}
          onMouseDown={e => e.stopPropagation()}
        >
          {open === 'tools' && (
            <ToolCard
              onClose={closeAll}
              showSummary={showSummary}
              setShowSummary={handleShowSummary}
              showAskAI={showAskAI}
              setShowAskAI={handleShowAskAI}
            />
          )}
          {open === 'notes' && <NotesCard onClose={closeAll} />}
        </div>
      )}

      {/* Floating summary box (centered, not attached to tools) */}
      {showSummary && summary && open === 'tools' && (
        <FloatingSummaryBox
          summary={summary}
          onClose={closeAll}
        />
      )}

      {/* Floating Ask AI box */}
      {showAskAI && open === 'tools' && (
        <FloatingAskAIBOX onClose={closeAll} />
      )}
    </>
  );
}