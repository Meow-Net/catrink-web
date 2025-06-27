import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;

    const completeLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 200);
    };

    // Progress animation - smooth progression to 100%
    const startProgress = () => {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 8 + 4; // Random increment between 4-12%

          if (newProgress >= 100) {
            clearInterval(progressTimer);
            completeLoading();
            return 100;
          }

          return newProgress;
        });
      }, 150); // Update every 150ms for smoother animation
    };

    // Start progress after a short delay
    const startTimer = setTimeout(() => {
      startProgress();
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="preloader-overlay"
        >
          <div className="flex flex-col items-center space-y-8">
            {/* Cat Eyes */}
            <div className="cat-eyes">
              <div className="cat-eye"></div>
              <div className="cat-eye"></div>
            </div>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="catrink-logo text-4xl md:text-6xl mb-4">
                CATRINK
              </h1>
              <p className="font-orbitron text-neon-cyan text-sm md:text-base animate-neon-pulse">
                Awaken the Cat reflex Inside you
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-2"
              >
                <span className="font-orbitron text-white/60 text-xs">
                  {progress}%
                </span>
              </motion.div>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center space-x-1 font-orbitron text-white/40 text-xs">
                <span>INITIALIZING</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ...
                </motion.span>
              </div>
            </motion.div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-neon-blue rounded-full opacity-20"
                  animate={{
                    x: [0, Math.random() * window.innerWidth],
                    y: [0, Math.random() * window.innerHeight],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: Math.random() * window.innerWidth,
                    top: Math.random() * window.innerHeight,
                  }}
                />
              ))}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`purple-${i}`}
                  className="absolute w-3 h-3 bg-neon-purple rounded-full opacity-15"
                  animate={{
                    x: [0, Math.random() * window.innerWidth],
                    y: [0, Math.random() * window.innerHeight],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: Math.random() * window.innerWidth,
                    top: Math.random() * window.innerHeight,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
