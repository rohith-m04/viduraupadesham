"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressiveBlur } from "./progressive-blur";

interface InteractiveSummaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const summaryText = `**The Premise and Context**
The book presents a collection of ancient Indian wisdom delivered in 3140 B.C. by the wise minister Vidura to King Dhritarashtra in the epic Mahabharata. The discourse takes place when Dhritarashtra is plagued by extreme guilt, stress, and sleeplessness due to the unrighteous actions of his son Duryodhana against the Pandavas. Seeking solace and clarity, the king calls upon Vidura, who delivers a profound set of 465 teachings that cover **personality development, psychology, dharma (duty/righteousness), justice, and statecraft**.

**Modern Management and the "Ideal Manager"**
A central theme of this compilation is bridging ancient wisdom with modern applications. The introduction frames Vidura's advice as a foundational text for the **"Ideal Manager."** Unlike fragmented modern management theories, this Indian management concept is presented as a holistic approach that seamlessly integrates the mind, body, family, society, and the nation.

**Key Themes of the 465 Advices**
The 465 specific points of advice traverse various aspects of human life and leadership:

*   **The Wise Person (Pandit) vs. The Fool (Moodha):** Vidura clearly distinguishes between intellect and ignorance. A wise person is defined as someone who acts according to dharma, remains unaffected by anger or arrogance, plans thoroughly before acting, and is not swayed by extremes of joy or sorrow. Conversely, a fool is someone who desires the unattainable, hates those who are learned, enters uninvited, speaks without being asked, and trusts the untrustworthy.
*   **The Three Gates to Hell:** Vidura warns that **lust (Kama), anger (Krodha), and greed (Lobha)** are the three gates to hell that destroy the soul and must be abandoned entirely.
*   **Leadership and Statecraft:** Rulers and administrators are advised to govern with fairness and subtle diplomacy. A famous analogy used is that **a king should collect taxes from his subjects just as a bee gathers nectar from a flower—without harming or destroying the plant**. Kings are also warned that alienating subjects through harshness or unethical behavior will ultimately destroy their kingdom.
*   **Mastery over the Senses:** Self-control is paramount. The human body is compared to a chariot, where the intellect is the charioteer and the five senses are the horses. If a person cannot control these sensory "horse," they will be led to destruction, but a skilled "charioteer" navigates life comfortably. 
*   **The Power of Words:** Vidura places heavy emphasis on speech. While a forest cut down by an axe can grow back, **a deep wound caused by harsh, abusive words will never heal**. Words should be measured, truthful, and pleasant.
*   **Essential Virtues:** Humans are instructed never to abandon six core qualities: **truth, charity, diligence, absence of envy, forgiveness, and courage**. Furthermore, forgiveness is highlighted not as a weakness, but as the ultimate strength of both the powerful and the weak.

**Conclusion**
Ultimately, the book serves as a timeless manual for navigating personal dilemmas, ethical conflicts, and leadership challenges. By extracting these 465 specific verses, the text aims to show that the administrative, psychological, and social guidelines of ancient India are **highly practical and deeply relevant to modern readers seeking a successful and righteous life**.`;

export function InteractiveSummary({ isOpen, onClose }: InteractiveSummaryProps) {
  // Robust Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0b0c10]"
        >
          <div className="relative h-full w-full flex flex-col items-center overflow-hidden">
            <ProgressiveBlur position="top" backgroundColor="#0b0c10" height="200px" blurAmount="16px" />
            <ProgressiveBlur position="bottom" backgroundColor="#0b0c10" height="200px" blurAmount="16px" />

            <button
                suppressHydrationWarning
                onClick={onClose}
                className="fixed top-8 right-8 text-white/20 hover:text-white transition-colors z-[2001]"
            >
                <X size={40} />
            </button>

            <div 
                className="flex h-full w-full flex-col items-center overflow-y-auto px-6 py-48 no-scrollbar select-text selection:bg-white/20" 
                data-lenis-prevent
            >
                <div className="max-w-5xl w-full flex flex-col items-center">
                    <header className="mb-32 text-center">
                        <div className="grid content-start justify-items-center gap-6 text-center text-white mb-20 pointer-events-none">
                            <span className="relative max-w-[12ch] text-[9px] uppercase leading-tight opacity-30 after:absolute after:left-1/2 after:top-full after:h-20 after:w-px after:bg-gradient-to-b after:from-white/40 after:to-transparent after:content-[''] font-bold tracking-[0.4em]">
                                Scholarly Summary
                            </span>
                        </div>
                        <h2 className="text-silver-matte font-serif italic text-6xl md:text-7xl leading-tight mt-12 opacity-90">The Wisdom of Vidura</h2>
                        <p className="text-white/20 uppercase tracking-[0.5em] text-[9px] mt-8 font-bold">Definitive Academic Resource • 3140 B.C.</p>
                    </header>
                    
                    <div className="w-full space-y-20 text-justify">
                        {summaryText.split('\n\n').map((paragraph, i) => (
                           <p key={i} className="text-white/50 font-sans text-lg md:text-xl leading-relaxed transition-colors duration-700 hover:text-white/80 group">
                               {paragraph.split('**').map((part, j) => 
                                   j % 2 === 1 ? <strong key={j} className="text-silver-matte font-bold group-hover:text-white transition-colors underline decoration-white/10 underline-offset-8">{part}</strong> : part
                               )}
                           </p>
                        ))}
                    </div>

                    <footer className="border-t border-white/5 pt-20 pb-48 w-full flex justify-between items-center opacity-10 text-[8px] tracking-[0.8em] uppercase font-bold text-white mt-48">
                        <p>Academic Heritage</p>
                        <p>Mahabharata Project • V17</p>
                    </footer>
                </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
