import { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth, apiClient } from "../App";
import { Button } from "../components/ui/button";
import { 
  Users, BookOpen, HelpCircle, Gamepad2, Trophy, LayoutDashboard,
  LogOut, ChevronRight, Star, Medal, Plus
} from "lucide-react";

// Teacher Sidebar
function TeacherSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { path: "/teacher", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", exact: true },
    { path: "/teacher/students", icon: <Users className="w-5 h-5" />, label: "My Students" },
    { path: "/lessons", icon: <BookOpen className="w-5 h-5" />, label: "Lessons" },
    { path: "/quizzes", icon: <HelpCircle className="w-5 h-5" />, label: "Quizzes" },
    { path: "/games", icon: <Gamepad2 className="w-5 h-5" />, label: "Games" },
    { path: "/leaderboard", icon: <Trophy className="w-5 h-5" />, label: "Leaderboard" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl font-accent">Q</span>
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-slate-800">QuestLab</span>
            <p className="text-xs text-slate-500">Teacher Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = link.exact 
            ? location.pathname === link.path 
            : location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{user?.display_name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{user?.display_name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout} data-testid="teacher-logout-btn">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

// Teacher Overview
function TeacherOverview() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ lessons: 0, quizzes: 0, games: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, lessonsRes, quizzesRes, gamesRes] = await Promise.all([
        apiClient.get("/my-students"),
        apiClient.get("/lessons"),
        apiClient.get("/quizzes"),
        apiClient.get("/games")
      ]);
      setStudents(studentsRes.data);
      setStats({
        lessons: lessonsRes.data.length,
        quizzes: quizzesRes.data.length,
        games: gamesRes.data.length
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-slate-900 mb-6">Teacher Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="student-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              <p className="text-sm text-slate-500">My Students</p>
            </div>
          </div>
        </div>
        <div className="student-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.lessons}</p>
              <p className="text-sm text-slate-500">Lessons</p>
            </div>
          </div>
        </div>
        <div className="student-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.quizzes}</p>
              <p className="text-sm text-slate-500">Quizzes</p>
            </div>
          </div>
        </div>
        <div className="student-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.games}</p>
              <p className="text-sm text-slate-500">Games</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Students */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading text-slate-900">My Students</h2>
          <Link to="/teacher/students" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="student-card p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No students assigned yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.slice(0, 6).map((student) => (
              <div key={student.id} className="student-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{student.display_name?.[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{student.display_name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      {student.points || 0}
                    </span>
                    <span>Level {student.level || 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/lessons" className="student-card p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Browse Lessons</h3>
              <p className="text-sm text-slate-500">View and assign lessons</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link to="/quizzes" className="student-card p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Browse Quizzes</h3>
              <p className="text-sm text-slate-500">View and manage quizzes</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Teacher Students View
function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get("/my-students");
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-slate-900 mb-6">My Students</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="student-card p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No students assigned</h3>
          <p className="text-slate-500">Contact admin to assign students to your class</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="student-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{student.display_name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{student.display_name}</h3>
                  <p className="text-sm text-slate-500">Grade {student.grade_level || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-600">Points</span>
                  </div>
                  <p className="text-xl font-bold font-accent text-amber-700">{student.points || 0}</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Medal className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-teal-600">Level</span>
                  </div>
                  <p className="text-xl font-bold font-accent text-teal-700">{student.level || 1}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{student.quizzes_completed || 0} quizzes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>{student.games_played || 0} games</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Teacher Dashboard
export default function TeacherDashboard() {
  return (
    <div className="flex min-h-screen bg-[#FFFDF5]" data-testid="teacher-dashboard">
      <TeacherSidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<TeacherOverview />} />
          <Route path="students" element={<TeacherStudents />} />
        </Routes>
      </main>
    </div>
  );
}
