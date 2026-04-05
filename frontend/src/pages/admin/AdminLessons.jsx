import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus, Pencil, Trash2, BookOpen, Eye, Layout, CheckCircle2, Globe, ImagePlus } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";
import MediaPicker from "../../components/admin/MediaPicker";

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const textareaRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: "",
    concept_id: "",
    content_html: "",
    grade_levels: [],
    difficulty: "beginner",
    points: 15,
    estimated_time: 20,
    is_published: true,
    is_featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, conceptsRes] = await Promise.all([
        apiClient.get("/lessons"),
        apiClient.get("/concepts")
      ]);
      setLessons(lessonsRes.data);
      setConcepts(conceptsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        grade_levels: formData.grade_levels.map(String)
      };
      
      if (editingLesson) {
        await apiClient.put(`/lessons/${editingLesson.id}`, data);
        toast.success("Lesson updated successfully");
      } else {
        await apiClient.post("/lessons", data);
        toast.success("Lesson created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.detail || "Failed to save lesson");
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

  const handleEdit = async (lesson) => {
    try {
      const res = await apiClient.get(`/lessons/enhanced/${lesson.id}`);
      const fullLesson = res.data;
      
      setEditingLesson(fullLesson);
      setFormData({
        title: fullLesson.title,
        concept_id: fullLesson.concept_id || "",
        content_html: fullLesson.content_html,
        grade_levels: fullLesson.grade_levels || [],
        difficulty: fullLesson.difficulty,
        points: fullLesson.points,
        estimated_time: fullLesson.estimated_time,
        is_published: fullLesson.is_published,
        is_featured: fullLesson.is_featured
      });
      setIsDialogOpen(true);
      setActiveTab("editor");
    } catch (error) {
      toast.error("Failed to load lesson details");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      concept_id: "",
      content_html: "",
      grade_levels: [],
      difficulty: "beginner",
      points: 15,
      estimated_time: 20,
      is_published: true,
      is_featured: false
    });
    setEditingLesson(null);
    setActiveTab("editor");
  };

  const insertMedia = (item) => {
    let tag = "";
    if (item.category === "image") {
      tag = `<img src="${item.url}" alt="${item.filename}" className="rounded-2xl shadow-lg my-8 w-full max-w-2xl mx-auto" />\n`;
    } else if (item.category === "video") {
      tag = `<video controls className="rounded-2xl shadow-lg my-8 w-full max-w-2xl mx-auto">\n  <source src="${item.url}" type="${item.filetype}" />\n</video>\n`;
    } else if (item.category === "audio") {
      tag = `<audio controls className="my-4 w-full">\n  <source src="${item.url}" type="${item.filetype}" />\n</audio>\n`;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content_html;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setFormData({
      ...formData,
      content_html: before + tag + after
    });

    // Reset focus and cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
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
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl border-none shadow-2xl p-0">
            <DialogHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                </DialogTitle>
                
                <div className="flex items-center gap-6 mr-8">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published</Label>
                    <Switch 
                      checked={formData.is_published} 
                      onCheckedChange={(v) => setFormData({...formData, is_published: v})} 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured</Label>
                    <Switch 
                      checked={formData.is_featured} 
                      onCheckedChange={(v) => setFormData({...formData, is_featured: v})} 
                    />
                  </div>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 border-b border-slate-100 flex items-center justify-between">
                <TabsList className="flex gap-4">
                  <TabsTrigger value="editor" className="py-4 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="py-4 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Live Preview
                  </TabsTrigger>
                </TabsList>
                
                {activeTab === "editor" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="h-9 rounded-lg border-2 border-slate-100 hover:border-teal-100 hover:bg-teal-50 hover:text-teal-600 font-bold transition-all"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Insert Media
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <TabsContent value="editor" className="mt-0 space-y-6 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Title</Label>
                      <Input 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        required 
                        placeholder="e.g., Introduction to Fractions"
                        className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Academic Concept</Label>
                      <Select value={String(formData.concept_id)} onValueChange={(v) => setFormData({...formData, concept_id: parseInt(v)})}>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                          <SelectValue placeholder="Select concept" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                          {concepts.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)} className="font-bold text-slate-700">
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lesson Content (HTML)</Label>
                    <Textarea 
                      ref={textareaRef}
                      value={formData.content_html} 
                      onChange={(e) => setFormData({...formData, content_html: e.target.value})} 
                      rows={12} 
                      required 
                      placeholder="Write your lesson content here using HTML tags..."
                      className="rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all p-4 font-mono text-sm leading-relaxed" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <Input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} className="h-12 rounded-xl border-2 border-slate-100" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Time (Min)</Label>
                      <Input type="number" value={formData.estimated_time} onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})} className="h-12 rounded-xl border-2 border-slate-100" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0 outline-none">
                  <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-100 min-h-[400px]">
                    <h1 className="text-3xl font-black font-heading text-slate-900 mb-6">{formData.title || "Untitled Lesson"}</h1>
                    <div 
                      className="prose prose-slate max-w-none lesson-content"
                      dangerouslySetInnerHTML={{ __html: formData.content_html || "<p className='text-slate-400 italic'>No content to preview...</p>" }}
                    />
                  </div>
                </TabsContent>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                <Button onClick={handleSubmit} className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  {editingLesson ? "Save Changes" : "Publish Lesson"}
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <MediaPicker 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={insertMedia} 
      />

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
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Lesson Title</th>
                  <th className="px-6 py-4 text-center">Difficulty</th>
                  <th className="px-6 py-4 text-center">XP</th>
                  <th className="px-6 py-4 text-center">Engagement</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 w-20">
                      {lesson.is_published ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
                          <Globe className="w-3 h-3" /> Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Draft
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{lesson.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">UUID: {lesson.uuid?.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center capitalize">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase border border-slate-200">
                        {lesson.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-accent font-black text-slate-900">{lesson.points}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-700">{lesson.view_count || 0} views</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{lesson.completion_count || 0} completions</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          
          {lessons.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No lessons found</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Start by creating your first lesson content.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
