import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "./ui/button";
import { 
  LogOut, Trophy, Flame
} from "lucide-react";
import { navConfig, getHomeRoute } from "../config/navConfig";

export default function UniversalNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const role = user?.role || "student";
  const navLinks = navConfig[role] || navConfig.student;

  return (
    <>
      {/* ---- Desktop Navigation ---- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={getHomeRoute(role)} className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform overflow-hidden p-1 border border-slate-100">
                <img src="/questlab-logo.png" alt="QuestLab" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-bold font-heading text-slate-800 tracking-tight block leading-none">QuestLab</span>
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-1">{role} portal</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
              {navLinks.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? "bg-white text-teal-600 shadow-sm border border-slate-200" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* User Stats & Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Student-specific stats */}
              {role === "student" && (
                <>
                  <div 
                    className="hidden sm:flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100"
                    aria-label={`${user?.streak || 0} day streak`}
                  >
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="font-bold text-orange-700 text-sm" aria-hidden="true">{user?.streak || 0}</span>
                  </div>

                  <div 
                    className="hidden sm:flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100"
                    aria-label={`Level ${user?.level || 1}`}
                  >
                    <Trophy className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-teal-700 text-sm" aria-hidden="true">Lvl {user?.level || 1}</span>
                  </div>
                </>
              )}

              {/* Avatar Link */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
                <Link 
                  to="/profile"
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all hover:scale-105 active:scale-95 shadow-md overflow-hidden ${
                    location.pathname === "/profile" ? "border-teal-500 ring-2 ring-teal-500/20" : "border-white"
                  }`}
                >
                  <img 
                    src={user?.avatar || "/default_avatar.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/default_avatar.png"; }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ---- Mobile Bottom Bar ---- */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 flex md:hidden safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        aria-label="Mobile navigation"
      >
        {navLinks.map(({ to, icon: Icon, label, testId }) => {
          const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              data-testid={testId}
              className={`flex flex-col items-center justify-center flex-1 py-2.5 gap-1 min-h-[64px] transition-all ${
                isActive
                  ? "text-teal-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-teal-50" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
