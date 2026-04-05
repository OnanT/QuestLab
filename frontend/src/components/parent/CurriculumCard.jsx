import { BookOpen, Gamepad2, PlayCircle, Info, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function CurriculumCard({ item, type, students = [], status = [] }) {
  // Find which students have completed this item
  const completions = status.filter(s => s.completed);
  
  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Badge className={type === 'lesson' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-orange-50 text-orange-600 border-orange-100'}>
          {type === 'lesson' ? <BookOpen className="w-3 h-3 mr-1" /> : <Gamepad2 className="w-3 h-3 mr-1" />}
          {type === 'lesson' ? 'Lesson' : 'Game'}
        </Badge>
      </div>

      <div className="flex flex-col h-full">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${
          type === 'lesson' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-orange-50 text-orange-600 border-orange-100'
        }`}>
          {type === 'lesson' ? <BookOpen className="w-7 h-7" /> : <Gamepad2 className="w-7 h-7" />}
        </div>

        <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-teal-600 transition-colors">
          {item.title || item.name}
        </h3>
        
        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 flex-1">
          {item.description || "Learn and master this topic with interactive content and challenges."}
        </p>

        {/* Child Completion Status */}
        {students.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <TooltipProvider>
              {students.map(student => {
                const isCompleted = completions.some(c => c.student_id === student.id);
                return (
                  <Tooltip key={student.id}>
                    <TooltipTrigger asChild>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                        isCompleted 
                          ? "bg-teal-500 border-teal-200 text-white" 
                          : "bg-slate-100 border-white text-slate-400"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          (student.display_name || student.username)[0].toUpperCase()
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-xl font-bold">
                      {student.display_name || student.username}: {isCompleted ? 'Completed' : 'Not started'}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</span>
            <span className="text-sm font-black text-amber-500">{item.points || 0} Points</span>
          </div>
          <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
