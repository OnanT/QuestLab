import { Star, Award, TrendingUp, User as UserIcon, Trash2, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function ChildCard({ student, onRemove }) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-teal-500/20 border-4 border-white">
            {student.avatar ? (
              <img src={student.avatar} alt={student.display_name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span>{(student.display_name || student.username || 'S')[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-none mb-1">
              {student.display_name || student.username}
            </h3>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-widest leading-none">
              Level {student.level || 1}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Trash2 className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl border-2 border-slate-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-2xl text-slate-900">Remove Student?</AlertDialogTitle>
              <AlertDialogDescription className="font-medium text-slate-500">
                This will permanently delete <span className="text-slate-900 font-bold">{student.display_name || student.username}</span>'s account and all their learning progress. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 mt-6">
              <AlertDialogCancel className="rounded-2xl border-2 border-slate-100 font-bold h-12 px-6">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onRemove(student.id)}
                className="rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold h-12 px-6 border-none"
              >
                Yes, Remove Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-wider">Points</span>
          </div>
          <p className="text-xl font-black text-slate-900">{student.total_points || 0}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-wider">Badges</span>
          </div>
          <p className="text-xl font-black text-slate-900">{Array.isArray(student.badges) ? student.badges.length : 0}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500">Average Accuracy</span>
          <span className="text-teal-600 font-black">{student.average_score || 0}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 rounded-full transition-all duration-1000" 
            style={{ width: `${student.average_score || 0}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 rounded-xl font-bold h-11 border-2 border-slate-100 hover:bg-slate-50">
          Edit Profile
        </Button>
        <Link to={`/parent/reports?studentId=${student.id}`} className="flex-1">
          <Button className="w-full btn-primary rounded-xl font-bold h-11 shadow-md shadow-teal-500/20">
            View Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
