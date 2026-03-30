import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Users, BookOpen, HelpCircle, Gamepad2, Trophy, 
  LogOut, ChevronRight, Star, Medal, TrendingUp,
  Bell, RefreshCw, ChevronDown, ChevronUp, Eye,
  Clock, Target, Award, BarChart3, Activity,
  Search, Settings, Download, Copy, Check, AlertCircle
} from "lucide-react";
import { useAuth } from "../App";
import { useParentData } from "../hooks/useParentData";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { students, loading, error, lastUpdated, refetch } = useParentData();
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const copyParentId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      toast.success("Parent ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleStudent = useCallback((studentId) => {
    setExpandedStudents(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return (students || []).filter(s => 
      (s.display_name || s.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const overallStats = useMemo(() => {
    if (!students || !students.length) return { totalPoints: 0, totalQuizzes: 0, totalGames: 0, totalBadges: 0, totalStudents: 0 };
    
    return {
      totalPoints: students.reduce((sum, s) => sum + (s.total_points || 0), 0),
      totalStudents: students.length,
      totalQuizzes: students.reduce((sum, s) => sum + (s.quizzes_completed || 0), 0),
      totalGames: students.reduce((sum, s) => sum + (s.games_played || 0), 0),
      totalBadges: students.reduce((sum, s) => sum + (Array.isArray(s.badges) ? s.badges.length : 0), 0),
    };
  }, [students]);

  // Loading state
  if (loading && !students.length) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <ParentNav user={user} onLogout={handleLogout} onRefresh={refetch} isLoading={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-xl w-64"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>)}
            </div>
            <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <ParentNav user={user} onLogout={handleLogout} onRefresh={refetch} isLoading={loading} />

      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-extrabold font-heading text-slate-900 mb-1">
              Parent Dashboard
            </h1>
            <p className="text-slate-500">Track and support your children's learning journey</p>
          </div>
          
          <div className="bg-teal-50 border-2 border-teal-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm shadow-teal-500/5">
            <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">Your Parent ID</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-accent text-slate-900">{user?.id}</span>
                <button 
                  onClick={copyParentId}
                  className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors text-teal-600"
                  title="Copy ID to share with your child"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 animate-fadeInUp stagger-1">
          <StatCard icon={Users} label="Children" value={overallStats.totalStudents} color="teal" />
          <StatCard icon={Star} label="Total Points" value={overallStats.totalPoints} color="amber" />
          <StatCard icon={HelpCircle} label="Quizzes Done" value={overallStats.totalQuizzes} color="orange" />
          <StatCard icon={Award} label="Badges Earned" value={overallStats.totalBadges} color="purple" />
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fadeInUp stagger-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:border-teal-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
          <Button variant="outline" className="rounded-2xl h-full py-3 px-6 border-2 font-bold text-slate-700 bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>

        {/* Students List */}
        <div className="space-y-6 mb-12 animate-fadeInUp stagger-3">
          <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-teal-600" />
            Active Students
          </h2>

          {error && !students.length ? (
            <div className="student-card p-12 text-center bg-white">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h3>
              <p className="text-slate-500 mb-8">{error}</p>
              <Button onClick={refetch} className="btn-primary px-8">Try Again</Button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="student-card p-12 text-center bg-white border-dashed border-2 border-slate-200 shadow-none">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No students found</h3>
              <p className="text-slate-500">Try a different search term or add a new student</p>
            </div>
          ) : (
            filteredStudents.map(student => (
              <StudentDetailCard 
                key={student.id} 
                student={student} 
                isExpanded={expandedStudents.has(student.id)}
                onToggle={() => toggleStudent(student.id)}
              />
            ))
          )}
        </div>

        {/* Quick Links for Parents */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInUp stagger-4">
          <QuickLink 
            to="/lessons" 
            icon={BookOpen} 
            title="Browse Curriculum" 
            desc="See what's available for your children" 
            color="teal" 
          />
          <QuickLink 
            to="/games" 
            icon={Gamepad2} 
            title="Learning Games" 
            desc="Explore interactive games" 
            color="indigo" 
          />
          <QuickLink 
            to="/quizzes" 
            icon={HelpCircle} 
            title="Assessments" 
            desc="View available quizzes" 
            color="orange" 
          />
          <QuickLink 
            to="/leaderboard" 
            icon={Trophy} 
            title="Leaderboard" 
            desc="See how your kids rank globally" 
            color="amber" 
          />
        </div>
      </main>
    </div>
  );
}

// Internal Components
function ParentNav({ user, onLogout, onRefresh, isLoading }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl font-accent">Q</span>
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">QuestLab</span>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-0.5">Parent Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh} 
              disabled={isLoading}
              className="rounded-full hover:bg-teal-50 text-slate-500 hover:text-teal-600"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onLogout}
              className="rounded-full hover:bg-red-50 text-slate-500 hover:text-red-600 ml-2"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm ml-2">
              <span className="text-slate-600 font-bold text-sm">{(user?.username || 'P')[0].toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`student-card p-5 border shadow-sm ${colors[color]}`}>
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color].split(' ')[0]} border shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-black font-accent text-slate-900 tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StudentDetailCard({ student, isExpanded, onToggle }) {
  return (
    <div className="student-card bg-white border-2 border-slate-200 overflow-hidden group transition-all">
      <button 
        onClick={onToggle}
        className="w-full p-5 md:p-6 flex items-center gap-4 text-left hover:bg-slate-50/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
          <span className="text-2xl font-black font-accent">{(student.display_name || student.username)[0].toUpperCase()}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-xl text-slate-900 truncate mb-1">{student.display_name || student.username}</h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-teal-500" />
              Level {student.level || 1}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              {student.total_points || 0} XP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <p className="text-xs font-black text-teal-600 uppercase tracking-widest">{student.quizzes_completed || 0} Quizzes</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{student.streak || 0} Day Streak</p>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="h-px bg-slate-100 w-full mb-8" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1: Performance */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                Performance
              </h4>
              
              <div className="space-y-4">
                <ProgressItem label="Quiz Accuracy" value={student.average_score || 0} color="teal" />
                <ProgressItem label="Curriculum Completion" value={Math.min(100, (student.completed_lessons || 0) * 5)} color="blue" />
              </div>
            </div>

            {/* Column 2: Activity */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Recent Activity
              </h4>
              
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Lessons Done</span>
                  <span className="font-bold text-slate-900">{student.completed_lessons || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Games Played</span>
                  <span className="font-bold text-slate-900">{student.games_played || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Best Subject</span>
                  <span className="font-bold text-teal-600">English</span>
                </div>
              </div>
            </div>

            {/* Column 3: Rewards */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Achievements
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {(student.badges || []).length > 0 ? (
                  student.badges.slice(0, 6).map((badge, i) => (
                    <div key={i} className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm" title={badge}>
                      <Medal className="w-5 h-5" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No badges earned yet</p>
                )}
                {student.badges?.length > 6 && (
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 font-bold text-xs">
                    +{student.badges.length - 6}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
            <Button className="btn-primary rounded-xl px-6">
              <Eye className="w-4 h-4 mr-2" />
              Detailed Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressItem({ label, value, color }) {
  const barColors = {
    teal: "bg-teal-500",
    blue: "bg-blue-500",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-black text-slate-900">{Math.round(value)}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${barColors[color] || 'bg-teal-500'} rounded-full transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc, color }) {
  const iconColors = {
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Link to={to} className="student-card p-6 flex flex-col gap-4 bg-white hover:border-teal-200 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-extrabold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}
