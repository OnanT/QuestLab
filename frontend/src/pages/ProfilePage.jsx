import { useState } from "react";
import { useAuth, apiClient } from "../App";
import StudentNav from "./StudentNav";
import AvatarSelector from "../components/AvatarSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { User, MapPin, School, GraduationCap, Save, Shield, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || "",
    email: user?.email || "",
    country: user?.country || "",
    school: user?.school || "",
    grade: user?.grade || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = async (selection, isUpload) => {
    try {
      if (isUpload) {
        // selection is FormData
        const res = await apiClient.post("/users/avatar", selection, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        updateUser(res.data);
      } else {
        // selection is string URL
        const res = await apiClient.put(`/users/${user.id}`, { avatar: selection });
        updateUser(res.data);
        toast.success("Avatar updated!");
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      toast.error("Failed to update avatar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatePayload = {
        display_name: formData.display_name,
        country: formData.country || null,
        school: formData.school || null,
        grade: formData.grade ? parseInt(formData.grade) : null,
      };
      
      const res = await apiClient.put(`/users/${user.id}`, updatePayload);
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <StudentNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black font-heading text-slate-900">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile, avatar, and preferences.</p>
        </header>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full justify-start md:w-auto h-auto">
            <TabsTrigger value="profile" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-fadeInUp">
            <Card className="rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <AvatarSelector currentAvatar={user.avatar} onSelect={handleAvatarSelect} />
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Name</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="Public name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Read-only)</Label>
                      <div className="relative">
                        <Input
                          value={formData.email}
                          disabled
                          className="h-12 bg-slate-100 border-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="e.g. St. Kitts"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade</Label>
                      <div className="relative group">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="grade"
                          type="number"
                          value={formData.grade}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="1-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">School</Label>
                      <div className="relative group">
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="School name"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-fadeInUp">
            <Card className="rounded-[2rem] border-slate-100 shadow-xl">
              <CardHeader className="p-8">
                <CardTitle className="font-black text-slate-800">Password & Security</CardTitle>
                <CardDescription className="font-medium">Update your password and manage account security.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  Password update functionality is coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="animate-fadeInUp">
            <Card className="rounded-[2rem] border-slate-100 shadow-xl">
              <CardHeader className="p-8">
                <CardTitle className="font-black text-slate-800">Platform Preferences</CardTitle>
                <CardDescription className="font-medium">Customize your learning experience.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  Theme and notification settings coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
