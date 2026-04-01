import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  show: boolean;
  onComplete: () => void;
}

const SplashScreen = ({ show, onComplete }: SplashScreenProps) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.15, 0.08] }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)" }}
          />

          <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Logo */}
            <motion.img
              src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
              alt="Lowest Weplay"
              className="w-[140px] md:w-[180px] h-auto"
              initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Brand text */}
            <motion.div className="text-center">
              <motion.h1
                className="text-3xl md:text-5xl font-display text-foreground"
                initial={{ opacity: 0, y: 30, letterSpacing: "0.3em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Lowest{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Weplay
                </span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-sm mt-2 tracking-[0.2em] uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Get More. Pay Less.
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-[3px] rounded-full bg-border overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>

          {/* Corner particles */}
          {[
            { x: "15%", y: "25%", delay: 0.6, size: 6 },
            { x: "82%", y: "18%", delay: 0.8, size: 4 },
            { x: "75%", y: "72%", delay: 1.0, size: 5 },
            { x: "12%", y: "68%", delay: 0.7, size: 3 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 2, delay: p.delay, repeat: 1 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
