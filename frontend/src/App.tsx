// frontend/src/App.tsx
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { toast } from "sonner";

// Import pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProfilePage from "./pages/ProfilePage";
import LessonsPage from "./pages/LessonsPage";
import LessonViewPage from "./pages/LessonsViewPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPlayerPage from "./pages/QuizPlayerPage";
import GamesPage from "./pages/GamesPage";
import GamePlayerPage from "./pages/GamePlayerPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AchievementsPage from "./pages/AchievementsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ParentLayout from "./components/parent/ParentLayout";
import ParentOverview from "./pages/parent/ParentOverview";
import ParentChildren from "./pages/parent/ParentChildren";
import ParentCurriculum from "./pages/parent/ParentCurriculum";
import ParentReports from "./pages/parent/ParentReports";
import ParentSettings from "./pages/parent/ParentSettings";
import TeacherDashboard from "./pages/TeacherDashboard";
import FeedbackPage from "./pages/FeedbackPage";
import ExitSurveyPage from "./pages/ExitSurveyPage";
import FeedbackFAB from "./components/FeedbackFAB";

import "./App.css";

const BACKEND_URL = import.meta.env.VITE_API_URL || "/api";

// ==================== Auth Context ====================
interface AuthContextType {
  user: { 
    id: number;
    username: string; 
    role: string; 
    points: number; 
    level: number; 
    avatar: string; 
    display_name?: string; 
    country?: string;
    school?: string;
    grade?: number;
    [key: string]: unknown 
  } | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<unknown>;
  register: (userData: unknown) => Promise<unknown>;
  updateUser: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ==================== API client with auth ====================
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("questlab_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("questlab_token");
      localStorage.removeItem("questlab_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("questlab_user");
    const token = localStorage.getItem("questlab_token");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      apiClient.get("/users/me").then((res) => {
        setUser(res.data);
        localStorage.setItem("questlab_user", JSON.stringify(res.data));
      }).catch(() => {
        localStorage.removeItem("questlab_token");
        localStorage.removeItem("questlab_user");
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

// ✎ᝰ.📖Login function✎ᝰ.📖

const login = async (username: string, password: string) => {
  try {
    // OAuth2PasswordRequestForm expects form data with username and password fields
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const res = await apiClient.post("/token", formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    localStorage.setItem("questlab_token", res.data.access_token);
    const userRes = await apiClient.get("/users/me");
    localStorage.setItem("questlab_user", JSON.stringify(userRes.data));
    setUser(userRes.data);
    toast.success(`Welcome back, ${userRes.data.username}!`);
    return userRes.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Login failed");
    throw error;
  }
};

  const register = async (userData: any) => {
    try {
      const res = await apiClient.post("/register", userData);
      toast.success("Registration successful! Please log in.");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    const lastPromptDate = localStorage.getItem("lastFeedbackPromptDate");
    const today = new Date().toISOString().split('T')[0];
    
    // Clear auth data first
    localStorage.removeItem("questlab_token");
    localStorage.removeItem("questlab_user");
    const wasLoggedIn = user !== null;
    setUser(null);
    
    toast.success("Logged out successfully");

    // Only redirect to survey if they were logged in and haven't seen it today
    if (wasLoggedIn && lastPromptDate !== today) {
      navigate("/exit-survey");
    } else {
      navigate("/login");
    }
  };

  const updateUser = useCallback((data: any) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...data } as AuthContextType["user"];
      localStorage.setItem("questlab_user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route
function ProtectedRoute({ children, allowedRoles }: { 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardRoutes: Record<string, string> = {
      admin: "/admin",
      teacher: "/teacher",
      parent: "/parent",
      student: "/dashboard",
    };
    return <Navigate to={dashboardRoutes[user.role] || "/dashboard"} replace />;
  }

  return children;
}

// App Router
function AppRouter() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin";
      case "teacher": return "/teacher";
      case "parent": return "/parent";
      default: return "/dashboard";
    }
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to={getDefaultRoute()} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={getDefaultRoute()} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={getDefaultRoute()} /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/exit-survey" element={<ExitSurveyPage />} />

      {/* Student */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent", "admin"]}><ProfilePage /></ProtectedRoute>} />
      <Route path="/lessons" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><LessonsPage /></ProtectedRoute>} />
      <Route path="/lessons/:lessonId" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><LessonViewPage /></ProtectedRoute>} />
      <Route path="/quizzes" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><QuizzesPage /></ProtectedRoute>} />
      <Route path="/quizzes/:quizId" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><QuizPlayerPage /></ProtectedRoute>} />
      <Route path="/quizzes/lesson/:lessonId" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><QuizPlayerPage /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><GamesPage /></ProtectedRoute>} />
      <Route path="/games/:gameId" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><GamePlayerPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent", "admin"]}><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent"]}><AchievementsPage /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute allowedRoles={["student", "teacher", "parent", "admin"]}><FeedbackPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

      {/* Parent */}
      <Route path="/parent" element={<ProtectedRoute allowedRoles={["parent"]}><ParentLayout /></ProtectedRoute>}>
        <Route index element={<ParentOverview />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="curriculum" element={<ParentCurriculum />} />
        <Route path="reports" element={<ParentReports />} />
        <Route path="settings" element={<ParentSettings />} />
      </Route>

      {/* Teacher */}
      <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <FeedbackFAB />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;