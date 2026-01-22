import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { 
  Home, BookOpen, HelpCircle, Gamepad2, Trophy, Award, LogOut, Star, Medal, Flame
} from "lucide-react";

export default function StudentNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-accent">Q</span>
              </div>
              <span className="text-xl font-bold font-heading text-slate-800 hidden sm:block">QuestLab</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <Home className="w-4 h-4 inline mr-1" /> Home
              </Link>
              <Link to="/lessons" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <BookOpen className="w-4 h-4 inline mr-1" /> Lessons
              </Link>
              <Link to="/quizzes" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <HelpCircle className="w-4 h-4 inline mr-1" /> Quizzes
              </Link>
              <Link to="/games" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <Gamepad2 className="w-4 h-4 inline mr-1" /> Games
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="font-accent font-semibold text-amber-700 text-sm">{user?.points || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-teal-100 px-3 py-1.5 rounded-full">
                <Medal className="w-4 h-4 text-teal-600" />
                <span className="font-accent font-semibold text-teal-700 text-sm">Lvl {user?.level || 1}</span>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-2">
              <Link to="/achievements" className="p-2 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
                <Award className="w-5 h-5 text-purple-500" />
              </Link>
              <Link to="/leaderboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
                <Trophy className="w-5 h-5 text-amber-500" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.display_name?.[0]?.toUpperCase()}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
