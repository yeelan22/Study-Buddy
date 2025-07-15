
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const flashcards = [
  {
    question: "What is JavaScript?",
    answer: "JavaScript is a programming language commonly used to create interactive effects within web browsers."
  },
  {
    question: "What is a variable in JavaScript?",
    answer: "A variable stores data that can be used and modified later in a program. It can be declared using `var`, `let`, or `const`."
  },
  {
    question: "What is the difference between `==` and `===`?",
    answer: "`==` compares values with type coercion, while `===` compares both value and type strictly."
  },
  {
    question: "What is a function?",
    answer: "A function is a block of reusable code that performs a specific task when called."
  },
  {
    question: "How do you declare a function in JavaScript?",
    answer: "You can declare a function using the `function` keyword, like `function greet() {}`."
  },
  {
    question: "What is the DOM?",
    answer: "The DOM (Document Object Model) is a programming interface that allows JavaScript to interact with and manipulate HTML and CSS."
  },
  {
    question: "What is an array?",
    answer: "An array is a list-like object used to store multiple values in a single variable."
  },
  {
    question: "What is a callback function?",
    answer: "A callback function is a function passed into another function as an argument to be executed later."
  },
  {
    question: "What is an event listener?",
    answer: "An event listener is a function that waits for an event (like a click or keypress) to occur on an element."
  },
  {
    question: "What is `NaN` in JavaScript?",
    answer: "`NaN` stands for 'Not a Number' and represents a value that is not a legal number."
  }
];

const SPARKLES = Array.from({ length: 12 }).map(() => ({
  top: Math.random() * 90 + 5,
  left: Math.random() * 90 + 5,
  size: Math.random() > 0.5 ? 10 : 7,
  delay: Math.random() * 1.5,
}));

