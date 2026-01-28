import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Now sending username instead of email
      const user = await login(username, password); // Changed parameter
      // Navigate based on role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "parent":
          navigate("/parent");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Show user-friendly error
      if (error.response?.status === 401) {
        alert("Invalid username or password. Please try again.");
      } else if (error.response?.status === 422) {
        alert("Invalid form data. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-accent">Q</span>
              </div>
              <span className="text-2xl font-bold font-heading text-slate-800">QuestLab</span>
            </div>
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Welcome Back!</h1>
            <p className="text-slate-600">Continue your learning adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label> {/* Changed */}
              <Input
                id="username" // Changed
                type="text" // Changed from email to text
                placeholder="Enter your username"
                value={username} // Changed
                onChange={(e) => setUsername(e.target.value)} // Changed
                required
                className="h-12 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-teal-200"
                data-testid="login-username-input" // Changed
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-teal-200 pr-12"
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-accent text-lg shadow-lg shadow-teal-500/30"
              data-testid="login-submit-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo accounts info - Updated to use usernames */}
          <div className="mt-8 p-4 bg-slate-100 rounded-xl">
            <p className="text-sm text-slate-600 font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p><span className="font-medium">Teacher:</span> teacher / teacher123</p>
              <p><span className="font-medium">Parent:</span> parent / parent123</p>
              <p><span className="font-medium">Student:</span> student / student123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-500 to-teal-600 items-center justify-center p-12">
        <div className="max-w-lg text-center text-white">
          <img
            src="https://onan.shop/assets/images/gallery/questlab-landing.png"
            alt="Learning"
            className="rounded-3xl shadow-2xl mb-8 mx-auto"
          />
          <h2 className="text-3xl font-bold font-heading mb-4">Learn, Play, Grow!</h2>
          <p className="text-teal-100 text-lg">
            Join thousands of Caribbean students on an exciting educational journey filled with games, quizzes, and achievements.
          </p>
        </div>
      </div>
    </div>
  );
}