import React from "react";

export function TargetText({ charStates, currentIndex }) {
  return (
    <div className="text-2xl md:text-3xl font-mono tracking-widest leading-relaxed select-none break-words text-center">
      {charStates.map(({ char, state }, i) => (
        <span
          key={i}
          className={`relative ${
            state === "correct" ? "text-teal-500" : 
            state === "error" ? "text-red-500 bg-red-100" : 
            "text-slate-400"
          } ${i === currentIndex ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500 after:animate-pulse" : ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
