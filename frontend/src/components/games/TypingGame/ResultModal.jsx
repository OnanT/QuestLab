import React from "react";
import { Trophy, Zap, Target, AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "../../ui/button";

export function ResultModal({ stats, shellsAwarded, onRetry, onExit }) {
  const isPassed = stats.accuracy >= 80;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform animate-scaleIn">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isPassed ? "bg-amber-100" : "bg-slate-100"
          }`}>
            {isPassed ? (
              <Trophy className="w-10 h-10 text-amber-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isPassed ? "Incredible!" : "Keep Practicing!"}
          </h2>
          <p className="text-slate-500">
            {isPassed 
              ? "You've mastered this island's keys!" 
              : "Accuracy is the key. Try to get over 80%!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Speed</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.wpm} <span className="text-sm font-normal text-slate-400">WPM</span></p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.accuracy}%</p>
          </div>
        </div>

        {isPassed && shellsAwarded > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3 animate-bounce">
             <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
             </div>
             <div className="text-left">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Reward Earned</p>
                <p className="text-lg font-bold text-amber-900">+{shellsAwarded} Shells</p>
             </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onExit}
            className="flex-1 rounded-xl h-12"
          >
            <Home className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <Button 
            onClick={onRetry}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 shadow-lg shadow-teal-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
