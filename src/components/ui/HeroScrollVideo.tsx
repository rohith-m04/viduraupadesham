"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { LinkPreview } from "./link-preview";
import { frameAnalyses } from "@/lib/summary-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const positions = [
    { x: -0.8, y: -0.6}, { x: 0.7, y: 0.4 }, { x: -0.5, y: 0.7 }, { x: 0.6, y: -0.5 }, { x: -0.8, y: 0.2 }, { x: 0.8, y: -0.3 }, { x: -0.6, y: -0.8 }, { x: 0.4, y: 0.6 }, { x: -0.7, y: 0.5 }, { x: 0.5, y: -0.7 }, { x: -0.4, y: -0.4 }, { x: 0.3, y: 0.8 }, { x: -0.8, y: 0.3 }, { x: 0.6, y: 0.2 }, { x: -0.2, y: -0.7 }, { x: 0.7, y: -0.6 }, { x: -0.5, y: 0.4 }, { x: 0.4, y: -0.4 }, { x: -0.6, y: 0.6 }, { x: 0.8, y: 0.5 }, { x: -0.3, y: -0.5 }, { x: 0.5, y: 0.3 }, { x: -0.7, y: -0.2 }, { x: 0.2, y: 0.7 }, { x: -0.4, y: 0.8 }, { x: 0.6, y: -0.8 }, { x: -0.8, y: 0.1 }, { x: 0, y: 0 }
];

interface HeroScrollVideoProps {
  videoSrc: string;
  onFramesExtracted: (images: string[]) => void;
}

export function HeroScrollVideo({ videoSrc, onFramesExtracted }: HeroScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tempVideoRef = useRef<HTMLVideoElement>(null);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [localFrameImages, setLocalFrameImages] = useState<string[]>([]);
  const cardsRef = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const numFrames = 28;
    const video = tempVideoRef.current;
    if (!video) return;

    const extractFrames = async () => {
        if (framesLoaded) return;
        const duration = video.duration;
        if (!duration) return;

        const images: string[] = [];
        for (let i = 0; i < numFrames; i++) {
            video.currentTime = (i / (numFrames - 1)) * duration;
            await new Promise<void>(r => {
                const onSeeked = () => {
                    video.removeEventListener('seeked', onSeeked);
                    r();
                };
                video.addEventListener('seeked', onSeeked);
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth / 2;
            canvas.height = video.videoHeight / 2;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/webp", 0.6);
            images.push(dataUrl);
            
            const cardCanvas = cardsRef.current[i];
            if (cardCanvas) {
                cardCanvas.width = canvas.width;
                cardCanvas.height = canvas.height;
                cardCanvas.getContext('2d')?.drawImage(canvas, 0, 0);
            }
        }
        setLocalFrameImages(images);
        onFramesExtracted(images);
        setFramesLoaded(true);
    };

    if (video.readyState >= 2) extractFrames();
    else video.onloadeddata = extractFrames;
  }, [videoSrc, framesLoaded, onFramesExtracted]);

  useEffect(() => {
    if (!framesLoaded) return;

    const sH = window.innerHeight;
    const sW = window.innerWidth;
    const isMobile = sW < 800;
    const spread = isMobile ? 1.4 : 0.9;

    const cards = containerRef.current?.querySelectorAll<HTMLElement>('.flow-card');
    if (!cards) return;

    const initPos = Array.from({ length: 28 }).map(() => ({ x: 0, y: 0, z: -1500, scale: 0, opacity: 0 }));
    const finalPos = positions.map((pos) => ({
      x: pos.x * sW * spread,
      y: pos.y * sH * spread,
      z: 1500,
      scale: 1,
      opacity: 1
    }));

    cards.forEach((card, i) => gsap.set(card, initPos[i]));

    const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${sH * 8}px`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            const frameIndex = Math.min(27, Math.floor(progress * 28));
            setCurrentThought(frameAnalyses[frameIndex]);

            cards.forEach((card, i) => {
                const imgDelay = i * 0.025;
                const imgProgress = Math.max(0, (progress - imgDelay) * 4);
                
                if (imgProgress <= 0) {
                    gsap.set(card, { opacity: 0, z: -1500 });
                    return;
                }

                if (imgProgress >= 1.5 && i < cards.length - 1) {
                    gsap.set(card, { opacity: 0 });
                    return;
                }

                const start = initPos[i];
                const end = finalPos[i];

                let x = gsap.utils.interpolate(start.x, end.x, imgProgress);
                let y = gsap.utils.interpolate(start.y, end.y, imgProgress);
                let z = gsap.utils.interpolate(start.z, end.z, imgProgress);
                const scale = gsap.utils.interpolate(start.scale, end.scale, imgProgress);
                const opacity = imgProgress < 0.1 ? imgProgress * 10 : 1;
                
                if (i === cards.length - 1) {
                    x = 0; y = 0; z = z * 0.4;
                }
                
                gsap.set(card, { x, y, z, scale, opacity });
            });
        }
    });

    return () => st.kill();
  }, [framesLoaded]);

  return (
    <section ref={sectionRef} className="relative h-screen w-screen overflow-hidden bg-[#0A0A0A] selection:bg-white/10">
        <div className="bg-grid-theme absolute inset-0 opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[5]" />
        
        {/* Floating Narrative Overlay */}
        <div className="absolute inset-x-0 bottom-12 flex items-center justify-center z-[200] pointer-events-none px-6">
            <p className="text-white/40 font-serif italic text-base md:text-xl leading-snug tracking-wide text-center max-w-2xl transition-all duration-300 transform translate-y-0 opacity-100">
                {currentThought || "Commencing Discourse..."}
            </p>
        </div>
        
        <div ref={containerRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d', perspective: '2000px' }}>
            {positions.map((pos, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "flow-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] aspect-video rounded-2xl overflow-visible",
                        i === positions.length - 1 && "z-10"
                    )}
                >
                    <LinkPreview 
                        url="#" 
                        isStatic 
                        imageSrc={localFrameImages[i] || ""} 
                        className="w-full h-full"
                    >
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10 group bg-zinc-900">
                            <canvas 
                                ref={(el) => { cardsRef.current[i] = el; }} 
                                className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </LinkPreview>
                </div>
            ))}
        </div>

        <video ref={tempVideoRef} src={videoSrc} muted playsInline style={{ display: 'none' }} />
    </section>
  );
}
