import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

export default function SentenceBuilder({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [isFinished, setIsFinished] = useState(false);

  const currentPrompt = config.prompts?.[currentIndex];

  useEffect(() => {
    if (currentPrompt) {
      initializePrompt();
    }
  }, [currentIndex, config]);

  const initializePrompt = () => {
    let words = [];
    if (currentPrompt.shuffled) {
      words = [...currentPrompt.shuffled];
    } else {
      words = currentPrompt.target.split(" ");
      // Shuffle words
      words = words.sort(() => Math.random() - 0.5);
    }

    if (currentPrompt.distractors) {
      words = [...words, ...currentPrompt.distractors].sort(() => Math.random() - 0.5);
    }

    setShuffledWords(words.map((w, i) => ({ id: i, text: w })));
    setSelectedWords([]);
    setFeedback(null);
  };

  const handleWordClick = (word) => {
    if (feedback === "correct") return;
    
    // Remove from shuffled, add to selected
    setShuffledWords(prev => prev.filter(w => w.id !== word.id));
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (word) => {
    if (feedback === "correct") return;

    // Remove from selected, add back to shuffled
    setSelectedWords(prev => prev.filter(w => w.id !== word.id));
    setShuffledWords(prev => [...prev, word]);
  };

  const checkAnswer = () => {
    const answer = selectedWords.map(w => w.text).join(" ");
    const isCorrect = answer.toLowerCase() === currentPrompt.target.toLowerCase();

    if (isCorrect) {
      setFeedback("correct");
      onScoreUpdate(15);
      
      setTimeout(() => {
        if (currentIndex < config.prompts.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsFinished(true);
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const resetPrompt = () => {
    initializePrompt();
  };

  if (isFinished) return null;

  const progress = ((currentIndex) / (config.prompts?.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="student-card p-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Sentence {currentIndex + 1} of {config.prompts?.length || 0}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-700 mb-2">Build the sentence:</h2>
          {currentPrompt.hint && <p className="text-sm text-slate-500 italic">Hint: {currentPrompt.hint}</p>}
        </div>

        {/* Selected Words Area */}
        <div className={`
          min-h-[100px] p-4 rounded-2xl border-2 border-dashed mb-6 flex flex-wrap gap-2 items-center justify-center transition-colors
          ${feedback === "correct" ? "border-green-300 bg-green-50" : feedback === "incorrect" ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50/50"}
        `}>
          {selectedWords.length === 0 && (
            <span className="text-slate-400">Tap words to build your sentence...</span>
          )}
          {selectedWords.map((word) => (
            <button
              key={`selected-${word.id}`}
              onClick={() => handleRemoveWord(word)}
              className="px-4 py-2 bg-white border-2 border-teal-100 rounded-xl shadow-sm text-teal-700 font-bold hover:border-red-200 hover:text-red-500 transition-all transform active:scale-95"
            >
              {word.text}
            </button>
          ))}
          
          {feedback === "correct" && (
            <div className="w-full flex justify-center mt-2 animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          )}
          {feedback === "incorrect" && (
            <div className="w-full flex justify-center mt-2">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          )}
        </div>

        {/* Shuffled Words Area */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {shuffledWords.map((word) => (
            <button
              key={`shuffled-${word.id}`}
              onClick={() => handleWordClick(word)}
              disabled={feedback === "correct"}
              className="px-5 py-2.5 bg-teal-50 border-2 border-teal-200 rounded-xl text-teal-800 font-bold hover:bg-teal-100 hover:scale-105 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {word.text}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={resetPrompt}
            className="flex-1 rounded-xl py-6 border-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={checkAnswer}
            disabled={selectedWords.length === 0 || feedback === "correct"}
            className="flex-[2] rounded-xl py-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-md"
          >
            Check Sentence
          </Button>
        </div>
      </div>
    </div>
  );
}
