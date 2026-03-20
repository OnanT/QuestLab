import { Link, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  LayoutDashboard, BookOpen, HelpCircle, Gamepad2, Users, UserPlus,
  LogOut, School, GraduationCap, ShieldCheck
} from "lucide-react";

export default function AdminSidebar({ user, onLogout }) {
  const location = useLocation();
  const links = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/admin/lessons", icon: BookOpen, label: "Lessons" },
    { path: "/admin/quizzes", icon: HelpCircle, label: "Quizzes" },
    { path: "/admin/games", icon: Gamepad2, label: "Games" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/assignments", icon: UserPlus, label: "Assignments" },
    { path: "/admin/schools", icon: School, label: "Schools" },
    { path: "/admin/subjects", icon: GraduationCap, label: "Subjects" },
  ];

  return (
    <div className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl font-accent">Q</span>
          </div>
          <div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">QuestLab</span>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-0.5">Admin Control</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact 
            ? location.pathname === path 
            : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-teal-50 text-teal-600 shadow-sm border border-teal-100/50" 
                  : "text-slate-500 hover:text-teal-600 hover:bg-slate-50"
              }`}
              data-testid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">{user?.display_name || user?.username}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">System Admin</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
