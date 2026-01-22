import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, apiClient } from "../App";
import { Button } from "../components/ui/button";
import { 
  BookOpen, Gamepad2, Trophy, Star, Flame, Target, LogOut, 
  ChevronRight, Award, Home, HelpCircle, Medal, User, RefreshCw,
  AlertCircle, Sparkles
} from "lucide-react";

export default function StudentDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Call existing endpoints
const [userRes, subjectsRes, gamesRes] = await Promise.all([
  apiClient.get("/users/me"),
  apiClient.get("/subjects/enhanced"),  // Use enhanced endpoint
  apiClient.get("/games/list?limit=4")  // Use new endpoint
]);
    
    console.log("User:", userRes.data);
    console.log("Subjects:", subjectsRes.data);
    console.log("Games:", gamesRes.data);
    
    // Set progress from user data
    setProgress({
      points: userRes.data.points || 0,
      level: userRes.data.level || 1,
      streak: userRes.data.streak || 0,
      quizzes_completed: 0,
      games_played: 0,
      badges: userRes.data.badges || []
    });
    
    setSubjects(subjectsRes.data);
    setRecentGames(gamesRes.data.slice(0, 4));
    
    // Update user context if needed
    if (updateUser && typeof updateUser === 'function') {
      updateUser(userRes.data);
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    
    // If subjects endpoint doesn't exist yet, use dummy data
    if (error.response?.status === 404 && error.config.url.includes('/subjects')) {
      setSubjects([
        { id: 1, name: "Math", color: "#3B82F6" },
        { id: 2, name: "Science", color: "#10B981" }
      ]);
    } else {
      setError("Unable to load dashboard. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getGameTypeIcon = (gameEngineId) => {
    switch (gameEngineId) {
      case 1: return <Target className="w-5 h-5" />;
      case 2: return <Flame className="w-5 h-5" />;
      case 3: return <BookOpen className="w-5 h-5" />;
      case 4: return <Gamepad2 className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const getGameTypeColor = (gameEngineId) => {
    switch (gameEngineId) {
      case 1: return "from-blue-400 to-blue-600";
      case 2: return "from-red-400 to-red-600";
      case 3: return "from-purple-400 to-purple-600";
      case 4: return "from-green-400 to-green-600";
      default: return "from-teal-400 to-teal-600";
    }
  };

  // Calculate level progress
  const getLevelProgress = () => {
    if (!progress) return 0;
    const pointsForCurrentLevel = (progress.level - 1) * 100;
    const pointsForNextLevel = progress.level * 100;
    const currentLevelPoints = progress.points - pointsForCurrentLevel;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return Math.min((currentLevelPoints / pointsNeeded) * 100, 100);
  };

  const getPointsToNextLevel = () => {
    if (!progress) return 0;
    const pointsForNextLevel = progress.level * 100;
    return pointsForNextLevel - progress.points;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5]">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-accent">Q</span>
                </div>
                <span className="text-xl font-bold font-heading text-slate-800">QuestLab</span>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
            </div>
            {/* Stats skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="student-card p-5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={fetchDashboardData} className="bg-teal-600 hover:bg-teal-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="student-dashboard">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-accent">Q</span>
              </div>
              <span className="text-xl font-bold font-heading text-slate-800">QuestLab</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Quick stats */}
              <div className="hidden sm:flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 bg-amber-100 px-2 md:px-3 py-1.5 rounded-full" role="status" aria-label={`${progress?.points || 0} points`}>
                  <Star className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span className="font-accent font-semibold text-amber-700 text-sm md:text-base">{progress?.points || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-teal-100 px-2 md:px-3 py-1.5 rounded-full" role="status" aria-label={`Level ${progress?.level || 1}`}>
                  <Medal className="w-4 h-4 text-teal-600" aria-hidden="true" />
                  <span className="font-accent font-semibold text-teal-700 text-sm md:text-base">Lvl {progress?.level || 1}</span>
                </div>
                {progress?.streak > 0 && (
                  <div className="hidden md:flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full" role="status" aria-label={`${progress.streak} day streak`}>
                    <Flame className="w-4 h-4 text-orange-600" aria-hidden="true" />
                    <span className="font-accent font-semibold text-orange-700">{progress.streak} days</span>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center" aria-label={`${user?.display_name} profile`}>
                  <span className="text-white font-bold text-sm md:text-base">{user?.display_name?.[0]?.toUpperCase()}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="logout-btn" aria-label="Log out" className="h-9 w-9 md:h-10 md:w-10">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 mb-2">
            Welcome back, {user?.display_name?.split(" ")[0]}! 
          </h1>
          <p className="text-slate-600 text-sm md:text-base">Ready to continue your learning adventure?</p>
        </div>

        {/* Level Progress Card */}
        <div className="student-card p-5 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Level {progress?.level || 1}</p>
                <p className="text-xs text-slate-500">{getPointsToNextLevel()} pts to Level {(progress?.level || 1) + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-accent text-teal-700">{Math.round(getLevelProgress())}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={getLevelProgress()} aria-valuemin="0" aria-valuemax="100" aria-label="Progress to next level">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Cards - Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="student-card p-4 md:p-5 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Points</p>
                <p className="text-xl md:text-2xl font-bold font-accent text-slate-900">{progress?.points || 0}</p>
              </div>
            </div>
          </div>

          <div className="student-card p-4 md:p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Quizzes</p>
                <p className="text-xl md:text-2xl font-bold font-accent text-slate-900">{progress?.quizzes_completed || 0}</p>
              </div>
            </div>
          </div>

          <div className="student-card p-4 md:p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Games</p>
                <p className="text-xl md:text-2xl font-bold font-accent text-slate-900">{progress?.games_played || 0}</p>
              </div>
            </div>
          </div>

          <div className="student-card p-4 md:p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Badges</p>
                <p className="text-xl md:text-2xl font-bold font-accent text-slate-900">{progress?.badges?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Link to="/lessons" className="student-card p-5 md:p-6 flex items-center gap-4 group hover:shadow-lg transition-all" data-testid="go-to-lessons">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading text-slate-900 mb-1 text-sm md:text-base">Lessons</h3>
              <p className="text-xs md:text-sm text-slate-500">Learn new topics</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/quizzes" className="student-card p-5 md:p-6 flex items-center gap-4 group hover:shadow-lg transition-all" data-testid="go-to-quizzes">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading text-slate-900 mb-1 text-sm md:text-base">Quizzes</h3>
              <p className="text-xs md:text-sm text-slate-500">Test your knowledge</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/games" className="student-card p-5 md:p-6 flex items-center gap-4 group hover:shadow-lg transition-all sm:col-span-2 md:col-span-1" data-testid="go-to-games">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading text-slate-900 mb-1 text-sm md:text-base">Games</h3>
              <p className="text-xs md:text-sm text-slate-500">Learn through play</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Games Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold font-heading text-slate-900">Ready to Play</h2>
              <Link to="/games" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentGames.length === 0 ? (
              <div className="student-card p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">No games yet!</h3>
                <p className="text-slate-500 text-sm mb-4">Start playing games to see them here</p>
                <Link to="/games">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Browse Games
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {recentGames.map((game) => (
                  <Link key={game.id} to={`/games/${game.id}`} className="game-card p-5 hover:shadow-lg transition-all group" data-testid={`game-card-${game.id}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getGameTypeColor(game.game_engine_id)} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <span className="text-white">{getGameTypeIcon(game.game_engine_id)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 mb-1 truncate">{game.title || `Game ${game.id}`}</h3>
                        {/* FIX THIS LINE - don't use game_type if it doesn't exist */}
                        <p className="text-xs text-slate-500 capitalize mb-2">
                          {game.game_engine_id ? `Game Engine ${game.game_engine_id}` : 'Game'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="points-badge text-xs">+{game.points || 10} pts</span>
                          <span className="text-xs text-slate-400 capitalize">{game.difficulty || 'Medium'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <h2 className="text-lg md:text-xl font-bold font-heading text-slate-900 mb-4">Subjects</h2>
              {subjects.length === 0 ? (
                <div className="student-card p-8 text-center">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No subjects available yet</p>
                </div>
              ) : (
                <div className="student-card divide-y divide-slate-100">
                  {subjects.slice(0, 5).map((subject) => (
                    <Link 
                      key={subject.id} 
                      to={`/lessons?subject=${subject.id}`}
                      className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${subject.color}20` }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
                      </div>
                      <span className="font-medium text-slate-700 text-sm md:text-base">{subject.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg md:text-xl font-bold font-heading text-slate-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link to="/leaderboard" className="flex items-center gap-3 p-4 student-card hover:bg-slate-50 transition-colors group" data-testid="go-to-leaderboard">
                  <Trophy className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700 text-sm md:text-base">Leaderboard</span>
                </Link>
                <Link to="/achievements" className="flex items-center gap-3 p-4 student-card hover:bg-slate-50 transition-colors group" data-testid="go-to-achievements">
                  <Award className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700 text-sm md:text-base">My Achievements</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}