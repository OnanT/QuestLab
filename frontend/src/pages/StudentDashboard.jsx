import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { useDashboardData } from "../hooks/useDashboardData";
import { Button } from "../components/ui/button";
import StudentNav from "./StudentNav";
import { 
  BookOpen, Gamepad2, Trophy, Star, Flame, Target, 
  ChevronRight, Award, HelpCircle, RefreshCw,
  AlertCircle, Sparkles, Zap
} from "lucide-react";

// Memoized helper constants
const GAME_TYPE_ICON = {
  1: Target,
  2: Flame,
  3: BookOpen,
  4: Gamepad2,
};

const GAME_TYPE_COLOR = {
  1: "from-blue-400 to-blue-600",
  2: "from-red-400 to-red-600",
  3: "from-purple-400 to-purple-600",
  4: "from-green-400 to-green-600",
};

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const { progress, subjects, recentGames, loading, error, refetch } = useDashboardData(updateUser);

  // Calculate level progress
  const levelProgress = useMemo(() => {
    if (!progress) return 0;
    const currentPoints = Number(progress.points || 0);
    const currentLevel = Number(progress.level || 1);
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progressInLevel = currentPoints - pointsForCurrentLevel;
    const totalNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return Math.min(Math.max((progressInLevel / totalNeeded) * 100, 0), 100);
  }, [progress]);

  const pointsToNextLevel = useMemo(() => {
    if (!progress) return 0;
    const currentLevel = Number(progress.level || 1);
    return (currentLevel * 100) - (progress.points || 0);
  }, [progress]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <StudentNav />
        <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-8">
          <div className="space-y-8 animate-pulse">
            <div className="space-y-3">
              <div className="h-10 bg-slate-200 rounded-xl w-64"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-48"></div>
            </div>
            <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <StudentNav />
        <main role="main" className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-8">{error}</p>
            <Button onClick={refetch} className="btn-primary w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" data-testid="student-dashboard">
      <StudentNav />

      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-12">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 mb-2">
            Hi, {user?.display_name?.split(" ")[0] || user?.username}! 👋
          </h1>
          <p className="text-slate-500 text-lg">Ready for today's learning adventure?</p>
        </div>

        {/* Level Progress Card */}
        <div className="student-card p-6 md:p-8 mb-8 bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100/50 shadow-teal-900/5 animate-fadeInUp stagger-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">Level {progress?.level || 1}</p>
                <p className="text-sm font-medium text-slate-500">
                  <span className="text-teal-600 font-bold">{pointsToNextLevel} XP</span> to Level {(progress?.level || 1) + 1}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-between md:block md:text-right">
              <p className="text-3xl font-black font-accent text-teal-700 tabular-nums">
                {Math.round(levelProgress)}%
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Level Progress</p>
            </div>
          </div>
          <div 
            className="w-full bg-slate-200/70 rounded-full h-3.5 overflow-hidden border border-slate-200/50 shadow-inner"
            role="progressbar"
            aria-valuenow={Math.round(levelProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Level ${progress?.level || 1} progress: ${Math.round(levelProgress)}%`}
          >
            <div 
              className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-sky-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(45,212,191,0.5)]"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 animate-fadeInUp stagger-2">
          <StatCard 
            icon={Star} 
            label="Total Points" 
            value={progress?.points || 0} 
            color="amber" 
          />
          <StatCard 
            icon={HelpCircle} 
            label="Quizzes" 
            value={progress?.quizzes_completed || 0} 
            color="teal" 
          />
          <StatCard 
            icon={Gamepad2} 
            label="Games" 
            value={progress?.games_played || 0} 
            color="purple" 
          />
          <StatCard 
            icon={Award} 
            label="Badges" 
            value={progress?.badges?.length || 0} 
            color="orange" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fadeInUp stagger-3">
          <ActionLink 
            to="/lessons" 
            icon={BookOpen} 
            title="Lessons" 
            desc="Explore new worlds of knowledge" 
            color="teal"
            testId="go-to-lessons"
          />
          <ActionLink 
            to="/quizzes" 
            icon={HelpCircle} 
            title="Quizzes" 
            desc="Test your master skills" 
            color="orange"
            testId="go-to-quizzes"
          />
          <ActionLink 
            to="/games" 
            icon={Gamepad2} 
            title="Games" 
            desc="Level up through play" 
            color="purple"
            testId="go-to-games"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 animate-fadeInUp stagger-4">
          {/* Recent Games */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-heading text-slate-900">Ready to Play</h2>
              <Link to="/games" className="text-teal-600 hover:text-teal-700 font-bold text-sm flex items-center gap-1 group">
                View all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {recentGames.length === 0 ? (
              <div className="student-card p-10 text-center bg-white/50 border-dashed border-2 border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-xl">No games yet!</h3>
                <p className="text-slate-500 mb-6">Start playing games to see them here</p>
                <Link to="/games">
                  <Button className="btn-primary px-8">
                    Browse Games
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {recentGames.map((game) => (
                  <GameItem key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Subjects */}
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Explore Subjects</h2>
              {subjects.length === 0 ? (
                <div className="student-card p-8 text-center bg-slate-50/50">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">More subjects coming soon!</p>
                </div>
              ) : (
                <div className="student-card overflow-hidden divide-y divide-slate-100">
                  {subjects.slice(0, 5).map((subject) => (
                    <Link 
                      key={subject.id} 
                      to={`/lessons?subject=${subject.id}`}
                      className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-all group min-h-[56px]"
                    >
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: `${subject.color}15` }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-teal-600 transition-colors">{subject.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Hall of Fame</h2>
              <div className="space-y-3">
                <QuickLink 
                  to="/leaderboard" 
                  icon={Trophy} 
                  label="Leaderboard" 
                  color="amber"
                  testId="go-to-leaderboard"
                />
                <QuickLink 
                  to="/achievements" 
                  icon={Award} 
                  label="My Achievements" 
                  color="purple"
                  testId="go-to-achievements"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner structure
function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className={`student-card p-5 border shadow-sm ${colorMap[color] || ""}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color].split(' ')[0]} border shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-black font-accent text-slate-900 tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ to, icon: Icon, title, desc, color, testId }) {
  const colorMap = {
    teal: "from-teal-400 to-teal-600 shadow-teal-500/20",
    orange: "from-orange-400 to-orange-600 shadow-orange-500/20",
    purple: "from-purple-400 to-purple-600 shadow-purple-500/20",
  };

  return (
    <Link to={to} className="student-card p-6 flex items-center gap-5 group hover:shadow-xl transition-all" data-testid={testId}>
      <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${colorMap[color]} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 md:w-8 md:h-8" />
      </div>
      <div className="flex-1">
        <h3 className="font-extrabold font-heading text-slate-900 text-lg mb-0.5">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

function GameItem({ game }) {
  const IconComponent = GAME_TYPE_ICON[game.game_engine_id] ?? Gamepad2;
  const colorClass = GAME_TYPE_COLOR[game.game_engine_id] ?? "from-teal-400 to-teal-600";

  return (
    <Link 
      to={`/games/${game.id}`} 
      className="game-card p-5 hover:shadow-2xl hover:shadow-teal-900/10 transition-all group" 
      data-testid={`game-card-${game.id}`}
    >
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform`}>
          <IconComponent className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{game.title || `Game ${game.id}`}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
            {game.subject_name || 'General'}
          </p>
          <div className="flex items-center gap-3">
            <span className="points-badge py-1 px-3 text-xs">+{game.points || 10} XP</span>
            <span className="text-xs font-bold text-slate-400 uppercase">{game.difficulty || 'Medium'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickLink({ to, icon: Icon, label, color, testId }) {
  const colors = {
    amber: "text-amber-500 bg-amber-50",
    purple: "text-purple-500 bg-purple-50",
  };

  return (
    <Link to={to} className="flex items-center gap-4 p-4 student-card hover:bg-slate-50 transition-all group" data-testid={testId}>
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-bold text-slate-700">{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
