import { useState } from "react";
import { useAuth, apiClient } from "../../App";
import AvatarSelector from "../../components/AvatarSelector";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import { User, MapPin, Save, Shield, Settings, Key, Lock, Eye, EyeOff, Check, Copy } from "lucide-react";

export default function ParentSettings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || "",
    email: user?.email || "",
    country: user?.country || "",
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

  const copyParentId = () => {
    navigator.clipboard.writeText(user.id.toString());
    toast.success("Parent ID copied to clipboard!");
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your parent profile and security preferences.</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 border border-slate-100 inline-flex">
          <TabsTrigger value="profile" className="rounded-xl px-8 font-black data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            <User className="w-4 h-4 mr-2" />
            My Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 font-black data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 outline-none">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden">
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
                        <Input
                          value={formData.email}
                          disabled
                          className="h-12 bg-slate-100 border-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-sm">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium"
                          placeholder="e.g. Jamaica"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-primary h-12 px-8 rounded-xl font-black shadow-lg shadow-teal-500/20"
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
            </div>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm bg-gradient-to-br from-teal-600 to-blue-700 text-white overflow-hidden relative">
                <CardHeader className="p-8 relative z-10">
                  <CardTitle className="font-black text-xl mb-2">Your Parent ID</CardTitle>
                  <CardDescription className="text-teal-100 font-medium leading-relaxed">
                    Share this ID with your children so they can link their accounts to yours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
                    <span className="text-2xl font-black tracking-widest">{user.id}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={copyParentId}
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </Card>
              
              <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Quick Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">Linked children can see your display name on their dashboard.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">Updating your avatar helps your children identify your account easily.</p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="outline-none max-w-2xl">
          <PasswordUpdateCard />
        </TabsContent>
      </Tabs>
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
    setLoading(true);
    try {
      await apiClient.put("/users/me/password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success("Password updated successfully!");
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-[2rem] border-2 border-slate-100 shadow-sm">
      <CardHeader className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-black text-slate-900">Change Password</CardTitle>
            <CardDescription className="font-medium">Keep your account secure with a strong password.</CardDescription>
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
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
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

          <div className="grid md:grid-cols-2 gap-6">
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
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-lg transition-all"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
