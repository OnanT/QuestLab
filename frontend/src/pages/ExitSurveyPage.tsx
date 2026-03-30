import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";

export default function ExitSurveyPage() {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/feedback", {
        rating,
        comment: `[EXIT_SURVEY] ${comment}`,
        lesson_id: null
      });
      toast.success("Thank you for your feedback! See you soon. 👋");
      localStorage.setItem("lastFeedbackPromptDate", new Date().toISOString().split('T')[0]);
      navigate("/login");
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Failed to submit feedback.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("lastFeedbackPromptDate", new Date().toISOString().split('T')[0]);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="max-w-xl w-full animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/10">
            <MessageSquare className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-black font-heading text-slate-900 mb-2">Wait! Before you go...</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            How was your learning experience today?
          </p>
        </div>

        <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
          <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100 relative">
            <button 
              onClick={handleSkip}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="text-xl font-black text-slate-800">Quick Survey</CardTitle>
            <CardDescription className="text-slate-500 font-medium">It only takes 30 seconds!</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rating</Label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`flex-1 h-12 rounded-xl text-xl transition-all ${
                        rating >= star ? "bg-amber-100 border-2 border-amber-400 text-amber-600 scale-105" : "bg-slate-50 border-2 border-slate-100 text-slate-300"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="flex justify-between px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Needs Work</span>
                  <span>Excellent!</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Comments (Optional)</Label>
                <Textarea
                  placeholder="What did you like or what can we improve?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium p-4 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  onClick={handleSkip}
                  variant="ghost"
                  className="h-14 rounded-2xl font-bold text-slate-400 hover:text-slate-600"
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2 uppercase tracking-widest">
                      Submit <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-teal-600 font-bold">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Every bit of feedback helps!</span>
        </div>
      </div>
    </div>
  );
}
