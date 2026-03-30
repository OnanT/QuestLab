import React, { useEffect, useRef, useState } from "react";
import { useTypingEngine } from "./hooks/useTypingEngine";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { TargetText } from "./TargetText";
import { ResultModal } from "./ResultModal";
import { apiClient } from "../../../App";
import { Music, Volume2, Keyboard, RotateCcw } from "lucide-react";
import { Button } from "../../ui/button";

export default function TypingGame({ config, gameId, onComplete }) {
  const { target, timeLimit, ambient, narration } = config;
  const engine = useTypingEngine(target);
  const audio = useAudioEngine(
    ambient ? `/audio/typing/ambient/${ambient}` : null,
    narration ? `/audio/typing/narration/${narration}` : null,
    target
  );
  
  const [shellsAwarded, setShellsAwarded] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevLenRef = useRef(0);
  const hasSubmittedRef = useRef(false);
  const containerRef = useRef(null);

  // Focus container on mount for key events
  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.focus();
    }
  }, []);

  const handleKeyDown = async (e) => {
    if (engine.isComplete || isSubmitting) return;
    
    // Ignore meta keys
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Initialize audio on first interaction
    await audio.init();
    audio.startAmbient();

    if (e.key === "Backspace") {
      engine.onBackspace();
      return;
    }

    if (e.key.length === 1) {
      engine.onKeyPress(e.key);
      e.preventDefault(); // Prevent scrolling on space etc.
    }
  };

  // Per-keystroke audio feedback
  useEffect(() => {
    const len = engine.input.length;
    if (len === 0 || len === prevLenRef.current) return;
    
    const isCorrect = engine.charStates[len - 1]?.state === "correct";
    audio.playSfx(isCorrect ? "correct" : "error");
    
    prevLenRef.current = len;
  }, [engine.input, engine.charStates, audio]);

  // Submit on completion
  useEffect(() => {
    if (!engine.isComplete || hasSubmittedRef.current) return;
    
    const submitResult = async () => {
        hasSubmittedRef.current = true;
        setIsSubmitting(true);
        audio.playSfx("complete");
        audio.stopAmbient();

        try {
            const res = await apiClient.post("/api/typing/complete", {
                game_id: gameId,
                input_text: engine.input,
                target,
                time_ms: engine.elapsedMs,
            });
            
            setShellsAwarded(res.data.shells_awarded);
            if (res.data.shells_awarded > 0) {
                audio.playSfx("shells");
            }
        } catch (err) {
            console.error("Failed to submit typing results", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    submitResult();
  }, [engine.isComplete, engine.input, engine.elapsedMs, gameId, target, audio]);

  const handleRetry = () => {
    engine.reset();
    setShellsAwarded(0);
    hasSubmittedRef.current = false;
    prevLenRef.current = 0;
    if (containerRef.current) {
        containerRef.current.focus();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[500px] w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center justify-center outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Header Info */}
      <div className="absolute top-6 left-8 right-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-teal-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Island Challenge</p>
                <h3 className="text-lg font-bold text-slate-900">{config.location || "Coastal Discovery"}</h3>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={audio.playNarration}
              className="rounded-full text-slate-400 hover:text-teal-600 hover:bg-teal-50"
              title="Hear sentence"
            >
                <Volume2 className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRetry}
              className="rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-50"
              title="Reset"
            >
                <RotateCcw className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="w-full max-w-2xl py-12">
        <TargetText 
            charStates={engine.charStates} 
            currentIndex={engine.input.length} 
        />
        
        {/* Progress Bar (Visual only) */}
        <div className="mt-12 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${(engine.input.length / target.length) * 100}%` }}
            />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="absolute bottom-8 flex items-center gap-12">
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
            <p className="text-xl font-bold font-accent text-slate-900">{engine.stats.accuracy}%</p>
        </div>
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Speed</p>
            <p className="text-xl font-bold font-accent text-slate-900">{engine.stats.wpm} <span className="text-xs font-normal">WPM</span></p>
        </div>
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Errors</p>
            <p className="text-xl font-bold font-accent text-slate-900">{engine.stats.errors}</p>
        </div>
      </div>

      {/* Game Over Modal */}
      {engine.isComplete && !isSubmitting && (
        <ResultModal 
            stats={engine.stats} 
            shellsAwarded={shellsAwarded}
            onRetry={handleRetry}
            onExit={() => onComplete?.({ score: engine.stats.accuracy })}
        />
      )}
    </div>
  );
}
