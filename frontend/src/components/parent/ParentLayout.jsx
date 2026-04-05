import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import { useAuth } from "../../App";
import { 
  Menu, X, Bell, Search, RefreshCw, LogOut, Heart
} from "lucide-react";
import { Button } from "../ui/button";

export default function ParentLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <ParentSidebar user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl text-sm w-64 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black text-slate-900 leading-none mb-1">{user?.display_name || user?.username}</p>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Parent</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm border border-white">
                <span className="font-black text-sm">{(user?.username || 'P')[0].toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                  <span className="font-bold text-slate-900">QuestLab</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4" onClick={() => setIsMobileMenuOpen(false)}>
                <ParentSidebar user={user} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
