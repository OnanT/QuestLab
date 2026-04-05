import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, Book, Tag } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: ""
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await apiClient.put(`/subjects/${editingSubject.id}`, formData);
        toast.success("Subject updated successfully");
      } else {
        await apiClient.post("/subjects", formData);
        toast.success("Subject created successfully");
      }
      setIsDialogOpen(false);
      fetchSubjects();
      resetForm();
    } catch (error) {
      toast.error("Failed to save subject");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await apiClient.delete(`/subjects/${id}`);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: ""
    });
    setEditingSubject(null);
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-subjects">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Subjects</h1>
          <p className="text-slate-500 font-medium">Manage academic curriculum subjects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[2rem] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                <Book className="w-6 h-6 text-teal-600" />
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Mathematics"
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
                {editingSubject ? "Save Changes" : "Create Subject"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="student-card p-6 bg-white border-2 border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100">
                  <Tag className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{subject.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: {subject.id}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)} className="h-8 w-8 rounded-full hover:bg-teal-50 hover:text-teal-600">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)} className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
          
          {subjects.length === 0 && (
            <div className="col-span-full p-12 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">No subjects found</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
