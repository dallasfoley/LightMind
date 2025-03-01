"use client";
import { motion } from "framer-motion";

const AIChatbotIcon = () => {
  return (
    <div className="relative w-16 h-16">
      <motion.div
        className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.svg
        viewBox="0 0 32 32"
        className="absolute inset-0 w-full h-full text-blue-500 fill-current"
      >
        <path d="M16 2C8.28 2 2 8.28 2 16s6.28 14 14 14 14-6.28 14-14S23.72 2 16 2zm0 26C9.38 28 4 22.62 4 16S9.38 4 16 4s12 5.38 12 12-5.38 12-12 12z" />
        <path d="M24 16c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8z" />
      </motion.svg>
      <motion.div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="w-1.5 h-1.5 bg-white rounded-full mx-0.5"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0,
          }}
        />
        <motion.span
          className="w-1.5 h-1.5 bg-white rounded-full mx-0.5"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.2,
          }}
        />
        <motion.span
          className="w-1.5 h-1.5 bg-white rounded-full mx-0.5"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.4,
          }}
        />
      </motion.div>
    </div>
  );
};

export default AIChatbotIcon;
