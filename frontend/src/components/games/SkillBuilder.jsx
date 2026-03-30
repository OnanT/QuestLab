import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export default function SkillBuilder({ 
  config, 
  currentIndex, 
  userAnswer, 
  setUserAnswer, 
  onAnswer, 
  progress 
}) {
  const problem = config.problems?.[currentIndex];

  return (
    <div className="student-card p-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Problem {currentIndex + 1} of {config.problems?.length || 0}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="text-center mb-8">
        <p className="text-4xl font-bold font-heading text-slate-900 mb-2">
          {problem?.question}
        </p>
        {problem?.hint && (
          <p className="text-sm text-slate-500">Hint: {problem.hint}</p>
        )}
      </div>
      
      <div className="flex gap-4">
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAnswer()}
          placeholder="Your answer"
          className="skill-builder-input flex-1"
          autoFocus
          data-testid="skill-builder-input"
        />
        <Button 
          onClick={onAnswer} 
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8" 
          data-testid="submit-answer-btn"
        >
          Check
        </Button>
      </div>
    </div>
  );
}