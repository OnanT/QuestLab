import { useState } from "react";
import { useAuth, apiClient } from "../App";
import UniversalNavbar from "../components/UniversalNavbar";
import AvatarSelector from "../components/AvatarSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { User, MapPin, School, GraduationCap, Save, Shield, Settings, Users, Key, Lock, Eye, EyeOff, Check } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || "",
    email: user?.email || "",
    country: user?.country || "",
    school: user?.school || "",
    grade: user?.grade || "",
    parent_id: user?.parent_id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = async (selection, isUpload) => {
    try {
      if (isUpload) {
        const res = await apiClient.post("/users/avatar", selection, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        updateUser(res.data);
        toast.success("Avatar uploaded and selected!");
      } else {
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
        parent_id: formData.parent_id && formData.parent_id !== "" ? parseInt(formData.parent_id) : null,
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
      <UniversalNavbar />
      
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

                  {user.role === "student" && (
                    <div className="space-y-2 max-w-sm">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Parent ID</Label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="parent_id"
                          type="number"
                          value={formData.parent_id}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="Ask your parent for their ID"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium ml-1">Linking to a parent allows them to see your progress.</p>
                    </div>
                  )}

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
            <PasswordUpdateCard />
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

function PasswordUpdateCard() {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 15;
    return strength;
  };

  const strength = calculateStrength(passwords.new_password);
  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength < 40) return "Weak";
    if (strength < 70) return "Fair";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwords.new_password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put("/users/me/password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success("Password updated successfully!");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.detail || "Failed to update password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-[2rem] border-slate-100 shadow-xl">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-black text-slate-800">Password & Security</CardTitle>
            <CardDescription className="font-medium">Update your password to keep your account safe.</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-slate-400 hover:text-teal-600"
          >
            {showPasswords ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPasswords ? "Hide" : "Show"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</Label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <Input
                name="current_password"
                type={showPasswords ? "text" : "password"}
                value={passwords.current_password}
                onChange={handlePasswordChange}
                required
                className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <Input
                name="new_password"
                type={showPasswords ? "text" : "password"}
                value={passwords.new_password}
                onChange={handlePasswordChange}
                required
                className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
              />
            </div>
            
            {passwords.new_password && (
              <div className="space-y-1.5 px-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Strength</span>
                  <span className={strength < 40 ? "text-red-500" : strength < 70 ? "text-yellow-500" : "text-green-500"}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</Label>
            <div className="relative group">
              <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
              <Input
                name="confirm_password"
                type={showPasswords ? "text" : "password"}
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
                required
                className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
