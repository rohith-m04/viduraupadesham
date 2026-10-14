"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SummaryButton } from "./summary-button";
import { AudioConsole } from "./AudioConsole";

interface CinematicHeroProps {
  onSummarized: () => void;
  onShowInfographic: () => void;
  onShowMap: () => void;
  onShow465: () => void;
  audioSrc: string;
}

export function CinematicHero({ onSummarized, onShowInfographic, onShowMap, onShow465, audioSrc }: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Reveal
      gsap.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 2,
        stagger: 0.2,
        ease: "power4.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Parallax Effect
    const xMove = (clientX / innerWidth - 0.5) * 40;
    const yMove = (clientY / innerHeight - 0.5) * 40;

    gsap.to(".parallax-bg", { x: xMove * 0.5, y: yMove * 0.5, duration: 1 });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-screen flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-white/10"
    >
      <div className="film-grain" />
      <div className="bg-grid-theme parallax-bg" />

      {/* Top Right Navigation Console */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col items-end gap-4">
          <AudioConsole audioSrc={audioSrc} />
          
          <div className="flex gap-4">
              <button 
                suppressHydrationWarning
                onClick={onShowInfographic}
                className="px-6 py-2 rounded-full border border-white/5 bg-black/5 backdrop-blur-md text-white/30 text-[9px] uppercase font-bold tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                  Infographic
              </button>
              <button 
                suppressHydrationWarning
                onClick={onShowMap}
                className="px-6 py-2 rounded-full border border-white/5 bg-black/5 backdrop-blur-md text-white/30 text-[9px] uppercase font-bold tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                  Map
              </button>
              <button 
                suppressHydrationWarning
                onClick={onShow465}
                className="px-6 py-2 rounded-full border border-white/5 bg-black/5 backdrop-blur-md text-white/30 text-[9px] uppercase font-bold tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                  465
              </button>
          </div>
      </div>

      <div className="z-10 text-center px-6">
        <div className="overflow-hidden mb-2">
            <h2 className="reveal-text text-white/40 tracking-[0.5em] uppercase text-[10px] md:text-xs">
                Ancient Sagacity • Modern Mastery
            </h2>
        </div>
        
        <div className="overflow-hidden mb-8">
            <h1 
                ref={titleRef}
                className="reveal-text text-silver-matte font-serif italic text-6xl md:text-9xl leading-none"
            >
                The Wisdom <br /> of Vidura
            </h1>
        </div>

        <div className="flex justify-center mb-12">
            <SummaryButton 
                onClick={onSummarized}
                className="w-auto"
            />
        </div>

        <div className="reveal-text flex flex-col items-center gap-4 text-white/20">
            <p className="uppercase tracking-[0.3em] text-[8px]">Scroll for video overview</p>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
