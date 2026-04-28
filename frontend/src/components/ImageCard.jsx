import { motion, useMotionTemplate, useMotionValue, spring } from "framer-motion";
import { Maximize2, ShieldCheck } from "lucide-react";

export default function ImageCard({ title, image }) {
  // Mouse coordinates for the spotlight/tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="group relative backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
    >
      {/* Spotlight effect that follows the mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 211, 238, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="text-sm font-medium text-gray-300 tracking-wide uppercase">
          {title}
        </h3>
        <div className="flex gap-2">
          <ShieldCheck size={16} className="text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          <Maximize2 size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-black/40 aspect-square flex items-center justify-center">
        {/* Animated Scanning Line (only shows on hover) */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div 
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        {/* The Image */}
        <motion.img
          src={`data:image/png;base64,${image}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] pointer-events-none" />
      </div>

      {/* Dynamic Border Gradient */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-cyan-500/30 transition-colors pointer-events-none" />
    </motion.div>
  );
}