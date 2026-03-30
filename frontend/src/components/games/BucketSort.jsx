import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function BucketSort({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'correct'|'incorrect', bucketId: string }
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    if (config?.items) {
      setShuffledItems([...config.items].sort(() => Math.random() - 0.5));
    }
  }, [config]);

  const currentItem = shuffledItems[currentIndex];

  const handleBucketClick = (bucketId) => {
    if (feedback || isFinished) return;

    const isCorrect = currentItem.bucketId === bucketId;

    if (isCorrect) {
      setFeedback({ type: "correct", bucketId });
      onScoreUpdate(10);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < shuffledItems.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsFinished(true);
          onComplete();
        }
      }, 1000);
    } else {
      setFeedback({ type: "incorrect", bucketId });
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!currentItem || isFinished) return null;

  const progress = (currentIndex / (shuffledItems.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="student-card p-6">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Item {currentIndex + 1} of {shuffledItems.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">Sort this item:</h2>
          <div className="inline-block p-8 bg-white border-4 border-teal-100 rounded-3xl shadow-xl transform transition-all animate-in zoom-in duration-300">
            <p className="text-4xl font-bold text-slate-800">
              {currentItem.text}
            </p>
          </div>
          {currentItem.hint && (
            <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
              <Info className="w-4 h-4" />
              <p className="text-sm italic">{currentItem.hint}</p>
            </div>
          )}
        </div>

        <div className={`grid gap-6 grid-cols-1 sm:grid-cols-${Math.min(config.buckets?.length || 2, 3)}`}>
          {config.buckets?.map((bucket) => {
            const isTarget = feedback?.bucketId === bucket.id;
            const isCorrect = feedback?.type === "correct";
            const isIncorrect = feedback?.type === "incorrect";

            return (
              <button
                key={bucket.id}
                onClick={() => handleBucketClick(bucket.id)}
                className={`
                  relative p-8 rounded-2xl border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-4
                  ${isTarget && isCorrect ? "border-green-500 bg-green-50 scale-105" : 
                    isTarget && isIncorrect ? "border-red-500 bg-red-50 shake" : 
                    "border-teal-100 bg-teal-50/30 hover:border-teal-300 hover:bg-teal-50"}
                `}
              >
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${isTarget && isCorrect ? "bg-green-500 text-white" : 
                    isTarget && isIncorrect ? "bg-red-500 text-white" : 
                    "bg-teal-100 text-teal-600"}
                `}>
                  {isTarget && isCorrect ? <CheckCircle2 className="w-8 h-8" /> : 
                   isTarget && isIncorrect ? <XCircle className="w-8 h-8" /> : 
                   <span className="text-2xl font-bold">{bucket.label[0]}</span>}
                </div>
                <span className="text-xl font-bold text-slate-700">{bucket.label}</span>
                
                {/* Visual feedback for wrong choice */}
                {isTarget && isIncorrect && (
                  <span className="absolute -top-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                    Not here!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}
