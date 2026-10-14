"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioConsoleProps {
  audioSrc: string;
  className?: string;
}

export function AudioConsole({ audioSrc, className }: AudioConsoleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSpeed = () => {
    if (audioRef.current) {
      const newRate = playbackRate === 1 ? 2 : 1;
      audioRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
        if (!isNaN(audio.currentTime)) {
            setCurrentTime(audio.currentTime);
        }
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    
    if (audio.readyState >= 1) {
        setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={cn("flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/5 bg-black/5 backdrop-blur-xl transition-all hover:bg-black/10", className)}>
      <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
      
      {/* Play/Pause Button - Fixed size 14px to match thumb */}
      <button 
        suppressHydrationWarning
        onClick={togglePlay}
        className="flex items-center justify-center text-white/30 hover:text-white transition-all transform active:scale-90 w-[14px] h-[14px]"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>

      {/* Slider Container - Vertically Centered */}
      <div className="flex flex-col justify-center min-w-[100px] h-[14px] relative group">
        <input 
          suppressHydrationWarning
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-px bg-white/10 rounded-full appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] 
                     [&::-webkit-slider-thumb]:bg-white/20 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all 
                     [&::-webkit-slider-thumb]:hover:bg-white/40 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.05)]
                     [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:bg-white/20 
                     [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:hover:bg-white/40"
        />
        
        {/* Floating Time Indicators */}
        <div className="absolute top-[18px] left-0 right-0 flex justify-between text-[5px] font-black tracking-[0.2em] text-white/5 font-mono pointer-events-none transition-opacity group-hover:opacity-10 opacity-0">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-px h-3 bg-white/5" />

      {/* Speed Button */}
      <button 
        suppressHydrationWarning
        onClick={toggleSpeed}
        className={cn(
            "text-[7px] font-black tracking-tighter transition-all px-1.5 py-0.5 rounded border border-transparent transform active:scale-90",
            playbackRate === 2 ? "bg-accent/10 text-accent border-accent/10" : "text-white/10 hover:text-white"
        )}
      >
        {playbackRate}x
      </button>
    </div>
  );
}
