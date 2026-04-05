import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";
import { User as UserIcon, GraduationCap as TeacherIcon, Users as ParentIcon } from "lucide-react";

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "",
    parent_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, usersRes] = await Promise.all([
        apiClient.get("/admin/assignments"),
        apiClient.get("/admin/users")
      ]);
      setAssignments(assignmentsRes.data);
      
      const allUsers = usersRes.data;
      setStudents(allUsers.filter(u => u.role === "student"));
      setTeachers(allUsers.filter(u => u.role === "teacher"));
      setParents(allUsers.filter(u => u.role === "parent"));
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id) {
        toast.error("Student is required");
        return;
    }
    try {
      await apiClient.post("/admin/assignments", formData);
      toast.success("Assignment created successfully");
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error("Failed to create assignment");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await apiClient.delete(`/admin/assignments/${id}`);
      toast.success("Assignment removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: "",
      teacher_id: "",
      parent_id: ""
    });
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-assignments">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Assignments</h1>
          <p className="text-slate-500 font-medium">Link students with teachers and parents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[2rem] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                <LinkIcon className="w-6 h-6 text-teal-600" />
                Create Assignment
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Student</Label>
                <Select value={String(formData.student_id)} onValueChange={(v) => setFormData({...formData, student_id: parseInt(v)})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    {students.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.display_name || u.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Teacher (Optional)</Label>
                <Select value={formData.teacher_id ? String(formData.teacher_id) : "none"} onValueChange={(v) => setFormData({...formData, teacher_id: v === "none" ? null : parseInt(v)})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    <SelectItem value="none">None</SelectItem>
                    {teachers.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.display_name || u.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Parent (Optional)</Label>
                <Select value={formData.parent_id ? String(formData.parent_id) : "none"} onValueChange={(v) => setFormData({...formData, parent_id: v === "none" ? null : parseInt(v)})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50">
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    <SelectItem value="none">None</SelectItem>
                    {parents.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.display_name || u.username}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
                Assign Users
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
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-left">Teacher</th>
                  <th className="px-6 py-4 text-left">Parent</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-slate-800">{a.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {a.teacher_name ? (
                          <>
                            <TeacherIcon className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium text-slate-600">{a.teacher_name}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 italic text-xs">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {a.parent_name ? (
                          <>
                            <ParentIcon className="w-4 h-4 text-purple-500" />
                            <span className="font-medium text-slate-600">{a.parent_name}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 italic text-xs">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
