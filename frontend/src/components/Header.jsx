import { motion } from "framer-motion";
import { BrainCircuit, Activity, Sparkles } from "lucide-react";

export default function Header() {
  const title = "AI LIVER TUMOR DETECTION";
  
  // Animation variants for the container to stagger the children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.5,
      },
    },
  };

  // Animation variants for each individual character
  const letterVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <header className="relative py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
        >
          <BrainCircuit size={48} className="text-cyan-400" />
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            <Sparkles size={20} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Activity size={32} className="text-rose-500 animate-pulse" />
        </motion.div>
      </div>

      {/* REVEALING TEXT EFFECT */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-6xl font-black text-center tracking-tighter flex flex-wrap justify-center"
      >
        {title.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Sliding Underline Reveal */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "200px", opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
        className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-4"
      />

      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.2em" }}
        transition={{ delay: 1.8, duration: 1.5 }}
        className="mt-6 text-gray-400 font-medium uppercase text-xs tracking-[0.2em]"
      >
        Neural Analysis & Diagnostics
      </motion.p>
    </header>
  );
}