"use client";

import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicHero } from "@/components/ui/CinematicHero";
import { HeroScrollVideo } from "@/components/ui/HeroScrollVideo";
import { InteractiveSummary } from "@/components/ui/InteractiveSummary";
import { InfographicOverlay } from "@/components/ui/InfographicOverlay";
import { MapOverlay } from "@/components/ui/MapOverlay";
import { AdvicePortal465 } from "@/components/ui/AdvicePortal465";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [is465Open, setIs465Open] = useState(false);
  const [, setFrameImages] = useState<string[]>([]);

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  const videoUrl = "/vid.mp4";
  const audioUrl = "/aud.m4a";

  return (
    <main className="bg-[#0b0c10] min-h-screen selection:bg-accent/30 selection:text-white">
      {/* 1. CINEMATIC INTRO */}
      <CinematicHero 
        onSummarized={() => setIsSummaryOpen(true)} 
        onShowInfographic={() => setIsInfographicOpen(true)}
        onShowMap={() => setIsMapOpen(true)}
        onShow465={() => setIs465Open(true)}
        audioSrc={audioUrl}
      />

      {/* 2. FLOW SECTION (SCATTERED NARRATIVE) */}
      <HeroScrollVideo 
        videoSrc={videoUrl} 
        onFramesExtracted={(images) => setFrameImages(images)} 
      />

      {/* 3. INFO SECTION / OUTRO (RESTORED) */}
      <section className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
        <div className="bg-grid-theme absolute inset-0 opacity-10 pointer-events-none" />
        
        <div className="text-center mb-12 relative z-10">
            <h2 className="text-silver-matte font-serif italic text-5xl md:text-7xl mb-4">Timeless Governance.</h2>
            <p className="text-white/40 tracking-[0.3em] uppercase text-xs">A single decision defines a legacy.</p>
        </div>
        
        <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group relative z-10 bg-zinc-900/50 backdrop-blur-sm">
            <video 
                src={videoUrl} 
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                controls
            />
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 group cursor-default">
            <p className="text-white/20 text-[10px] uppercase tracking-widest opacity-50">Ancient Sagacity • Modern Mastery</p>
        </div>
      </section>

      {/* 4. OVERLAYS */}
      <InteractiveSummary 
        isOpen={isSummaryOpen} 
        onClose={() => setIsSummaryOpen(false)} 
      />

      <InfographicOverlay 
        isOpen={isInfographicOpen} 
        onClose={() => setIsInfographicOpen(false)} 
      />

      <MapOverlay 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
      />

      <AdvicePortal465 
        isOpen={is465Open} 
        onClose={() => setIs465Open(false)} 
      />
    </main>
  );
}
