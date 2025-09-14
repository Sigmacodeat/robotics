"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CVLoadingState() {
  return (
    <div className="space-y-8">
      {/* Header loading */}
      <div className="space-y-4">
        <motion.div 
          className="h-10 bg-[--color-surface] rounded-lg"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="h-6 w-3/4 bg-[--color-surface] rounded-lg"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>

      {/* Key metrics loading */}
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-16 w-48 bg-[--color-surface] rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Timeline loading */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <motion.div
              className="h-11 bg-[--color-surface] rounded-full"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
            <motion.div
              className="h-32 bg-[--color-surface] rounded-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 + 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
