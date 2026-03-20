import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 z-40 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl shadow-teal-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group overflow-hidden"
        aria-label="Give Feedback"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquarePlus className="w-6 h-6" />
        
        {/* Tooltip-like label on hover (desktop only) */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Feedback
        </span>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
