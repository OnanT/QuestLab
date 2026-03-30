import { Trophy, ChevronRight } from "lucide-react";

export default function StoryQuest({ 
  config, 
  currentIndex, 
  onChoice, 
  score, 
  bonusPoints 
}) {
  const scene = config.scenes?.[currentIndex];

  if (!scene) return <p>Loading scene...</p>;

  return (
    <div className="student-card p-8">
      <div className="prose prose-slate max-w-none mb-8">
        <p className="text-lg text-slate-700 leading-relaxed">{scene.text}</p>
      </div>
      
      {scene.ending ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-2xl font-bold font-heading text-slate-900">The End</p>
          <p className="text-slate-600 mt-2">Final Score: {score + bonusPoints}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scene.choices?.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoice(choice)}
              className="w-full p-4 bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:from-purple-100 transition-all text-left flex items-center gap-4"
              data-testid={`story-choice-${i}`}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-slate-700">{choice.text}</span>
              {choice.bonus_points > 0 && (
                <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  +{choice.bonus_points} bonus
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}