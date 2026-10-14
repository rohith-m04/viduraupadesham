"use client"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check } from "lucide-react"

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

interface SummaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => Promise<void> | void
}

export function SummaryButton({
  className,
  onClick,
  ...props
}: SummaryButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  const handleAction = async () => {
    if (status === "idle") {
      setStatus("saving")
      try {
        if (onClick) {
          await onClick()
        } else {
          await new Promise(resolve => setTimeout(resolve, 800))
        }
        setStatus("saved")
        setTimeout(() => setStatus("idle"), 3000)
      } catch {
        setStatus("idle")
      }
    }
  }

  return (
    <button
      suppressHydrationWarning
      onClick={handleAction}
      className={cn(
        'inline-flex h-14 animate-[shimmer2_3s_infinite_linear] items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(110deg,rgba(0,0,0,0.2),45%,rgba(255,255,255,0.1),55%,rgba(0,0,0,0.2))] bg-[length:200%_100%] px-12 font-bold text-white/70 transition-all hover:text-white hover:scale-105 active:scale-95 focus:outline-none tracking-[0.3em] uppercase text-[10px] md:text-xs backdrop-blur-sm shadow-2xl',
        status === 'saving' && 'bg-blue-600/50 animate-none',
        status === 'saved' && 'bg-green-600/50 animate-none',
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {status === "saving" ? (
          <motion.span key="saving" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" /> OPENING...
          </motion.span>
        ) : status === "saved" ? (
          <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
            <Check className="w-3 h-3" /> ENJOY!
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            SUMMARY
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
