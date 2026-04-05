import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UserPlus, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../ui/select";

export default function AddChildModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    grade: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGradeChange = (value) => {
    setFormData(prev => ({ ...prev, grade: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.grade) {
      toast.error("Please select a grade level");
      return;
    }
    setLoading(true);
    try {
      await onAdd({
        ...formData,
        grade: parseInt(formData.grade)
      });
      setFormData({ username: "", email: "", password: "", grade: "" });
      onClose();
    } catch (err) {
      // toast is already handled in useParentData
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-none shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-blue-500"></div>
        <DialogHeader className="mb-6">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 shadow-sm border border-teal-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900">Add a Child</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            Create a new student account linked to your profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold text-slate-700 ml-1">Username</Label>
              <Input 
                id="username"
                name="username"
                placeholder="e.g. little_explorer" 
                value={formData.username}
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 font-medium transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 ml-1">Grade Level</Label>
              <Select value={formData.grade} onValueChange={handleGradeChange}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 font-medium transition-all">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                    <SelectItem key={g} value={g.toString()} className="rounded-xl font-bold py-2.5">
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address (Optional)</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="child@example.com" 
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 font-medium transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 font-medium transition-all"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 sm:flex-row-reverse">
            <Button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex-1 h-12 rounded-xl font-black shadow-lg shadow-teal-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
