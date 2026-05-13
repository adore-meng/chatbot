import { motion } from "framer-motion";

export const Greeting = () => {
  return (
    <div className="flex max-w-3xl flex-col items-center px-4" key="overview">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-full bg-white/70 px-4 py-1.5 font-semibold text-[11px] text-[#6d5dfc] shadow-sm ring-1 ring-slate-100"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        AI-Native Scientific Data Analysis Platform
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-bold text-5xl text-slate-950 tracking-[-0.06em] md:text-6xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Intelligent Data Analysis
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 max-w-xl text-center text-[13px] text-slate-500 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Analyze scientific datasets with AI. Generate statistical results,
        visualizations, and structured biological insights automatically.
      </motion.div>
    </div>
  );
};
