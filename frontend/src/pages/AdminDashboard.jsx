import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  LayoutDashboard, BookOpen, HelpCircle, Gamepad2, Users, UserPlus,
  LogOut, Plus, Pencil, Trash2, ChevronRight, School, GraduationCap
} from "lucide-react";
import { toast } from "sonner";

// Admin Sidebar
function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { path: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", exact: true },
    { path: "/admin/lessons", icon: <BookOpen className="w-5 h-5" />, label: "Lessons" },
    { path: "/admin/quizzes", icon: <HelpCircle className="w-5 h-5" />, label: "Quizzes" },
    { path: "/admin/games", icon: <Gamepad2 className="w-5 h-5" />, label: "Games" },
    { path: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Users" },
    { path: "/admin/assignments", icon: <UserPlus className="w-5 h-5" />, label: "Assignments" },
    { path: "/admin/schools", icon: <School className="w-5 h-5" />, label: "Schools" },
    { path: "/admin/subjects", icon: <GraduationCap className="w-5 h-5" />, label: "Subjects" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl font-accent">Q</span>
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-slate-800">QuestLab</span>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = link.exact 
            ? location.pathname === link.path 
            : location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
              data-testid={`admin-nav-${link.label.toLowerCase()}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{user?.display_name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{user?.display_name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout} data-testid="admin-logout-btn">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

// Overview Dashboard
function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, lessons: 0, quizzes: 0, games: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, lessons, quizzes, games] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/lessons"),
        apiClient.get("/quizzes"),
        apiClient.get("/games")
      ]);
      setStats({
        users: users.data.length,
        lessons: lessons.data.length,
        quizzes: quizzes.data.length,
        games: games.data.length
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading text-slate-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="admin-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
              <p className="text-sm text-slate-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.lessons}</p>
              <p className="text-sm text-slate-500">Lessons</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.quizzes}</p>
              <p className="text-sm text-slate-500">Quizzes</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.games}</p>
              <p className="text-sm text-slate-500">Games</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Link to="/admin/lessons" className="admin-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-900">Manage Lessons</h3>
                <p className="text-sm text-slate-500">Create and edit educational content</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </Link>
        <Link to="/admin/quizzes" className="admin-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-bold text-slate-900">Manage Quizzes</h3>
                <p className="text-sm text-slate-500">Create and edit quizzes</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </Link>
        <Link to="/admin/games" className="admin-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Gamepad2 className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900">Manage Games</h3>
                <p className="text-sm text-slate-500">Create and configure learning games</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </Link>
        <Link to="/admin/assignments" className="admin-card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900">Student Assignments</h3>
                <p className="text-sm text-slate-500">Assign students to parents & teachers</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </Link>
      </div>
    </div>
  );
}

// Lessons Management
function AdminLessons() {
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
    <div data-testid="admin-lessons">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Lessons</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => { resetForm(); setEditingLesson(null); }} data-testid="add-lesson-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required data-testid="lesson-title-input" />
              </div>
              <div>
                <Label>Subject</Label>
                <Select value={formData.subject_id} onValueChange={(v) => setFormData({...formData, subject_id: v})}>
                  <SelectTrigger data-testid="lesson-subject-select"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content (HTML supported)</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} required data-testid="lesson-content-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => setFormData({...formData, difficulty: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Points</Label>
                  <Input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} data-testid="lesson-points-input" />
                </div>
              </div>
              <div>
                <Label>Estimated Time (minutes)</Label>
                <Input type="number" value={formData.estimated_time} onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})} />
              </div>
              <div>
                <Label>Grade Levels (comma separated, e.g., 3,4,5)</Label>
                <Input value={formData.grade_levels.join(",")} onChange={(e) => setFormData({...formData, grade_levels: e.target.value.split(",").filter(Boolean)})} placeholder="3,4,5" />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" data-testid="save-lesson-btn">
                {editingLesson ? "Update Lesson" : "Create Lesson"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-center">Difficulty</th>
                <th className="px-4 py-3 text-center">Points</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3 text-slate-600">{lesson.subject_name}</td>
                  <td className="px-4 py-3 text-center capitalize">{lesson.difficulty}</td>
                  <td className="px-4 py-3 text-center">{lesson.points}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(lesson)} data-testid={`edit-lesson-${lesson.id}`}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)} data-testid={`delete-lesson-${lesson.id}`}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Quizzes Management
function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    lesson_id: "",
    questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: "", points: 5 }],
    grade_levels: [],
    difficulty: "beginner",
    time_limit: 300,
    pass_score: 70
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, subjectsRes, lessonsRes] = await Promise.all([
        apiClient.get("/quizzes"),
        apiClient.get("/subjects"),
        apiClient.get("/lessons")
      ]);
      setQuizzes(quizzesRes.data);
      setSubjects(subjectsRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question_text: "", options: ["", "", "", ""], correct_answer: "", points: 5 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    if (field.startsWith("option_")) {
      const optIndex = parseInt(field.split("_")[1]);
      updated[index].options[optIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setFormData({ ...formData, questions: updated });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        grade_levels: formData.grade_levels.map(Number),
        lesson_id: formData.lesson_id || null
      };
      
      if (editingQuiz) {
        await apiClient.put(`/quizzes/${editingQuiz.id}`, data);
        toast.success("Quiz updated successfully");
      } else {
        await apiClient.post("/quizzes", data);
        toast.success("Quiz created successfully");
      }
      setIsDialogOpen(false);
      setEditingQuiz(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Failed to save quiz");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await apiClient.delete(`/quizzes/${id}`);
      toast.success("Quiz deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      subject_id: quiz.subject_id,
      lesson_id: quiz.lesson_id || "",
      questions: quiz.questions.map(q => ({
        question_text: q.question_text,
        options: q.options || ["", "", "", ""],
        correct_answer: q.correct_answer,
        points: q.points || 5
      })),
      grade_levels: quiz.grade_levels || [],
      difficulty: quiz.difficulty,
      time_limit: quiz.time_limit,
      pass_score: quiz.pass_score
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject_id: "",
      lesson_id: "",
      questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: "", points: 5 }],
      grade_levels: [],
      difficulty: "beginner",
      time_limit: 300,
      pass_score: 70
    });
  };

  return (
    <div data-testid="admin-quizzes">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Quizzes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { resetForm(); setEditingQuiz(null); }} data-testid="add-quiz-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required data-testid="quiz-title-input" />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Select value={formData.subject_id} onValueChange={(v) => setFormData({...formData, subject_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(v) => setFormData({...formData, difficulty: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time Limit (seconds)</Label>
                  <Input type="number" value={formData.time_limit} onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value)})} />
                </div>
                <div>
                  <Label>Pass Score (%)</Label>
                  <Input type="number" value={formData.pass_score} onChange={(e) => setFormData({...formData, pass_score: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-bold">Questions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-1" /> Add Question
                  </Button>
                </div>
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 border rounded-lg mb-4 bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Question {qIndex + 1}</span>
                      {formData.questions.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <Input 
                      placeholder="Question text" 
                      value={q.question_text} 
                      onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)} 
                      className="mb-3"
                      data-testid={`question-${qIndex}-text`}
                    />
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt, optIndex) => (
                        <Input 
                          key={optIndex}
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateQuestion(qIndex, `option_${optIndex}`, e.target.value)}
                          data-testid={`question-${qIndex}-option-${optIndex}`}
                        />
                      ))}
                    </div>
                    <Input 
                      placeholder="Correct answer (must match one option exactly)"
                      value={q.correct_answer}
                      onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                      data-testid={`question-${qIndex}-answer`}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" data-testid="save-quiz-btn">
                {editingQuiz ? "Update Quiz" : "Create Quiz"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-center">Questions</th>
                <th className="px-4 py-3 text-center">Difficulty</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{quiz.title}</td>
                  <td className="px-4 py-3 text-slate-600">{quiz.subject_name}</td>
                  <td className="px-4 py-3 text-center">{quiz.questions?.length || 0}</td>
                  <td className="px-4 py-3 text-center capitalize">{quiz.difficulty}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(quiz)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(quiz.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Games Management (simplified - uses JSON config)
function AdminGames() {
  const [games, setGames] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, subjectsRes] = await Promise.all([
        apiClient.get("/games"),
        apiClient.get("/subjects")
      ]);
      setGames(gamesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await apiClient.delete(`/games/${id}`);
      toast.success("Game deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete game");
    }
  };

  return (
    <div data-testid="admin-games">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Games</h1>
        <p className="text-sm text-slate-500">Games are configured via database seed. Contact admin for custom games.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-center">Difficulty</th>
                <th className="px-4 py-3 text-center">Points</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{game.title}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{game.game_type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-slate-600">{game.subject_name}</td>
                  <td className="px-4 py-3 text-center capitalize">{game.difficulty}</td>
                  <td className="px-4 py-3 text-center">{game.points}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(game.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Users Management
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter !== "all" ? `?role=${filter}` : "";
      const res = await apiClient.get(`/admin/users${params}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div data-testid="admin-users">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Users</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[150px]" data-testid="users-role-filter">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="teacher">Teachers</SelectItem>
            <SelectItem value="parent">Parents</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-center">Points</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{user.display_name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-center capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-center">{user.points || 0}</td>
                  <td className="px-4 py-3 text-center">{user.level || 1}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Student Assignments
function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: "", parent_id: "", teacher_id: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, usersRes] = await Promise.all([
        apiClient.get("/admin/assignments"),
        apiClient.get("/admin/users")
      ]);
      setAssignments(assignmentsRes.data);
      setStudents(usersRes.data.filter(u => u.role === "student"));
      setParents(usersRes.data.filter(u => u.role === "parent"));
      setTeachers(usersRes.data.filter(u => u.role === "teacher"));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/admin/assignments", {
        student_id: formData.student_id,
        parent_id: formData.parent_id || null,
        teacher_id: formData.teacher_id || null
      });
      toast.success("Assignment saved");
      setIsDialogOpen(false);
      setFormData({ student_id: "", parent_id: "", teacher_id: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to save assignment");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await apiClient.delete(`/admin/assignments/${id}`);
      toast.success("Assignment deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div data-testid="admin-assignments">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Student Assignments</h1>
          <p className="text-sm text-slate-500">Assign students to parents and teachers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-assignment-btn">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Student</Label>
                <Select value={formData.student_id} onValueChange={(v) => setFormData({...formData, student_id: v})}>
                  <SelectTrigger data-testid="assignment-student-select"><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parent (optional)</Label>
                <Select value={formData.parent_id} onValueChange={(v) => setFormData({...formData, parent_id: v})}>
                  <SelectTrigger data-testid="assignment-parent-select"><SelectValue placeholder="Select parent" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {parents.map((p) => <SelectItem key={p.id} value={p.id}>{p.display_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teacher (optional)</Label>
                <Select value={formData.teacher_id} onValueChange={(v) => setFormData({...formData, teacher_id: v})}>
                  <SelectTrigger data-testid="assignment-teacher-select"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.display_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="save-assignment-btn">
                Save Assignment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Parent</th>
                <th className="px-4 py-3 text-left">Teacher</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{a.student_name}</td>
                  <td className="px-4 py-3 text-slate-600">{a.parent_name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{a.teacher_name || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Schools Management
function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", island_id: "", address: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schoolsRes, islandsRes] = await Promise.all([
        apiClient.get("/schools"),
        apiClient.get("/islands")
      ]);
      setSchools(schoolsRes.data);
      setIslands(islandsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/schools", formData);
      toast.success("School added");
      setIsDialogOpen(false);
      setFormData({ name: "", island_id: "", address: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add school");
    }
  };

  return (
    <div data-testid="admin-schools">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Schools</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700" data-testid="add-school-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add School</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>School Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Island</Label>
                <Select value={formData.island_id} onValueChange={(v) => setFormData({...formData, island_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Select island" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {islands.map((i) => <SelectItem key={i.id} value={i.id}>{i.flag_emoji} {i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Address (optional)</Label>
                <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Add School</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="admin-table">
                <th className="px-4 py-3 text-left">School Name</th>
                <th className="px-4 py-3 text-left">Island</th>
                <th className="px-4 py-3 text-left">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{school.name}</td>
                  <td className="px-4 py-3 text-slate-600">{school.island_name}</td>
                  <td className="px-4 py-3 text-slate-600">{school.address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Subjects Management
function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "book", color: "#008080" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiClient.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/subjects", formData);
      toast.success("Subject added");
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", icon: "book", color: "#008080" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add subject");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await apiClient.delete(`/subjects/${id}`);
      toast.success("Subject deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  return (
    <div data-testid="admin-subjects">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Subjects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700" data-testid="add-subject-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subject</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g., Information Technology" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief description" />
              </div>
              <div>
                <Label>Color</Label>
                <Input type="color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="h-10 w-full" />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Add Subject</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="admin-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">{subject.name}</h3>
                <p className="text-sm text-slate-500">{subject.description || "No description"}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(subject.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin Dashboard
export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50" data-testid="admin-dashboard">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="schools" element={<AdminSchools />} />
          <Route path="subjects" element={<AdminSubjects />} />
        </Routes>
      </main>
    </div>
  );
}