export function FlashcardsBox({ cards = flashcards }) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showRatingCard, setShowRatingCard] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 }); // percent

  const cardRef = useRef();

  // Neon shadow
  const neonShadow = hovered
    ? "0 0 32px 8px #a78bfa, 0 0 0 2px #a78bfa"
    : "0 2px 16px 0 #0002";

  // Mouse move handler for magnetic sparkles and border shine
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  // Sparkle effect with magnetic offset
  const renderSparkles = () =>
    SPARKLES.map((s, i) => {
      const dx = (mouse.x - s.left) * 0.04;
      const dy = (mouse.y - s.top) * 0.04;
      return (
        <motion.span
          key={i}
          className="pointer-events-none absolute select-none"
          style={{
            top: `calc(${s.top}% + ${hovered ? dy : 0}px)`,
            left: `calc(${s.left}% + ${hovered ? dx : 0}px)`,
            fontSize: s.size,
            color: hovered ? "#fff" : "#888",
            opacity: hovered ? 1 : 0.3,
            filter: hovered ? "drop-shadow(0 0 6px #fff)" : "none",
            transition: "top 0.2s, left 0.2s",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2 + s.delay,
            delay: s.delay,
          }}
        >
          *
        </motion.span>
      );
    });

  // Localized border shine
  const renderShine = () => {
    if (!hovered) return null;
    return (
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(167,139,250,0.7) 0%, rgba(167,139,250,0.3) 30%, transparent 60%)`,
          borderRadius: "inherit",
          transition: "background 0.1s",
          mixBlendMode: "lighter",
        }}
      />
    );
  };

  // Navigation
  const goNext = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1 < cards.length ? i + 1 : i));
  };
  const goPrev = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : i));
  };

  // Card click logic
  const handleCardClick = () => {
    // If on rating card, do nothing
    if (showRatingCard) return;

    // If not last card
    if (index < cards.length - 1) {
      if (!showAnswer) setShowAnswer(true);
      else goNext();
    } else {
      // On last card
      if (!showAnswer) setShowAnswer(true);
      else setShowRatingCard(true); // Show rating card
    }
  };

  // Handle rating
  const handleRate = (level) => {
    // You can do something with the rating here!
    // For now, just reset to first card
    setShowRatingCard(false);
    setShowAnswer(false);
    setIndex(0);
  };

  // Card background classes
  const cardBg =
    "bg-white dark:bg-[#181828] border border-[#2222] dark:border-[#333] shadow-xl transition-colors duration-300";

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-xl mx-auto min-h-[340px] p-6 rounded-2xl ${cardBg} flex flex-col items-center justify-between`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleCardClick}
      style={{
        boxShadow: neonShadow,
        transition: "box-shadow 0.3s",
        overflow: "hidden",
        minHeight: 0,
        flex: "1 1 0%",
        cursor: "pointer",
      }}
    >
      {/* Localized border shine */}
      {renderShine()}

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-10">{renderSparkles()}</div>

      {/* Card Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-[220px] w-full">
        <AnimatePresence initial={false} mode="wait">
          {showRatingCard ? (
            // Rating card
            <motion.div
              key="rating-card"
              className="flex flex-col items-center justify-center w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <span className="text-2xl font-bold text-violet-500 dark:text-violet-300 mb-6">How was this session?</span>
              <div className="flex justify-center gap-4">
                {["Easy", "Medium", "Hard"].map((level, i) => (
                  <button
                    key={level}
                    className={`px-5 py-2 rounded-lg font-semibold text-base border-2 border-violet-400 dark:border-violet-600
                      bg-white dark:bg-[#181828] hover:bg-violet-50 dark:hover:bg-violet-900/40
                      text-violet-700 dark:text-violet-200 transition-all duration-200 shadow
                      ${i === 0 ? "hover:ring-2 hover:ring-green-400" : i === 2 ? "hover:ring-2 hover:ring-red-400" : ""}
                    `}
                    onClick={e => { e.stopPropagation(); handleRate(level); }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : !showAnswer ? (
            <motion.div
              key="question"
              className="flex flex-col items-center justify-center w-full h-full"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
            >
              <span className="text-3xl font-bold text-violet-500 dark:text-violet-300 mb-2">Q.</span>
              <span className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                {cards[index].question}
              </span>
              <span className="mt-4 text-xs text-gray-400 dark:text-gray-500">(Click to show answer)</span>
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
                <span className="text-3xl font-bold text-violet-500 dark:text-violet-300 mb-2">Q.</span>
                <span className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                  {cards[index].question}
                </span>
              </motion.div>
              <motion.div
                key="answer"
                className="absolute bottom-0 left-0 w-full flex flex-col items-center"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: 40 }}
              >
                <span className="text-2xl font-bold text-cyan-500 dark:text-cyan-300 mb-2">A.</span>
                <span className="text-lg text-gray-800 dark:text-gray-200 text-center">
                  {cards[index].answer}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      {!showRatingCard && (
        <div className="flex justify-center gap-2 mt-4 z-20 relative">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                i === index
                  ? "bg-violet-400 scale-125"
                  : "bg-gray-300 dark:bg-gray-700"
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

      {/* Prev/Next Buttons */}
      {!showRatingCard && (
        <>
          <div className="absolute top-1/2 left-2 -translate-y-1/2 z-30">
            <button
              className="rounded-full bg-violet-100 dark:bg-violet-900/60 p-2 text-violet-600 dark:text-violet-300 shadow hover:bg-violet-200 dark:hover:bg-violet-800 transition"
              onClick={e => { e.stopPropagation(); goPrev(); setShowRatingCard(false); }}
              disabled={index === 0}
            >
              <span className="sr-only">Previous</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 z-30">
            <button
              className="rounded-full bg-violet-100 dark:bg-violet-900/60 p-2 text-violet-600 dark:text-violet-300 shadow hover:bg-violet-200 dark:hover:bg-violet-800 transition"
              onClick={e => { e.stopPropagation(); goNext(); setShowRatingCard(false); }}
              disabled={index === cards.length - 1}
            >
              <span className="sr-only">Next</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}