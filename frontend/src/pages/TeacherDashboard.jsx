import { useState } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useTeacherData } from "../hooks/useTeacherData";
import { Button } from "../components/ui/button";
import { 
  Users, BookOpen, HelpCircle, Gamepad2, Trophy, LayoutDashboard,
  LogOut, ChevronRight, Star, Medal, Plus, RefreshCw, 
  AlertCircle, Search, Filter, Activity, Settings, UserCircle
} from "lucide-react";
import CreateLessonPage from "./CreateLessonPage";

// Sidebar Component
function TeacherSidebar({ user, onLogout }) {
  const location = useLocation();
  const links = [
    { path: "/teacher", icon: LayoutDashboard, label: "Overview", exact: true },
    { path: "/teacher/students", icon: Users, label: "My Class" },
    { path: "/lessons", icon: BookOpen, label: "Curriculum" },
    { path: "/quizzes", icon: HelpCircle, label: "Assessments" },
    { path: "/games", icon: Gamepad2, label: "Learning Games" },
    { path: "/profile", icon: UserCircle, label: "My Profile" },
  ];

  return (
    <div className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl font-accent">Q</span>
          </div>
          <div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">QuestLab</span>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-0.5">Teacher Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {links.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact 
            ? location.pathname === path 
            : location.pathname.startsWith(path);
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-teal-50 text-teal-600 shadow-sm border border-teal-100/50" 
                  : "text-slate-500 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden hover:scale-105 transition-transform">
            <img 
              src={user?.avatar || "/default_avatar.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/default_avatar.png"; }}
            />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">{user?.display_name || user?.username}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

// Overview Component
function TeacherOverview({ students, stats, loading, error, refetch }) {
  if (loading && !students.length) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-64"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back to your virtual classroom</p>
        </div>
        <Button onClick={refetch} disabled={loading} variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-400">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <StatItem icon={Users} label="Total Students" value={students.length} color="blue" />
        <StatItem icon={BookOpen} label="Active Lessons" value={stats.lessons} color="teal" />
        <StatItem icon={HelpCircle} label="Quizzes" value={stats.quizzes} color="orange" />
        <StatItem icon={Gamepad2} label="Games" value={stats.games} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Student Performance
            </h2>
            <Link to="/teacher/students" className="text-sm font-bold text-teal-600 hover:underline">
              View All Class
            </Link>
          </div>

          <div className="student-card overflow-hidden bg-white border-2 border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs shadow-sm">
                            {(student.display_name || student.username)[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-teal-600 transition-colors">{student.display_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg font-bold text-[10px] uppercase border border-teal-100">
                          Lvl {student.level || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${student.average_score || 0}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-slate-500">{Math.round(student.average_score || 0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-accent font-black text-slate-900">{student.total_points || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading text-slate-800">Quick Tools</h2>
          <div className="space-y-3">
            <ToolButton icon={Plus} label="Create New Lesson" color="teal" to="/teacher/create-lesson" />
            <ToolButton icon={Search} label="Find Resources" color="blue" to="/lessons" />
            <ToolButton icon={Activity} label="Class Insights" color="purple" to="/teacher/students" />
            <ToolButton icon={Settings} label="Class Settings" color="slate" to="/settings" />
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-100/50">
            <div className="flex items-center gap-3 mb-3 text-amber-700">
              <Trophy className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Teacher Tip</h3>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Encourage healthy competition! Students with more than 500 XP this week are 40% more likely to master their current concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Student Management View
function TeacherStudents({ students, loading, refetch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = students.filter(s => 
    (s.display_name || s.username).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-heading text-slate-900 mb-2">My Class</h1>
        <p className="text-slate-500 font-medium">Monitor and manage student progress</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Find a student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:border-teal-500 focus:outline-none transition-all shadow-sm"
          />
        </div>
        <Button variant="outline" className="rounded-2xl py-3 px-6 border-2 font-bold text-slate-700 bg-white">
          <Filter className="w-4 h-4 mr-2" />
          Filter Grade
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="student-card p-12 text-center bg-white border-dashed border-2 border-slate-200 shadow-none">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No students found</h3>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((student) => (
            <div key={student.id} className="student-card p-6 border-2 border-slate-100 group hover:border-teal-200 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-xl font-black font-accent">{(student.display_name || student.username)[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">{student.display_name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade {student.grade_level || "3"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total XP</p>
                  <p className="text-lg font-black font-accent text-slate-800">{student.total_points || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Level</p>
                  <p className="text-lg font-black font-accent text-teal-600">{student.level || 1}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                <span>Quiz Accuracy</span>
                <span className="text-slate-900">{Math.round(student.average_score || 0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-6">
                <div className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full" style={{ width: `${student.average_score || 0}%` }}></div>
              </div>

              <Button className="btn-primary w-full rounded-xl py-2 text-xs">
                View Reports
                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-components
function StatItem({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`student-card p-5 border shadow-sm ${colors[color]}`}>
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color].split(' ')[0]} border shadow-sm`}>
          <Icon className="w-5 h-5 stroke-[2.5px]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-70 mb-1">{label}</p>
          <p className="text-2xl font-black font-accent text-slate-900 tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, color, to }) {
  const colors = {
    teal: "text-teal-600 bg-teal-50 border-teal-100 hover:bg-teal-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100 hover:bg-slate-100",
  };

  return (
    <Link to={to} className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all group ${colors[color]}`}>
      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-4 h-4" />
      </div>
      {label}
      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

// Main Teacher Dashboard
export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const teacherData = useTeacherData();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]" data-testid="teacher-dashboard">
      <TeacherSidebar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <Routes>
          <Route index element={<TeacherOverview {...teacherData} />} />
          <Route path="students" element={<TeacherStudents {...teacherData} />} />
          <Route path="create-lesson" element={<CreateLessonPage />} />
          <Route path="edit-lesson/:lessonId" element={<CreateLessonPage />} />
        </Routes>
      </main>
    </div>
  );
}
