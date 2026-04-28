import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileSearch, Sparkles, Loader2 } from "lucide-react";

export default function UploadCard({ onFile, onUpload, loading, fileName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-[1.5px] rounded-[2.5rem] overflow-hidden group"
    >
      {/* Animated Border Gradient */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,#3b82f6_25%,transparent_50%,#8b5cf6_75%,transparent_100%)] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Glass Container */}
      <div className="relative backdrop-blur-2xl bg-slate-950/80 border border-white/10 rounded-[2.4rem] p-10 flex flex-col items-center gap-8 shadow-3xl">
        
        {/* ICON AREA with Magnetic Effect */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative z-10 p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-md"
          >
            {loading ? (
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            ) : (
              <UploadCloud className="w-10 h-10 text-blue-400 group-hover:text-cyan-300 transition-colors" />
            )}
          </motion.div>
          
          {/* Floating Decorative Elements */}
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-purple-400"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        {/* TEXT AREA */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {fileName ? "Image Ready" : "Diagnostic Upload"}
          </h3>
          <p className="text-slate-400 text-sm max-w-[200px]">
            {fileName ? fileName : "Upload CT scans for GAN-based lesion detection"}
          </p>
        </div>

        {/* DRAG & DROP ZONE */}
        <label className="w-full group/label">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="hidden"
          />
          <motion.div
            whileHover={{ borderColor: "rgba(59,130,246,0.5)", backgroundColor: "rgba(255,255,255,0.03)" }}
            className="w-full border-2 border-dashed border-white/5 rounded-2xl py-10 flex flex-col items-center gap-3 transition-all cursor-pointer"
          >
            <FileSearch className="w-6 h-6 text-slate-500 group-hover/label:text-blue-400 transition-colors" />
            <span className="text-sm font-medium text-slate-500 group-hover/label:text-slate-300">
              {fileName ? "Change Selection" : "Click to browse files"}
            </span>
          </motion.div>
        </label>

        {/* ENHANCED BUTTON */}
        <motion.button
          whileHover={!loading ? { 
            scale: 1.02,
            boxShadow: "0 0 20px rgba(59,130,246,0.4)" 
          } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          onClick={onUpload}
          disabled={loading || !fileName}
          className="w-full group relative overflow-hidden bg-white text-slate-950 py-4 rounded-2xl font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <div className="h-2 w-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-slate-950 rounded-full animate-bounce" />
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                Run Analysis <Sparkles size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}