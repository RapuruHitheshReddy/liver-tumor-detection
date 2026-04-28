import { motion } from "framer-motion";
import { Activity, LayoutGrid, CheckCircle2 } from "lucide-react";
import Metrics from "./Metrics";
import ImageCard from "./ImageCard";

export default function Results({ result }) {
  if (!result) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2, // Cards will pop in one after another
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-16 space-y-8"
    >
      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <CheckCircle2 className="text-emerald-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Analysis Complete</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              Diagnostic ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-mono">
          <Activity size={14} className="text-emerald-500" />
          SYSTEM_STABLE // DATA_VERIFIED
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Metrics Section (Takes up 2 columns) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Metrics result={result} />
        </motion.div>

        {/* Visualizations (Takes up 3 columns) */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <LayoutGrid size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Neural Visualizations</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageCard 
              title="Segmented Mask" 
              image={result.mask} 
              description="AI-generated region of interest"
            />
            <ImageCard 
              title="Result Overlay" 
              image={result.overlay} 
              description="Projected lesion mapping"
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative background glow for results section */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[80%] h-[300px] bg-emerald-500/5 blur-[120px] -z-10 rounded-full" />
    </motion.section>
  );
}