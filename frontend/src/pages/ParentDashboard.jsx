// frontend/src/pages/ParentDashboard.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, BookOpen, HelpCircle, Gamepad2, Trophy, 
  LogOut, ChevronRight, Star, Medal, TrendingUp,
  Bell, Calendar, MessageSquare, Settings, Download,
  Filter, RefreshCw, ChevronDown, ChevronUp, Eye,
  Clock, Target, Award, BarChart3, Activity
} from "lucide-react";
import { useAuth, apiClient } from "../App";
import { toast } from "sonner";

// Custom Hook for fetching students
function useParentStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStudents = useCallback(async () => {
    if (!user || user.role !== "parent") {
      setError("Parent access required");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch students linked to this parent
      const response = await apiClient.get("/my-students");
      setStudents(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load student data");
      // Fallback to mock data for demo
      setStudents(getMockStudents());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error, lastUpdated, refetch: fetchStudents };
}

// Mock data fallback
function getMockStudents() {
  return [
    {
      id: 1,
      username: "emma_johnson",
      email: "emma@example.com",
      role: "student",
      avatar: "default_avatar.png",
      points: 1250,
      level: "Intermediate",
      streak: 5,
      parent_id: 1,
      display_name: "Emma Johnson",
      grade_level: 5,
      quizzes_completed: 24,
      games_played: 18,
      badges: ["math_wizard", "reading_star"],
      study_time_today: 45,
      study_goal: 60,
      subjects: {
        math: { progress: 78, trend: "up", last_activity: "2 hours ago" },
        reading: { progress: 85, trend: "up", last_activity: "1 day ago" },
        science: { progress: 62, trend: "stable", last_activity: "3 hours ago" }
      },
      insights: [
        { type: "achievement", message: "Completed 5 quizzes this week!", priority: "success" }
      ],
      weekly_progress: [45, 52, 48, 65, 70, 68, 75]
    },
    {
      id: 2,
      username: "lucas_johnson",
      email: "lucas@example.com",
      role: "student",
      avatar: "default_avatar.png",
      points: 890,
      level: "Beginner",
      streak: 3,
      parent_id: 1,
      display_name: "Lucas Johnson",
      grade_level: 3,
      quizzes_completed: 18,
      games_played: 22,
      badges: ["early_bird", "quiz_master"],
      study_time_today: 30,
      study_goal: 45,
      subjects: {
        math: { progress: 70, trend: "up", last_activity: "30 mins ago" },
        reading: { progress: 65, trend: "stable", last_activity: "2 days ago" },
        science: { progress: 55, trend: "down", last_activity: "5 hours ago" }
      },
      insights: [
        { type: "milestone", message: "Reached Level 6!", priority: "success" }
      ],
      weekly_progress: [40, 45, 42, 50, 55, 52, 60]
    }
  ];
}

// Reusable Components
function ProgressBar({ value, max = 100, color = "teal", showLabel = true }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    teal: "from-teal-400 to-teal-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600"
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1" hidden={!showLabel}>
        <span className="text-xs text-slate-600">{value}/{max}</span>
        <span className="text-xs font-medium text-slate-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color] || colorClasses.teal} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

function MiniChart({ data = [], color = "teal" }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const colorClasses = {
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };
  
  return (
    <div className="flex items-end gap-0.5 h-8" role="img" aria-label="Weekly progress chart">
      {data.map((value, idx) => {
        const height = ((value - min) / range) * 100;
        return (
          <div key={idx} className="flex-1 bg-slate-100 rounded-sm overflow-hidden">
            <div 
              className={`w-full ${colorClasses[color] || colorClasses.teal} rounded-sm transition-all`}
              style={{ height: `${height}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function TrendIndicator({ trend }) {
  const icons = {
    up: <TrendingUp className="w-3 h-3 text-green-600" />,
    down: <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />,
    stable: <div className="w-3 h-0.5 bg-slate-400" />
  };
  
  return (
    <span className="inline-flex items-center" aria-label={`Trend: ${trend}`}>
      {icons[trend] || icons.stable}
    </span>
  );
}

function InsightCard({ insight }) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    milestone: "bg-purple-50 border-purple-200 text-purple-800"
  };

  const icons = {
    achievement: <Trophy className="w-4 h-4" />,
    suggestion: <Target className="w-4 h-4" />,
    milestone: <Award className="w-4 h-4" />,
    info: <Activity className="w-4 h-4" />
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[insight.priority] || styles.info}`}>
      <div className="flex items-start gap-2">
        {icons[insight.type] || <Activity className="w-4 h-4" />}
        <p className="text-sm flex-1">{insight.message}</p>
      </div>
    </div>
  );
}

function StudentDetailCard({ student, isExpanded, onToggle }) {
  const totalSubjects = Object.keys(student.subjects || {}).length;
  const avgProgress = totalSubjects > 0 
    ? Object.values(student.subjects).reduce((sum, s) => sum + s.progress, 0) / totalSubjects 
    : 0;

  return (
    <div 
      className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all"
      role="article"
      aria-label={`${student.display_name || student.username}'s progress dashboard`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-t-2xl"
        aria-expanded={isExpanded}
        aria-controls={`student-detail-${student.id}`}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">{(student.display_name || student.username)[0]}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-slate-900 truncate">{student.display_name || student.username}</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
              Grade {student.grade_level || 5}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {student.study_time_today || 0}m today
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Level {student.level || 1}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-900">{student.points || 0}</span>
            </div>
            <span className="text-xs text-slate-500">{Math.round(avgProgress)}% avg</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          id={`student-detail-${student.id}`}
          className="px-6 pb-6 space-y-6 border-t border-slate-100"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 pt-4">
            <div className="text-center p-3 bg-teal-50 rounded-xl">
              <div className="text-2xl font-bold text-teal-700">{student.quizzes_completed || 0}</div>
              <div className="text-xs text-teal-600 mt-1">Quizzes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-700">{student.games_played || 0}</div>
              <div className="text-xs text-purple-600 mt-1">Games</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-700">{student.badges?.length || 0}</div>
              <div className="text-xs text-amber-600 mt-1">Badges</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">{student.level || 1}</div>
              <div className="text-xs text-blue-600 mt-1">Level</div>
            </div>
          </div>

          {/* Insights */}
          {student.insights && student.insights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Insights & Recommendations
              </h4>
              <div className="space-y-2">
                {student.insights.map((insight, idx) => (
                  <InsightCard key={idx} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* Study Time Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Today's Study Time
              </h4>
              <span className="text-xs text-slate-500">
                Goal: {student.study_goal || 60} minutes
              </span>
            </div>
            <ProgressBar 
              value={student.study_time_today || 0} 
              max={student.study_goal || 60}
              color="blue"
            />
          </div>

          {/* Subject Progress */}
          {student.subjects && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Subject Progress
              </h4>
              <div className="space-y-3">
                {Object.entries(student.subjects).map(([subject, data]) => (
                  <div key={subject} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {subject}
                        </span>
                        <TrendIndicator trend={data.trend} />
                      </div>
                      <span className="text-xs text-slate-500">{data.last_activity}</span>
                    </div>
                    <ProgressBar value={data.progress} color="teal" showLabel={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Progress Chart */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Activity
            </h4>
            <MiniChart data={student.weekly_progress || [45, 52, 48, 65, 70, 68, 75]} color="teal" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Mon</span>
              <span className="text-xs text-slate-400">Sun</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500">
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { students, loading, error, lastUpdated, refetch } = useParentStudents();
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [filterSubject, setFilterSubject] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [notifications] = useState(3);

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
    if (filterSubject === "all") return students;
    return students.filter(s => s.subjects && s.subjects[filterSubject]);
  }, [students, filterSubject]);

  const overallStats = useMemo(() => {
    if (!students.length) return { totalPoints: 0, totalQuizzes: 0, totalGames: 0, avgLevel: 0, totalStudents: 0 };
    
    return {
      totalPoints: students.reduce((sum, s) => sum + (s.points || 0), 0),
      totalStudents: students.length,
      avgLevel: Math.round(students.reduce((sum, s) => {
        const level = typeof s.level === 'string' ? parseInt(s.level.replace(/[^0-9]/g, '')) || 1 : s.level || 1;
        return sum + level;
      }, 0) / students.length),
      totalQuizzes: students.reduce((sum, s) => sum + (s.quizzes_completed || 0), 0),
      totalGames: students.reduce((sum, s) => sum + (s.games_played || 0), 0),
    };
  }, [students]);

  const fetchParentStats = useCallback(async () => {
    if (!user) return null;
    
    try {
      const response = await apiClient.get("/parent/dashboard");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch parent stats:", error);
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "parent") {
      fetchParentStats();
    }
  }, [user, fetchParentStats]);

  const displayName = user?.username || "Parent";

  if (error && !students.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-800">QuestLab</span>
                <p className="text-xs text-slate-500">Parent Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={`${notifications} unread notifications`}
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              <button 
                onClick={refetch}
                disabled={loading}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <div className="text-right mr-2">
                <p className="font-medium text-slate-900 text-sm">{displayName}</p>
                <p className="text-xs text-slate-500">Parent</p>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {displayName.split(" ")[0]}! 👋
              </h1>
              <p className="text-slate-600">Here's what your children are learning today</p>
            </div>
            {lastUpdated && (
              <span className="text-sm text-slate-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Total Points</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{overallStats.totalPoints}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Quizzes Done</span>
                <HelpCircle className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{overallStats.totalQuizzes}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Games Played</span>
                <Gamepad2 className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{overallStats.totalGames}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Avg Level</span>
                <Medal className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{overallStats.avgLevel}</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFilters && (
            <div className="flex gap-2">
              {["all", "math", "reading", "science"].map(subject => (
                <button
                  key={subject}
                  onClick={() => setFilterSubject(subject)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterSubject === subject
                      ? "bg-teal-100 text-teal-700 border-2 border-teal-300"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Students */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            My Students
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No students found</h3>
              <p className="text-slate-500">Try adjusting your filters or contact support</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map(student => (
                <StudentDetailCard
                  key={student.id}
                  student={student}
                  isExpanded={expandedStudents.has(student.id)}
                  onToggle={() => toggleStudent(student.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link 
              to="/lessons" 
              className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Browse Lessons</h3>
              <p className="text-sm text-slate-500">Explore curriculum</p>
            </Link>

            <Link 
              to="/quizzes" 
              className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">View Quizzes</h3>
              <p className="text-sm text-slate-500">Track assessments</p>
            </Link>

            <Link 
              to="/leaderboard" 
              className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Leaderboard</h3>
              <p className="text-sm text-slate-500">See rankings</p>
            </Link>

            <button className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all group text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Export Report</h3>
              <p className="text-sm text-slate-500">Download progress</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}