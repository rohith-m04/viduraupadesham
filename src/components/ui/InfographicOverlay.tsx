"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface InfographicOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfographicOverlay({ isOpen, onClose }: InfographicOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
        >
          <button suppressHydrationWarning onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[3001]">
            <X size={40} />
          </button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center"
          >
            <img 
               src="/info.png" 
               alt="Vidura Niti Infographic" 
               className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
