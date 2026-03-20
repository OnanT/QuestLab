import { Button } from "../../components/ui/button";
import { 
  Users, BookOpen, HelpCircle, Gamepad2, ChevronRight, 
  RefreshCw, Activity, Database
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminOverview({ stats, loading, refetch }) {
  return (
    <div data-testid="admin-overview" className="animate-fadeInUp">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">System Overview</h1>
          <p className="text-slate-500 font-medium">Global platform status and statistics</p>
        </div>
        <Button onClick={refetch} disabled={loading} variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-400">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <AdminStatCard icon={Users} label="Total Users" value={stats.users} color="blue" testId="stat-users" />
        <AdminStatCard icon={BookOpen} label="Lessons" value={stats.lessons} color="teal" testId="stat-lessons" />
        <AdminStatCard icon={HelpCircle} label="Quizzes" value={stats.quizzes} color="orange" testId="stat-quizzes" />
        <AdminStatCard icon={Gamepad2} label="Games" value={stats.games} color="purple" testId="stat-games" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Quick Management
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <ManagementLink to="/admin/lessons" icon={BookOpen} title="Content" desc="Manage lessons & materials" color="teal" />
            <ManagementLink to="/admin/users" icon={Users} title="User Directory" desc="Edit profiles & permissions" color="blue" />
            <ManagementLink to="/admin/assignments" icon={UserPlus} title="Assignments" desc="Connect students & teachers" color="indigo" />
            <ManagementLink to="/admin/schools" icon={School} title="Institutions" desc="Manage partner schools" color="slate" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading text-slate-800">System Health</h2>
          <div className="student-card p-6 bg-white border-2 border-slate-100 shadow-sm">
            <div className="space-y-4">
              <HealthItem label="API Server" status="online" />
              <HealthItem label="Database" status="online" />
              <HealthItem label="Storage" status="online" />
              <div className="pt-4 mt-4 border-t border-slate-50">
                <Button variant="outline" className="w-full rounded-xl font-bold text-xs">
                  <Database className="w-3.5 h-3.5 mr-2" />
                  Database Backups
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Stat Card
function AdminStatCard({ icon: Icon, label, value, color, testId }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`student-card p-5 border shadow-sm ${colors[color]}`} data-testid={testId}>
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color].split(' ')[0]} border shadow-sm`}>
          <Icon className="w-5 h-5 stroke-[2.5px]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-70 mb-1">{label}</p>
          <p className="text-2xl font-black font-accent text-slate-900 tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ManagementLink({ to, icon: Icon, title, desc, color }) {
  return (
    <Link to={to} className="student-card p-5 bg-white border-2 border-slate-100 hover:border-teal-200 group transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </Link>
  );
}

function HealthItem({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">{status}</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
      </div>
    </div>
  );
}

// Missing icons for the links
import { UserPlus, School } from "lucide-react";
