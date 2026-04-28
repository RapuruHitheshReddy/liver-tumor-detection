import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import Preview from "./components/Preview";
import Loader from "./components/Loader";
import Results from "./components/Results";
import Background from "./components/Background";

const API_URL = "http://127.0.0.1:8000/predict";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- MOUSE SPOTLIGHT LOGIC ---
  // The spring adds a "weight" to the movement, making it feel premium
  const mouseX = useSpring(useMotionValue(0), { damping: 25, stiffness: 150 });
  const mouseY = useSpring(useMotionValue(0), { damping: 25, stiffness: 150 });

  function handleMouseMove({ clientX, clientY }) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  // --- MEMORY CLEANUP ---
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (f) => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setResult(null);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(API_URL, formData);
      setResult(res.data);
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("System Error: Unable to connect to diagnostic server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#020617] text-slate-50 selection:bg-cyan-500/30 overflow-x-hidden"
    >
      {/* 1. SEPARATED BACKGROUND COMPONENT */}
      <Background />

      {/* 2. INTERACTIVE MOUSE SPOTLIGHT (Stays in App for global mouse tracking) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 211, 238, 0.04),
              transparent 80%
            )
          `,
        }}
      />

      {/* 3. MAIN CONTENT LAYER */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        <Header />

        <section className="flex flex-col items-center justify-center">
          <UploadCard 
            onFile={handleFile} 
            onUpload={upload} 
            loading={loading} 
            fileName={file?.name} 
          />
        </section>

        {/* --- ANIMATED TRANSITIONS --- */}
        <AnimatePresence mode="wait">
          {preview && (
            <motion.div
              key="preview-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Preview preview={preview} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loader-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10"
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && !loading && (
              <motion.div
                key="results-container"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
              >
                <Results result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}