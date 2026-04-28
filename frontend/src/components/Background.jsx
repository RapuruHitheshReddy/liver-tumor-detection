import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* 1. Grainy Noise Texture - Added here so it sits behind the grid but over the colors */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none brightness-150 contrast-150 mix-blend-overlay" 
        style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
      />

      {/* 2. Sharper Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-50" />

      {/* 3. Vibrant Blue Orb */}
      <motion.div
        animate={{
          x: [0, 150, 0],
          y: [0, 70, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-500/30 blur-[100px] rounded-full saturate-150"
      />

      {/* 4. Vibrant Purple Orb */}
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] -right-[15%] w-[50%] h-[50%] bg-purple-600/25 blur-[100px] rounded-full saturate-150"
      />

      {/* 5. Center Glow for Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      {/* 6. Bottom Cyan Streak */}
      <motion.div
        animate={{
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[10%] w-[80%] h-[40%] bg-cyan-400/20 blur-[120px] rounded-full saturate-200"
      />
    </div>
  );
}