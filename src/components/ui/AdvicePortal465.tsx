"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X, MessageSquare, Quote, BookOpen, Shield, Heart, Sparkles, Zap, Star, Compass, Award, Anchor, Sun, Moon, Feather, Mountain, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { VIDURA_ADVICES } from "@/lib/advices-data";

interface AdvicePortal465Props {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS = [MessageSquare, Quote, BookOpen, Shield, Heart, Sparkles, Zap, Star, Compass, Award, Anchor, Sun, Moon, Feather, Mountain];

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES: Record<string, string[]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<string, string[]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ index, title, text, sizeClasses, onClick }: { index: number; title: string; text: string; sizeClasses: string; onClick: () => void }) => {
  const [scope, animate] = useAnimate();
  const Icon = ICONS[index % ICONS.length];
  const [isHovered, setIsHovered] = useState(false);

  const getNearestSide = (e: React.MouseEvent) => {
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHovered(false);
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group overflow-hidden border border-white/5 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/5 ${sizeClasses} min-h-[160px] flex flex-col p-6 cursor-pointer pointer-events-auto ${isHovered ? 'z-50 scale-[1.02] shadow-2xl border-white/20' : 'z-10'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <Icon size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
      </div>
      
      <h3 className="text-silver-matte font-serif italic text-lg mb-2 group-hover:text-white transition-colors line-clamp-2">{title}</h3>
      <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/50 transition-colors line-clamp-4">{text}</p>

      {/* Hover Reveal Overlay */}
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 flex flex-col p-6 bg-white text-black transition-colors duration-300 z-20 pointer-events-none"
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          <Icon size={16} className="text-black/20" />
        </div>
        
        <h3 className="font-serif italic text-lg mb-3 shrink-0 leading-tight">{title}</h3>
        
        <div className="flex-1 overflow-hidden">
          <p className="text-black/80 text-sm leading-relaxed italic font-medium line-clamp-6">
            &ldquo;{text}&rdquo;
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-black/10 shrink-0">
            <span className="text-[8px] uppercase font-bold tracking-widest text-black/40">Click to Open Manuscript →</span>
        </div>
      </div>
    </div>
  );
};

export function AdvicePortal465({ isOpen, onClose }: AdvicePortal465Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Use exactly 444 items as per request
  const displayAdvices = useMemo(() => VIDURA_ADVICES.slice(0, 444), []);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % displayAdvices.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + displayAdvices.length) % displayAdvices.length);
    }
  };

  if (!mounted) return null;

  const currentAdvice = selectedIndex !== null ? displayAdvices[selectedIndex] : null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] bg-[#0b0c10] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-8 border-b border-white/5 bg-[#0b0c10]/80 backdrop-blur-xl z-20">
            <div>
              <h2 className="text-white/30 uppercase tracking-[1em] text-[10px] font-bold">Sea of Ancient Wisdom</h2>
              <p className="text-silver-matte font-serif italic text-2xl mt-1 tracking-tight">465 Teachings of Vidura <span className="text-white/10 text-sm ml-4 font-mono not-italic uppercase tracking-widest">Grains of Sagacity</span></p>
            </div>
            <button
              suppressHydrationWarning
              onClick={onClose}
              className="text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 p-4 rounded-full border border-white/10 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Grid Container */}
          <div 
            className="flex-1 overflow-y-auto px-0.5 py-0.5 selection:bg-white/20 scroll-smooth overscroll-contain" 
            data-lenis-prevent
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-0.5 bg-white/5 grid-flow-dense max-w-[1920px] mx-auto">
              {displayAdvices.map((advice, i) => {
                const length = advice.advice.length;
                const row = Math.floor(i / 8);
                const col = i % 8;
                
                let sizeClasses = "col-span-1 row-span-1";
                
                if (length > 280) {
                  sizeClasses = "md:col-span-2 md:row-span-2 col-span-2 row-span-2";
                } else if (length > 160) {
                  if ((row + col) % 2 === 0) {
                    sizeClasses = "md:col-span-2 col-span-2 row-span-1";
                  } else {
                    sizeClasses = "md:row-span-2 row-span-2 col-span-1";
                  }
                } else if (length > 100) {
                  if (i % 3 === 0) {
                    sizeClasses = "md:col-span-2 col-span-2 row-span-1";
                  }
                }

                return (
                  <LinkBox 
                    key={i} 
                    index={i} 
                    title={advice.name} 
                    text={advice.advice} 
                    sizeClasses={sizeClasses}
                    onClick={() => setSelectedIndex(i)}
                  />
                );
              })}
            </div>
            
            <div className="h-40 flex items-center justify-center border-t border-white/5 mt-10">
               <p className="text-white/10 text-[10px] uppercase tracking-[1em]">The Expanse of Dharma is Infinite</p>
            </div>
          </div>

          {/* Manuscript Reader Modal Overlay */}
          <AnimatePresence>
            {selectedIndex !== null && currentAdvice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[6000] flex items-center justify-center p-4 md:p-10 bg-[#0b0c10]/95 backdrop-blur-xl"
                onClick={() => setSelectedIndex(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  className="relative w-full max-w-4xl bg-white rounded-sm shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative Border */}
                  <div className="absolute inset-0 border-[1px] border-black/5 pointer-events-none m-2" />
                  
                  {/* Close button inside modal */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-6 right-6 text-black/30 hover:text-black transition-colors z-30"
                  >
                    <X size={28} />
                  </button>

                  <div className="p-8 md:p-16 flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
                    <div className="w-16 h-1 w-12 bg-black/10 mb-12" />
                    
                    <h2 className="text-3xl md:text-5xl font-serif italic text-black mb-8 leading-tight">
                      {currentAdvice.name}
                    </h2>
                    
                    <div className="w-full max-w-2xl">
                        <Quote size={40} className="text-black/5 mb-6 mx-auto" />
                        <p className="text-xl md:text-3xl font-serif text-black/90 leading-relaxed md:leading-snug">
                          {currentAdvice.advice}
                        </p>
                    </div>
                    
                    <div className="mt-16 pt-12 border-t border-black/5 w-full max-w-xs text-black/20 font-mono text-[10px] uppercase tracking-widest">
                        Scholarly Manuscript • Vidura Niti
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center p-6 border-t border-black/5 bg-gray-50/50">
                    <button 
                      suppressHydrationWarning
                      onClick={handlePrev}
                      className="flex items-center gap-3 text-black/50 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs group"
                    >
                      <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-1 w-1 rounded-full ${i === selectedIndex % 5 ? 'bg-black/40' : 'bg-black/10'}`} />
                      ))}
                    </div>

                    <button 
                      suppressHydrationWarning
                      onClick={handleNext}
                      className="flex items-center gap-3 text-black/50 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs group"
                    >
                      Next
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
