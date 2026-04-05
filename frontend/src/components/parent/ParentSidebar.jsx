import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  LayoutDashboard, Users, BookOpen, Settings, LogOut, Heart, 
  BarChart3, Gamepad2, Award
} from "lucide-react";

export default function ParentSidebar({ user, onLogout }) {
  const location = useLocation();
  const links = [
    { path: "/parent", icon: LayoutDashboard, label: "Overview", exact: true },
    { path: "/parent/children", icon: Users, label: "My Children" },
    { path: "/parent/curriculum", icon: BookOpen, label: "Curriculum" },
    { path: "/parent/reports", icon: BarChart3, label: "Reports" },
    { path: "/parent/settings", icon: Settings, label: "Account Settings" },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 overflow-hidden shadow-sm">
      <div className="p-8">
        <Link to="/parent" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl font-accent">Q</span>
          </div>
          <div>
            <span className="text-xl font-bold font-heading text-slate-800 tracking-tight">QuestLab</span>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-0.5">Parent Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar py-4">
        {links.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact 
            ? location.pathname === path 
            : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-teal-50 text-teal-600 shadow-sm border border-teal-100/50" 
                  : "text-slate-500 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-6 px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center border-2 border-white">
            <Heart className="w-5 h-5 text-teal-600 fill-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">{user?.display_name || user?.username}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Parent Account</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
