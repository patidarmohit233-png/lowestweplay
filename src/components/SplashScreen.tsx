import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface SplashScreenProps {
  show: boolean;
  onComplete: () => void;
}

const SplashScreen = ({ show, onComplete }: SplashScreenProps) => {
  // Prevent body scroll on mobile when splash is visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          style={{ touchAction: "none", willChange: "opacity" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Radial glow - smaller on mobile */}
          <motion.div
            className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.15, 0.08] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", willChange: "transform, opacity" }}
          />

          <div className="flex flex-col items-center gap-5 relative z-10 px-6">
            {/* Logo */}
            <motion.img
              src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
              alt="Lowest Weplay"
              className="w-[120px] md:w-[180px] h-auto"
              initial={{ scale: 0.3, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity, filter" }}
            />

            {/* Brand text */}
            <motion.div className="text-center">
              <motion.p
                className="text-2xl md:text-5xl font-display text-foreground"
                initial={{ opacity: 0, y: 25, letterSpacing: "0.25em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                Lowest{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Weplay
                </span>
              </motion.p>
              <motion.p
                className="text-muted-foreground text-xs md:text-sm mt-2 tracking-[0.15em] md:tracking-[0.2em] uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                Get More. Pay Less.
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-40 md:w-48 h-[3px] rounded-full bg-border overflow-hidden mt-1"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "width" }}
              />
            </motion.div>
          </div>

          {/* Corner particles - fewer on mobile for performance */}
          {[
            { x: "15%", y: "25%", delay: 0.5, size: 5 },
            { x: "82%", y: "18%", delay: 0.7, size: 4 },
            { x: "75%", y: "72%", delay: 0.9, size: 4 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/30"
              style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 1.8, delay: p.delay }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
