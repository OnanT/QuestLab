import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    content: "",
    grade_levels: [],
    difficulty: "beginner",
    points: 15,
    estimated_time: 20
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, subjectsRes] = await Promise.all([
        apiClient.get("/lessons"),
        apiClient.get("/subjects")
      ]);
      setLessons(lessonsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        grade_levels: formData.grade_levels.map(Number)
      };
      
      if (editingLesson) {
        await apiClient.put(`/lessons/${editingLesson.id}`, data);
        toast.success("Lesson updated successfully");
      } else {
        await apiClient.post("/lessons", data);
        toast.success("Lesson created successfully");
      }
      setIsDialogOpen(false);
      setEditingLesson(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Failed to save lesson");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await apiClient.delete(`/lessons/${id}`);
      toast.success("Lesson deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      subject_id: lesson.subject_id,
      content: lesson.content,
      grade_levels: lesson.grade_levels || [],
      difficulty: lesson.difficulty,
      points: lesson.points,
      estimated_time: lesson.estimated_time
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject_id: "",
      content: "",
      grade_levels: [],
      difficulty: "beginner",
      points: 15,
      estimated_time: 20
    });
  };

  return (
    <div data-testid="admin-lessons" className="animate-fadeInUp">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Lessons</h1>
          <p className="text-slate-500 font-medium">Manage and organize educational content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={() => { resetForm(); setEditingLesson(null); }} data-testid="add-lesson-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading">{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject Category</Label>
                <Select value={String(formData.subject_id)} onValueChange={(v) => setFormData({...formData, subject_id: parseInt(v)})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {subjects.map((s) => <SelectItem key={s.id} value={String(s.id)} className="font-bold text-slate-700">{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Content (HTML)</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} required className="rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all p-4" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => setFormData({...formData, difficulty: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="beginner" className="font-bold">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="font-bold">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="font-bold">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">XP Points</Label>
                  <Input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all" />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                {editingLesson ? "Update Lesson" : "Publish Lesson"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent shadow-lg shadow-teal-500/20"></div>
        </div>
      ) : (
        <div className="student-card overflow-hidden bg-white border-2 border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Subject</th>
                  <th className="px-6 py-4 text-center">Difficulty</th>
                  <th className="px-6 py-4 text-center">Points</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-700">{lesson.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{lesson.subject_name}</td>
                    <td className="px-6 py-4 text-center capitalize">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase border border-slate-200">
                        {lesson.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-accent font-black text-slate-900">{lesson.points}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)} className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)} className="rounded-full hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
