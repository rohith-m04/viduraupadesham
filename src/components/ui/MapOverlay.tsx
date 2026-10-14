"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface MapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MapOverlay({ isOpen, onClose }: MapOverlayProps) {
  const [zoom, setZoom] = useState(0.7);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.3));
  const handleReset = () => setZoom(0.7);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-2xl flex flex-col"
        >
          {/* Controls Header */}
          <div className="flex items-center justify-between p-8 z-[3001]">
            <header className="text-left pointer-events-none">
                <h2 className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-bold">The Web of Wisdom</h2>
                <p className="text-white/40 font-serif italic text-2xl mt-2 italic">Magnified Exploration</p>
            </header>
            
            <div className="flex items-center gap-6">
                {/* Zoom Controls Fab */}
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-2xl">
                    <button 
                        suppressHydrationWarning
                        onClick={handleZoomOut}
                        className="p-2 text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-full"
                        title="Zoom Out"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button 
                        suppressHydrationWarning
                        onClick={handleReset}
                        className="px-2 text-[10px] font-bold tracking-widest text-white/60 hover:text-white font-mono"
                        title="Reset Zoom"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button 
                        suppressHydrationWarning
                        onClick={handleZoomIn}
                        className="p-2 text-white/40 hover:text-white transition-all hover:bg-white/5 rounded-full"
                        title="Zoom In"
                    >
                        <ZoomIn size={18} />
                    </button>
                </div>

                <button suppressHydrationWarning onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                    <X size={40} />
                </button>
            </div>
          </div>

          {/* Scrollable Map Container - Custom Thin Scrollbars */}
          <div 
            className="flex-1 overflow-auto p-12 md:p-32 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
                       [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1
                       [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:bg-white/10
                       [&::-webkit-scrollbar-thumb]:rounded-full
                       [&::-webkit-scrollbar-thumb]:hover:bg-white/20"
            data-lenis-prevent
          >
            <div 
                className="relative min-w-fit min-h-fit mx-auto origin-center transition-transform duration-300 ease-out" 
                style={{ transform: `scale(${zoom})` }}
            >
                <img 
                    src="/map.png" 
                    alt="Vidura Niti Map" 
                    className="max-w-none w-[120vw] h-auto object-contain filter brightness-95 contrast-110 select-none rounded-[3rem] shadow-3xl border border-white/5"
                    draggable={false}
                />
            </div>
            
            {/* Visual Grid Underlay */}
            <div className="fixed inset-0 bg-grid-theme opacity-5 pointer-events-none" />
          </div>

          <footer className="p-8 text-white/10 uppercase tracking-[0.3em] text-[8px] font-bold text-center z-[3001]">
            Minimal Scroll Active • Magnified Narrative V19.2
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
