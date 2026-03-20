import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles, User, Lock, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(username, password);
      switch (user.role) {
        case "admin": navigate("/admin"); break;
        case "teacher": navigate("/teacher"); break;
        case "parent": navigate("/parent"); break;
        default: navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col lg:flex-row">
      {/* Left side - Visual/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200 blur-3xl"></div>
        </div>
        
        <div className="max-w-lg text-center text-white relative z-10 animate-fadeInUp">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-black font-heading mb-6 tracking-tight">Learn, Play, Achieve!</h2>
          <p className="text-teal-50 text-xl font-medium leading-relaxed opacity-90">
            Welcome to the Caribbean's premier interactive learning platform. Your educational adventure continues here.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-sm font-bold">
              500+ Lessons
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-sm font-bold">
              1000+ Games
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto animate-fadeInUp stagger-1">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 mb-12 transition-all font-bold text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <span className="text-white font-black text-2xl font-accent">Q</span>
              </div>
              <span className="text-3xl font-black font-heading text-slate-800 tracking-tight">QuestLab</span>
            </div>
            <h1 className="text-4xl font-black font-heading text-slate-900 mb-3">Welcome Back!</h1>
            <p className="text-slate-500 font-medium">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Username</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                  data-testid="login-username-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" title="Enter password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</Label>
                <Link to="/forgot-password" title="Forgot password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 pl-12 pr-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4"
              data-testid="login-submit-btn"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <Sparkles className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
                Create one for free
              </Link>
            </p>
          </div>

          {/* Improved Demo accounts info */}
          <div className="mt-12 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Demo Credentials</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <DemoPill label="Student" name="student" />
              <DemoPill label="Teacher" name="teacher" />
              <DemoPill label="Parent" name="parent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoPill({ label, name }) {
  return (
    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">{label}</p>
      <p className="text-[11px] font-bold text-slate-700 truncate">{name}</p>
    </div>
  );
}
