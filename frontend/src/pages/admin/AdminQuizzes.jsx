import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, HelpCircle, BookOpen } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    lesson_id: "",
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    explanation: "",
    points: 10,
    difficulty: "beginner"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, lessonsRes] = await Promise.all([
        apiClient.get("/quizzes"),
        apiClient.get("/lessons")
      ]);
      setQuizzes(quizzesRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate correct answer matches one of the options
      if (!formData.options.includes(formData.correct_answer)) {
        toast.error("Correct answer must match one of the options exactly");
        return;
      }

      if (editingQuiz) {
        await apiClient.patch(`/admin/quizzes/${editingQuiz.id}`, formData);
        toast.success("Quiz updated successfully");
      } else {
        await apiClient.post("/quizzes", formData);
        toast.success("Quiz created successfully");
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error("Failed to save quiz");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await apiClient.delete(`/admin/quizzes/${id}`);
      toast.success("Quiz deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleEdit = (quiz) => {
    setEditingUser(quiz);
    setFormData({
      lesson_id: quiz.lesson_id,
      question: quiz.question,
      options: quiz.options,
      correct_answer: quiz.correct_answer,
      explanation: quiz.explanation || "",
      points: quiz.points,
      difficulty: quiz.difficulty
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      lesson_id: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
      explanation: "",
      points: 10,
      difficulty: "beginner"
    });
    setEditingUser(null);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-quizzes">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Quizzes</h1>
          <p className="text-slate-500 font-medium">Manage assessment questions and answers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-teal-600" />
                {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Associated Lesson</Label>
                <Select value={String(formData.lesson_id)} onValueChange={(v) => setFormData({...formData, lesson_id: parseInt(v)})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500">
                    <SelectValue placeholder="Select a lesson" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                    {lessons.map((l) => (
                      <SelectItem key={l.id} value={String(l.id)} className="font-bold text-slate-700">
                        {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Question Text</Label>
                <Textarea 
                  value={formData.question} 
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Enter the quiz question..."
                  className="rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.options.map((option, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Option {idx + 1}</Label>
                    <Input 
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Choice ${idx + 1}`}
                      className="h-11 rounded-xl border-2 border-slate-100 focus:border-teal-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Correct Answer</Label>
                  <Select value={formData.correct_answer} onValueChange={(v) => setFormData({...formData, correct_answer: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-emerald-50/50 border-emerald-100 text-emerald-700 focus:border-emerald-500">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      {formData.options.map((opt, i) => (
                        opt && <SelectItem key={i} value={opt} className="font-bold">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">XP Points</Label>
                    <Input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} className="h-12 rounded-xl border-2 border-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(v) => setFormData({...formData, difficulty: v})}>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="beginner" className="font-bold">Beginner</SelectItem>
                        <SelectItem value="intermediate" className="font-bold">Intermediate</SelectItem>
                        <SelectItem value="advanced" className="font-bold">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Explanation (Optional)</Label>
                <Textarea 
                  value={formData.explanation} 
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Explain why the answer is correct..."
                  className="rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500"
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
                {editingQuiz ? "Save Changes" : "Publish Quiz"}
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
                  <th className="px-6 py-4 text-left">Lesson</th>
                  <th className="px-6 py-4 text-left">Question</th>
                  <th className="px-6 py-4 text-center">Difficulty</th>
                  <th className="px-6 py-4 text-center">XP</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span className="font-bold text-slate-700 truncate text-sm">{quiz.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600 line-clamp-1">{quiz.question}</p>
                    </td>
                    <td className="px-6 py-4 text-center capitalize">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase border border-slate-200">
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-accent font-black text-slate-900">{quiz.points}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(quiz)} className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(quiz.id)} className="rounded-full hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {quizzes.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No quizzes found</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Create your first assessment to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
