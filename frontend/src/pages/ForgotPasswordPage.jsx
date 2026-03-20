import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send, ShieldCheck, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/forgot-password", { email });
      toast.success("OTP sent! Please check your email.");
      // Navigate to reset password page and pass email in state
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-teal-500 rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-orange-400 rounded-full opacity-5 blur-2xl"></div>

        <div className="relative z-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 mb-8 transition-all font-bold text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <div className="mb-10 text-center md:text-left">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 border border-teal-100 shadow-sm shadow-teal-500/10">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl font-black font-heading text-slate-900 mb-3 tracking-tight">Forgot Password?</h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              No worries! Enter your registered email and we'll send you a 6-digit code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 pl-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 uppercase tracking-widest">
                  Send OTP <Send className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm italic">
              "Every challenge is an opportunity to learn!" <Sparkles className="inline w-3 h-3 text-orange-400 ml-1" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
