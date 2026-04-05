import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Search, Pencil, Trash2, Shield, User as UserIcon, Users } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    display_name: "",
    email: "",
    is_active: true,
    points: 0,
    level: 1
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      role: user.role,
      display_name: user.display_name || "",
      email: user.email,
      is_active: user.is_active,
      points: user.points || 0,
      level: user.level || 1
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch(`/admin/users/${editingUser.id}`, formData);
      toast.success("User updated successfully");
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-700 border-red-200";
      case "teacher": return "bg-blue-100 text-blue-700 border-blue-200";
      case "parent": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-teal-100 text-teal-700 border-teal-200";
    }
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-users">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900 text-center md:text-left">Users</h1>
          <p className="text-slate-500 font-medium text-center md:text-left">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 w-full sm:w-64 rounded-xl border-2 border-slate-100 focus:border-teal-500 bg-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11 w-full sm:w-40 rounded-xl border-2 border-slate-100 bg-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="parent">Parents</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Stats</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{user.display_name || user.username}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-lg font-bold text-[10px] uppercase border px-2 py-0.5 ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-700">{user.points} XP</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Lvl {user.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="rounded-full hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No users found</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
              <Shield className="w-6 h-6 text-teal-600" />
              Manage User
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Display Name</Label>
              <Input 
                value={formData.display_name} 
                onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <Input 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Status</Label>
                <Select value={formData.is_active ? "active" : "inactive"} onValueChange={(v) => setFormData({...formData, is_active: v === "active"})}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">XP Points</Label>
                <Input 
                  type="number"
                  value={formData.points} 
                  onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Level</Label>
                <Input 
                  type="number"
                  value={formData.level} 
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
