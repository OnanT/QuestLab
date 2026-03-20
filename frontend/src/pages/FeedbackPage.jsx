import { useState } from "react";
import { apiClient } from "../App";
import StudentNav from "./StudentNav";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { MessageSquare, Send, Sparkles, HelpCircle, Bug, Lightbulb } from "lucide-react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "general",
    rating: "5",
    comment: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/feedback", {
        rating: parseInt(formData.rating),
        comment: `[${formData.category.toUpperCase()}] ${formData.comment}`
      });
      toast.success("Thank you for your valuable feedback!");
      setFormData({ ...formData, comment: "" });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <StudentNav />
      
      <main className="max-w-3xl mx-auto px-4 py-8 pb-24 md:py-12">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/10">
            <MessageSquare className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-4xl font-black font-heading text-slate-900 mb-4 tracking-tight">Help Us Grow</h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Your ideas and reports help us build the best learning experience for students across the Caribbean.
          </p>
        </div>

        <div className="grid gap-8 animate-fadeInUp stagger-1">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <CardHeader className="p-8 md:p-10 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-2xl font-black text-slate-800">Send a Message</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Select a category and tell us what's on your mind.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData({...formData, category: v})}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                        <SelectItem value="general" className="font-bold py-3"><div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500" /> General Feedback</div></SelectItem>
                        <SelectItem value="bug" className="font-bold py-3"><div className="flex items-center gap-2"><Bug className="w-4 h-4 text-red-500" /> Report a Bug</div></SelectItem>
                        <SelectItem value="idea" className="font-bold py-3"><div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-orange-500" /> Suggest an Idea</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rating</Label>
                    <Select 
                      value={formData.rating} 
                      onValueChange={(v) => setFormData({...formData, rating: v})}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                        <SelectItem value="5" className="font-bold py-3">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4" className="font-bold py-3">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3" className="font-bold py-3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2" className="font-bold py-3">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1" className="font-bold py-3">⭐ Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</Label>
                  <Textarea
                    placeholder="Describe your experience or suggestion in detail..."
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="min-h-[180px] rounded-3xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium p-6 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-xl shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3 uppercase tracking-widest">
                      Submit Feedback <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="bg-teal-50/50 rounded-3xl p-8 border border-teal-100 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-teal-100 mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">Student Impact</span>
            </div>
            <p className="text-teal-800 font-bold italic">
              "We review every single piece of feedback to make QuestLab the best it can be!"
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
