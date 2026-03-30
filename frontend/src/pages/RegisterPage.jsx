import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { 
  User, Mail, Lock, Eye, EyeOff, School, Users, MapPin, GraduationCap,
  ArrowLeft, ShieldCheck, Sparkles, UserCircle, ChevronRight
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    country: "",
    school: "",
    grade: "",
    parentId: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/api/country");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch schools when country changes
  useEffect(() => {
    if (!selectedCountryId) {
      setSchools([]);
      return;
    }
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`/api/schools?island_id=${selectedCountryId}`);
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    fetchSchools();
  }, [selectedCountryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      parentId: value !== "student" ? "" : prev.parentId
    }));
  };

  const handleCountryChange = (value) => {
    const country = countries.find(c => c.name === value);
    setFormData(prev => ({ ...prev, country: value, school: "" }));
    setSelectedCountryId(country?.id || null);
  };

  const handleSchoolChange = (value) => {
    setFormData(prev => ({ ...prev, school: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        country: formData.country || null,
        school: formData.school || null,
        grade: formData.grade ? parseInt(formData.grade) : null,
      };
      if (formData.role === "student" && formData.parentId) {
        userData.parent_id = parseInt(formData.parentId);
      }

      await register(userData);
      toast.success("Account created! Let's get started.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full grid lg:grid-cols-5 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side - Visual Sidebar */}
        <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-b from-teal-600 to-teal-700 p-10 flex-col justify-between relative">
          <div className="relative z-10 animate-fadeInUp">
            <Link to="/" className="flex items-center gap-2 text-teal-100 hover:text-white transition-colors mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </Link>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black font-heading text-white leading-tight mb-4">Start Your Quest!</h2>
            <p className="text-teal-100 font-medium text-sm leading-relaxed opacity-90">
              Join thousands of students across the Caribbean in the ultimate learning adventure.
            </p>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10 animate-fadeInUp stagger-2">
            <div className="flex -space-x-3 mb-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-teal-600 bg-teal-400 flex items-center justify-center text-white text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-teal-600 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold">
                +2k
              </div>
            </div>
            <p className="text-[10px] font-black text-teal-200 uppercase tracking-[0.2em]">Already Learning</p>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-teal-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-[20%] left-[-20%] w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-2xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-3 p-8 md:p-12">
          <div className="mb-10 animate-fadeInUp">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Step 1: Basics</span>
            </div>
            <h1 className="text-3xl font-black font-heading text-slate-900">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp stagger-1">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                    placeholder="Choose name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Type</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student" className="font-bold text-slate-700">Student</SelectItem>
                    <SelectItem value="parent" className="font-bold text-slate-700">Parent</SelectItem>
                    <SelectItem value="teacher" className="font-bold text-slate-700">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pl-11 pr-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                    placeholder="••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</Label>
                <Select value={formData.country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all font-medium text-sm">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.name} className="font-bold text-slate-700">
                        {c.flag_emoji} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium text-sm"
                    placeholder="1-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">School</Label>
              <Select 
                value={formData.school} 
                onValueChange={handleSchoolChange}
                disabled={!formData.country || schools.length === 0}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all font-medium text-sm">
                  <SelectValue placeholder={!formData.country ? "Select Country First" : (schools.length === 0 ? "No Schools Found" : "Select School")} />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s.id} value={s.name} className="font-bold text-slate-700">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.role === "student" && (
              <div className="space-y-2 pt-2">
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-teal-600 block mb-2">Link Parent (Optional)</Label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-300 group-focus-within:text-teal-500 transition-colors" />
                    <Input
                      name="parentId"
                      type="number"
                      value={formData.parentId}
                      onChange={handleChange}
                      className="h-10 pl-11 bg-white border-teal-100 text-sm"
                      placeholder="Enter Parent ID"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 uppercase tracking-widest">
                  Create Account <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already a member?{" "}
              <Link to="/login" className="text-teal-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
