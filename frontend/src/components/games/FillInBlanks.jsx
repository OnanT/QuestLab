import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { CheckCircle2, XCircle } from "lucide-react";

export default function FillInBlanks({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [userAnswers, setUserAnswer] = useState({});
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
  const [isFinished, setIsFinished] = useState(false);

  const checkAnswers = () => {
    let allCorrect = true;
    Object.keys(config.blanks).forEach(key => {
      const userAnswer = (userAnswers[key] || "").trim().toLowerCase();
      const correctAnswer = config.blanks[key].answer.toLowerCase();
      if (userAnswer !== correctAnswer) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setFeedback("correct");
      onScoreUpdate(25);
      setTimeout(() => {
        setIsFinished(true);
        onComplete();
      }, 2000);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const renderText = () => {
    const parts = config.text.split(/(\[blank\d+\])/);
    return parts.map((part, index) => {
      const match = part.match(/\[(blank\d+)\]/);
      if (match) {
        const blankId = match[1];
        return (
          <Input
            key={blankId}
            value={userAnswers[blankId] || ""}
            onChange={(e) => setUserAnswer(prev => ({ ...prev, [blankId]: e.target.value }))}
            className={`inline-block w-32 mx-1 h-8 px-2 border-b-2 rounded-none bg-transparent focus:ring-0 focus:border-teal-500 transition-colors ${
              feedback === "correct" ? "border-green-500 text-green-600" : 
              feedback === "incorrect" ? "border-red-500 text-red-600 animate-shake" : "border-slate-300"
            }`}
            placeholder="..."
            disabled={feedback === "correct"}
          />
        );
      }
      return <span key={index} className="text-xl leading-loose">{part}</span>;
    });
  };

  if (isFinished) return null;

  return (
    <div className="space-y-6">
      <div className="student-card p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Complete the Passage</h2>
          <p className="text-slate-500">Fill in the missing words to complete the story!</p>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 mb-8 font-heading text-slate-700">
          {renderText()}
        </div>

        <div className="flex flex-col items-center gap-4">
          {feedback === "correct" && (
            <div className="flex items-center gap-2 text-green-600 font-bold animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
              <span>Perfect! Everything is correct!</span>
            </div>
          )}
          {feedback === "incorrect" && (
            <div className="flex items-center gap-2 text-red-600 font-bold animate-pulse">
              <XCircle className="w-6 h-6" />
              <span>Some words aren't quite right. Try again!</span>
            </div>
          )}

          <Button
            onClick={checkAnswers}
            disabled={feedback === "correct"}
            className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-2xl shadow-lg transition-all transform active:scale-95"
          >
            Check My Answers
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}
