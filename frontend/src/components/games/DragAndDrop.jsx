import { useState, useEffect } from "react";
import { Progress } from "../ui/progress";
import { CheckCircle2, GripVertical } from "lucide-react";

export default function DragAndDrop({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [pairs, setPairs] = useState([]);
  const [connections, setConnections] = useState({}); // { sourceIndex: targetIndex }
  const [draggedItem, setDraggedItem] = useState(null); // { type: 'source'|'target', index: number }
  const [solved, setSolved] = useState([]); // Array of source indices
  const [shuffledTargets, setShuffledTargets] = useState([]);

  useEffect(() => {
    if (config?.pairs) {
      setPairs(config.pairs);
      const targets = config.pairs.map((p, i) => ({ ...p, originalIndex: i }));
      setShuffledTargets([...targets].sort(() => Math.random() - 0.5));
    }
  }, [config]);

  const handleDragStart = (e, type, index) => {
    setDraggedItem({ type, index });
    e.dataTransfer.setData("text/plain", `${type}:${index}`);
  };

  const handleDrop = (e, targetType, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type !== targetType) {
      const sourceIdx = draggedItem.type === "source" ? draggedItem.index : targetIndex;
      const targetObjIdx = draggedItem.type === "target" ? draggedItem.index : targetIndex;
      
      const targetObj = shuffledTargets[targetObjIdx];
      
      if (sourceIdx === targetObj.originalIndex) {
        // Correct match!
        if (!solved.includes(sourceIdx)) {
          const newSolved = [...solved, sourceIdx];
          setSolved(newSolved);
          onScoreUpdate(10);
          
          if (newSolved.length === pairs.length) {
            setTimeout(onComplete, 1500);
          }
        }
      } else {
        // Visual feedback for wrong match can be added here
      }
    }
    setDraggedItem(null);
  };

  const progress = (solved.length / (pairs.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <div className="student-card p-8">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
            <span>Matches Found: {solved.length} of {pairs.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-12 relative">
          {/* Source Column */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-slate-400 uppercase text-xs tracking-widest mb-6">Column A</h3>
            {pairs.map((pair, index) => {
              const isSolved = solved.includes(index);
              return (
                <div
                  key={`source-${index}`}
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, "source", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "source", index)}
                  className={`
                    p-4 rounded-2xl border-2 flex items-center justify-between transition-all group
                    ${isSolved 
                      ? "border-green-200 bg-green-50 text-green-700 opacity-60" 
                      : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-md cursor-grab active:cursor-grabbing"}
                  `}
                >
                  <span className="font-bold">{pair.source}</span>
                  {!isSolved && <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-teal-400" />}
                  {isSolved && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
              );
            })}
          </div>

          {/* Target Column */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-slate-400 uppercase text-xs tracking-widest mb-6">Column B</h3>
            {shuffledTargets.map((target, index) => {
              const isSolved = solved.includes(target.originalIndex);
              return (
                <div
                  key={`target-${index}`}
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, "target", index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, "target", index)}
                  className={`
                    p-4 rounded-2xl border-2 flex items-center justify-between transition-all group
                    ${isSolved 
                      ? "border-green-200 bg-green-50 text-green-700 opacity-60" 
                      : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-md cursor-grab active:cursor-grabbing"}
                  `}
                >
                  <span className="font-bold">{target.target}</span>
                  {!isSolved && <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-teal-400" />}
                  {isSolved && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-sm italic">
          Tip: Drag items from one column to their match in the other column!
        </div>
      </div>
    </div>
  );
}
