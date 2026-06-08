import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieLib from 'lottie-react';

// Vite CJS/ESM interop: lottie-react ships as CJS, so `.default` may be
// the actual component when bundled. Fall back to the module itself if not.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Lottie = (LottieLib as any).default ?? LottieLib;

export default function AnimatedRobot() {
  const [isHovered, setIsHovered] = useState(false);
  // Fetch animation data from public/ at runtime — immune to git operations
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/robot-animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {/* silently fail — robot just won't render */});
  }, []);

  if (!animationData) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center cursor-pointer select-none"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
        },
      }}
      whileHover={{
        scale: 1.08,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Floating idle animation */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center"
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-3 px-4 py-2 bg-slate-900/90 text-white text-xs font-semibold rounded-xl shadow-xl backdrop-blur-md border border-slate-700/50 whitespace-nowrap flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Need help?
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/90" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lottie Animation */}
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
