import { useRef, useEffect, useCallback } from "react";

const SFX = {
  correct: "/audio/typing/sfx/key_correct.ogg",
  error: "/audio/typing/sfx/key_error.ogg",
  complete: "/audio/typing/sfx/complete.ogg",
  shells: "/audio/typing/sfx/shells.ogg",
};

export function useAudioEngine(ambientSrc, narrationSrc, targetText) {
  const ctxRef = useRef(null);
  const buffersRef = useRef({});
  const ambientSourceRef = useRef(null);
  const isInitialized = useRef(false);

  const init = useCallback(async () => {
    if (isInitialized.current) return;
    
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        ctxRef.current = ctx;

        // Preload SFX
        await Promise.all(
          Object.entries(SFX).map(async ([key, url]) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return;
                const buf = await res.arrayBuffer();
                buffersRef.current[key] = await ctx.decodeAudioData(buf);
            } catch (err) {
                console.warn(`Failed to load SFX: ${key}`, err);
            }
          })
        );
        
        isInitialized.current = true;
    } catch (err) {
        console.error("Audio Engine failed to initialize", err);
    }
  }, []);

  const playSfx = useCallback((key) => {
    const ctx = ctxRef.current;
    const buf = buffersRef.current[key];
    if (!ctx || !buf) return;
    
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  }, []);

  const startAmbient = useCallback(async () => {
    const ctx = ctxRef.current;
    if (!ctx || !ambientSrc || ambientSourceRef.current) return;

    try {
        const res = await fetch(ambientSrc);
        if (!res.ok) return;
        const raw = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(raw);
        
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = 0.2; // Low background volume
        
        src.buffer = buf;
        src.loop = true;
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start(0);
        ambientSourceRef.current = src;
    } catch (err) {
        console.warn("Failed to start ambient audio", err);
    }
  }, [ambientSrc]);

  const stopAmbient = useCallback(() => {
    if (ambientSourceRef.current) {
        try {
            ambientSourceRef.current.stop();
        } catch (e) {}
        ambientSourceRef.current = null;
    }
  }, []);

  const playNarration = useCallback(async () => {
    const ctx = ctxRef.current;
    
    // Try to play audio file if provided
    if (ctx && narrationSrc) {
        try {
            const res = await fetch(narrationSrc);
            if (res.ok) {
                const raw = await res.arrayBuffer();
                const buf = await ctx.decodeAudioData(raw);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                src.connect(ctx.destination);
                src.start(0);
                return;
            }
        } catch (err) {
            console.warn("Narration file failed, falling back to TTS", err);
        }
    }

    // Fallback: Web Speech API (TTS)
    if ('speechSynthesis' in window && targetText) {
        const utterance = new SpeechSynthesisUtterance(targetText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
  }, [narrationSrc, targetText]);

  useEffect(() => {
    return () => stopAmbient();
  }, [stopAmbient]);

  return { init, playSfx, startAmbient, stopAmbient, playNarration };
}
