import { motion } from "framer-motion";
import { Eye, Frame, Scan } from "lucide-react";

export default function Preview({ preview }) {
  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="mt-12 flex flex-col items-center"
    >
      <div className="flex items-center gap-2 mb-4 text-cyan-400/80">
        <Eye size={18} />
        <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Input Source</h2>
      </div>

      <div className="relative group">
        {/* Decorative Corner Brackets */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-sm" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-sm" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-sm" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 rounded-br-sm" />

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          {/* Scanning Line Animation */}
          <motion.div
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10 opacity-50"
          />

          {/* Image with subtle zoom on hover */}
          <motion.img
            src={preview}
            alt="CT Scan Preview"
            whileHover={{ scale: 1.05 }}
            className="w-full max-w-sm md:max-w-md object-cover transition-transform duration-500"
          />

          {/* HUD Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-cyan-500/70 font-mono flex items-center gap-1">
                <Frame size={10} /> RESOLUTION: RAW_DATA
              </span>
              <span className="text-[10px] text-cyan-500/70 font-mono flex items-center gap-1">
                <Scan size={10} /> SOURCE: LOCAL_STORAGE
              </span>
            </div>
            <div className="h-6 w-6 rounded border border-white/20 flex items-center justify-center">
               <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Ambient Glow behind image */}
        <div className="absolute inset-0 -z-10 bg-cyan-500/5 blur-2xl rounded-full scale-90" />
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest"
      >
        Waiting for neural processing...
      </motion.p>
    </motion.div>
  );
}