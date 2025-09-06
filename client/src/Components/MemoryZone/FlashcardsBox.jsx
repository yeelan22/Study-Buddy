import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, Shrink } from "lucide-react";

const SPARKLES = Array.from({ length: 12 }).map(() => ({
  top: Math.random() * 90 + 5,
  left: Math.random() * 90 + 5,
  size: Math.random() > 0.5 ? 10 : 7,
  delay: Math.random() * 1.5,
}));

export function FlashcardsBox({ cards, onSessionComplete }) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showRatingCard, setShowRatingCard] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [rating, setRating] = useState(null);
  const [wrongCount, setWrongCount] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const cardRef = useRef();
  const validCards = Array.isArray(cards) ? cards.filter(c => c?.question && c?.answer) : [];

  // Reset session on new cards
  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
    setShowRatingCard(false);
    setRating(null);
    setWrongCount(null);
    setSessionStartTime(Date.now());
  }, [cards]);

  // Handle escape key to close zoom
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when zoomed
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  if (validCards.length === 0) {
    return (
      <div className="text-center subheading py-20">
        No flashcards to review. Please select a note with Q&A.
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  const goNext = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1 < validCards.length ? i + 1 : i));
  };

  const goPrev = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : i));
  };

  const handleCardClick = () => {
    if (showRatingCard) return;
    if (index < validCards.length - 1) {
      if (!showAnswer) setShowAnswer(true);
      else goNext();
    } else {
      if (!showAnswer) setShowAnswer(true);
      else setShowRatingCard(true);
    }
  };

  const handleRate = (level) => {
    setRating(level);
  };

  const handleWrongCount = (count) => {
    setWrongCount(count);

    const durationMs = Date.now() - sessionStartTime;
    const noteId = cards[0]?.noteId || null;

    if (onSessionComplete && noteId) {

      onSessionComplete({
        noteId,
        rating,
        wrongCount: count,
        durationMs,
      });
    }

    // Reset for next session
    setShowRatingCard(false);
    setShowAnswer(false);
    setIndex(0);
    setRating(null);
    setWrongCount(null);
  };

  const cardBg =
    " bg-black-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-colors duration-300";

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const flashcardContent = (
    <div
      ref={cardRef}
      className={`relative w-full mx-auto h-full shadow-md p-6 rounded-2xl ${cardBg} flex flex-col items-center justify-between ${
        isZoomed ? 'max-w-none' : 'max-w-xl'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleCardClick}
      style={{
        overflow: "hidden",
        minHeight: 0,
        flex: "1 1 0%",
        cursor: "pointer",
      }}
    >
      {/* Zoom Button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          className="rounded-full bg-white/20 dark:bg-black/20 p-2 text-gray-600 dark:text-gray-300 shadow hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200 backdrop-blur-sm"
          onClick={toggleZoom}
          title={isZoomed ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isZoomed ? <Shrink size={20} /> : <Expand size={20} />}
        </button>
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {SPARKLES.map((s, i) => {
          return (
            <motion.span
              key={i}
              className="pointer-events-none absolute select-none"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                fontSize: s.size,
                color: hovered ? "#fff" : "#888",
                opacity: hovered ? 1 : 0.3,
                filter: hovered ? "drop-shadow(0 0 6px #fff)" : "none",
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.2 + s.delay, delay: s.delay }}
            >
              *
            </motion.span>
          );
        })}
      </div>


      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-[220px] w-full">
        <AnimatePresence initial={false} mode="wait">
          {showRatingCard ? (
            rating === null ? (
              <motion.div
                key="rating"
                className="flex flex-col items-center justify-center w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <span className={`font-bold text-blue mb-6 ${isZoomed ? 'text-4xl' : 'text-2xl'}`}>How was this session?</span>
                <div className="flex justify-center gap-4">
                  {["Easy", "Medium", "Hard"].map((level, i) => (
                    <button
                      key={level}
                      className={`px-5 py-2 rounded-lg font-semibold text-base border-2 border-blue
                        bg-white dark:bg-blue hover:bg-blue-50 dark:hover:bg-blue/40
                        text-blue dark:text-blue-200 transition-all duration-200 shadow
                        ${i === 0 ? "hover:ring-2 hover:ring-green-400" : i === 2 ? "hover:ring-2 hover:ring-red-400" : ""}`}
                      onClick={e => {
                        e.stopPropagation();
                        handleRate(level);
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="wrong-count"
                className="flex flex-col items-center justify-center w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <span className={`font-bold text-blue mb-4 ${isZoomed ? 'text-3xl' : 'text-xl'}`}>How many questions did you get wrong?</span>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      className="bg-blue text-white rounded-full px-4 py-2 hover:bg-blue-400 transition shadow"
                      onClick={e => {
                        e.stopPropagation();
                        handleWrongCount(n);
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </motion.div>
            )
          ) : !showAnswer ? (
            <motion.div
              key="question"
              className="flex flex-col items-center justify-center w-full h-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
            >
              <span className={`font-bold text-blue mb-2 ${isZoomed ? 'text-5xl' : 'text-3xl'}`}>Q.</span>
              <span className={`font-semibold text-gray-900 dark:text-white text-center ${isZoomed ? 'text-3xl' : 'text-xl'}`}>
                {validCards[index].question}
              </span>
              <span className={`mt-4 text-gray-400 dark:text-gray-500 ${isZoomed ? 'text-sm' : 'text-xs'}`}>(Click to show answer)</span>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="question-top"
                className="absolute top-0 left-0 w-full flex flex-col items-center"
                initial={{ y: -40, opacity: 1 }}
                animate={{ y: -40, opacity: 1 }}
                exit={{ opacity: 0, y: -40 }}
                style={{ pointerEvents: "none" }}
              >
                <span className={`font-bold text-violet-500 mb-2 ${isZoomed ? 'text-5xl' : 'text-3xl'}`}>Q.</span>
                <span className={`font-semibold text-gray-900 dark:text-white text-center ${isZoomed ? 'text-3xl' : 'text-xl'}`}>
                  {validCards[index].question}
                </span>
              </motion.div>
              <motion.div
                key="answer"
                className="absolute bottom-0 left-0 w-full flex flex-col items-center"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: 40 }}
              >
                <span className={`font-bold text-cyan-500 mb-2 ${isZoomed ? 'text-4xl' : 'text-2xl'}`}>A.</span>
                <span className={`text-gray-800 dark:text-gray-200 text-center ${isZoomed ? 'text-2xl' : 'text-lg'}`}>
                  {validCards[index].answer}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {!showRatingCard && (
        <div className="flex justify-center gap-2 mt-4 z-20 relative">
          {validCards.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                i === index ? "bg-blue scale-125" : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={e => {
                e.stopPropagation();
                setIndex(i);
                setShowAnswer(false);
                setShowRatingCard(false);
              }}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next Arrows */}
      {!showRatingCard && (
        <>
          <div className="absolute top-1/2 left-16 -translate-y-1/2 z-30">
            <button
              className="rounded-full bg-violet-100 dark:bg-violet-900/60 p-2 text-blue-400 dark:text-violet-300 shadow hover:bg-violet-200 dark:hover:bg-violet-800 transition"
              onClick={e => {
                e.stopPropagation();
                goPrev();
                setShowRatingCard(false);
              }}
              disabled={index === 0}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 z-30">
            <button
              className="rounded-full bg-violet-100 dark:bg-violet-900/60 p-2 text-violet-600 dark:text-violet-300 shadow hover:bg-violet-200 dark:hover:bg-violet-800 transition"
              onClick={e => {
                e.stopPropagation();
                goNext();
                setShowRatingCard(false);
              }}
              disabled={index === validCards.length - 1}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (isZoomed) {
    return createPortal(
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsZoomed(false);
          }
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        {/* Zoomed Flashcard */}
        <motion.div
          className="relative z-10 w-[calc(100vw-4rem)] h-[calc(100vh-4rem)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {flashcardContent}
        </motion.div>
      </motion.div>,
      document.body
    );
  }

  return flashcardContent;
}
