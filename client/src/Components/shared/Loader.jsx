import React from 'react';
import { motion } from 'framer-motion';

export function Loader({ text = "Generating...", size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base", 
    xl: "text-lg"
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Circular Progress Indicator */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 dark:border-gray-700`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full rounded-full border-2 border-transparent border-t-white border-r-gray-300 dark:border-t-gray-200 dark:border-r-gray-500"></div>
        </motion.div>
      </div>
      
      {/* Text with Shimmer Effect */}
      <motion.span 
        className={`${textSizeClasses[size]} font-medium relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent bg-no-repeat
          [--base-color:#a1a1aa] [--base-gradient-color:#000] 
          dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]
          [--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          dark:[--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          [--spread:26px]`}
        style={{
          backgroundImage: 'var(--bg), linear-gradient(var(--base-color), var(--base-color))',
          backgroundPosition: '98% center',
          backgroundRepeat: 'no-repeat, padding-box'
        }}
        animate={{
          backgroundPosition: ['98% center', '-98% center']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Alternative Loader with pulsing animation
export function PulsingLoader({ text = "Generating...", size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8", 
    xl: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Pulsing Circle */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-white to-gray-400 dark:from-gray-200 dark:to-gray-500`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Text with Shimmer Effect */}
      <motion.span 
        className={`${textSizeClasses[size]} font-medium relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent bg-no-repeat
          [--base-color:#a1a1aa] [--base-gradient-color:#000] 
          dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]
          [--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          dark:[--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          [--spread:26px]`}
        style={{
          backgroundImage: 'var(--bg), linear-gradient(var(--base-color), var(--base-color))',
          backgroundPosition: '98% center',
          backgroundRepeat: 'no-repeat, padding-box'
        }}
        animate={{
          backgroundPosition: ['98% center', '-98% center']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Dots Loader
export function DotsLoader({ text = "Generating...", size = "md" }) {
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Animated Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-white to-gray-400 dark:from-gray-200 dark:to-gray-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Text with Shimmer Effect */}
      <motion.span 
        className={`${textSizeClasses[size]} font-medium relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent bg-no-repeat
          [--base-color:#a1a1aa] [--base-gradient-color:#000] 
          dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]
          [--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          dark:[--bg:linear-gradient(90deg,transparent,var(--base-gradient-color),transparent)]
          [--spread:26px]`}
        style={{
          backgroundImage: 'var(--bg), linear-gradient(var(--base-color), var(--base-color))',
          backgroundPosition: '98% center',
          backgroundRepeat: 'no-repeat, padding-box'
        }}
        animate={{
          backgroundPosition: ['98% center', '-98% center']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}