import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, School, MapPin } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    island_id: null
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/schools");
      setSchools(response.data);
    } catch (error) {
      toast.error("Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchool) {
        await apiClient.put(`/schools/${editingSchool.id}`, formData);
        toast.success("School updated successfully");
      } else {
        await apiClient.post("/schools", formData);
        toast.success("School created successfully");
      }
      setIsDialogOpen(false);
      fetchSchools();
      resetForm();
    } catch (error) {
      toast.error("Failed to save school");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    try {
      await apiClient.delete(`/schools/${id}`);
      toast.success("School deleted");
      fetchSchools();
    } catch (error) {
      toast.error("Failed to delete school");
    }
  };

  const handleEdit = (school) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address || "",
      island_id: school.island_id
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      island_id: null
    });
    setEditingSchool(null);
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-schools">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Schools</h1>
          <p className="text-slate-500 font-medium">Manage registered educational institutions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[2rem] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                <School className="w-6 h-6 text-teal-600" />
                {editingSchool ? "Edit School" : "Add New School"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">School Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Quest Academy"
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Address / Location</Label>
                <Input 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Street, City, Country"
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
                {editingSchool ? "Save Changes" : "Create School"}
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
                  <th className="px-6 py-4 text-left">School Name</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-center">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                          <School className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-bold text-slate-800">{school.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{school.address || "No address provided"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-400 font-medium">
                      {new Date(school.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(school)} className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(school.id)} className="rounded-full hover:bg-red-50 hover:text-red-600">
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
