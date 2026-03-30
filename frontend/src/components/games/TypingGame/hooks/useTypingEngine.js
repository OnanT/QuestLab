import { useState, useRef, useMemo, useCallback, useEffect } from "react";

export function useTypingEngine(target) {
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(null);
  const [lastCharTime, setLastCharTime] = useState(0);

  const onKeyPress = useCallback(
    (char) => {
      if (isComplete) return;
      if (!startTimeRef.current) startTimeRef.current = Date.now();

      setInput((prev) => {
        const next = prev + char;
        setLastCharTime(Date.now());
        if (next.length >= target.length) {
            setIsComplete(true);
        }
        return next;
      });
    },
    [isComplete, target.length]
  );

  const onBackspace = useCallback(() => {
    if (isComplete) return;
    setInput((prev) => prev.slice(0, -1));
  }, [isComplete]);

  const stats = useMemo(() => {
    if (!startTimeRef.current || input.length === 0) return { accuracy: 0, wpm: 0, errors: 0 };
    
    const elapsed = Date.now() - startTimeRef.current;
    
    // Calculate errors based on what's typed so far
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== target[i]) errors++;
    }
    
    const accuracy = ((input.length - errors) / input.length) * 100;
    
    // WPM: (chars / 5) / (minutes)
    // Avoid division by zero
    const minutes = elapsed / 60000;
    const wpm = (input.length / 5) / (minutes > 0 ? minutes : 1/60000);
    
    return {
      accuracy: Math.round(accuracy),
      wpm: Math.round(wpm),
      errors,
      elapsed,
    };
  }, [input, target, lastCharTime]); // lastCharTime forces re-calculation on each char

  const reset = useCallback(() => {
    setInput("");
    setIsComplete(false);
    startTimeRef.current = null;
    setLastCharTime(0);
  }, []);

  // Per-character state array for rendering
  const charStates = useMemo(
    () =>
      target.split("").map((char, i) => {
        let state = "pending";
        if (i < input.length) {
            state = input[i] === char ? "correct" : "error";
        }
        return { char, state };
      }),
    [input, target]
  );

  return {
    input,
    charStates,
    stats,
    isComplete,
    elapsedMs: startTimeRef.current ? Date.now() - startTimeRef.current : 0,
    onKeyPress,
    onBackspace,
    reset,
  };
}
