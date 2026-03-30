import { Progress } from "../ui/progress";

export default function QuizBattle({ 
  config, 
  currentIndex, 
  onAnswer, 
  progress 
}) {
  const question = config.questions?.[currentIndex];

  return (
    <div className="student-card p-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Question {currentIndex + 1} of {config.questions?.length || 0}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 text-center">
        {question?.question}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {question?.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => onAnswer(option)}
            className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all font-medium text-slate-700"
            data-testid={`quiz-battle-option-${i}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}