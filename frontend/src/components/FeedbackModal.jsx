import { useState } from "react";
import { apiClient } from "../App";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { MessageSquare, Send, Sparkles } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose, lessonId = null }) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/feedback", {
        lesson_id: lessonId,
        rating: parseInt(rating),
        comment: comment
      });
      toast.success("Thank you for your feedback! 🚀");
      setComment("");
      onClose();
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white relative">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-heading flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Give Feedback
            </DialogTitle>
            <DialogDescription className="text-teal-50 font-medium opacity-90">
              Help us make QuestLab better for everyone!
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">How's your experience?</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="5" className="font-bold">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  <SelectItem value="4" className="font-bold">⭐⭐⭐⭐ Very Good</SelectItem>
                  <SelectItem value="3" className="font-bold">⭐⭐⭐ Good</SelectItem>
                  <SelectItem value="2" className="font-bold">⭐⭐ Fair</SelectItem>
                  <SelectItem value="1" className="font-bold">⭐ Needs Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Thoughts</Label>
              <Textarea
                placeholder="What do you like? What can we improve?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Send Feedback <Send className="w-4 h-4" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-400" /> Powered by Student Voices
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
