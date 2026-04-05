import { useMemo } from "react";
import { 
  Users, Star, HelpCircle, Award, TrendingUp, 
  ArrowRight, BookOpen, Gamepad2, PlayCircle
} from "lucide-react";
import { useAuth } from "../../App";
import { useParentData } from "../../hooks/useParentData";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

export default function ParentOverview() {
  const { user } = useAuth();
  const { students, loading, error, refetch } = useParentData();

  const overallStats = useMemo(() => {
    if (!students || !students.length) return { totalPoints: 0, totalQuizzes: 0, totalGames: 0, totalBadges: 0, totalStudents: 0 };
    
    return {
      totalPoints: students.reduce((sum, s) => sum + (s.total_points || 0), 0),
      totalStudents: students.length,
      totalQuizzes: students.reduce((sum, s) => sum + (s.quizzes_completed || 0), 0),
      totalGames: students.reduce((sum, s) => sum + (s.games_played || 0), 0),
      totalBadges: students.reduce((sum, s) => sum + (Array.isArray(s.badges) ? s.badges.length : 0), 0),
    };
  }, [students]);

  if (loading && !students.length) {
    return <div className="animate-pulse space-y-8">
      <div className="h-12 bg-slate-200 rounded-2xl w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
      </div>
      <div className="h-64 bg-slate-200 rounded-3xl"></div>
    </div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Welcome back, <span className="text-teal-600">{user?.display_name || user?.username}</span>!
          </h1>
          <p className="text-slate-500 font-medium">Here's how your children are progressing today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/parent/children">
            <Button className="btn-primary rounded-2xl px-6 h-12">
              <Users className="w-4 h-4 mr-2" />
              Manage Children
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Children" value={overallStats.totalStudents} color="teal" />
        <StatCard icon={Star} label="Total Points" value={overallStats.totalPoints} color="amber" />
        <StatCard icon={HelpCircle} label="Quizzes Completed" value={overallStats.totalQuizzes} color="orange" />
        <StatCard icon={Award} label="Badges Earned" value={overallStats.totalBadges} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity / Performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Performance Overview
            </h2>
            <Link to="/parent/reports" className="text-teal-600 text-sm font-bold hover:underline flex items-center">
              View All Reports <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm">
            {students.length > 0 ? (
               <div className="space-y-8">
                 {students.slice(0, 3).map(student => (
                   <div key={student.id} className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="font-bold text-slate-700">{student.display_name || student.username}</span>
                       <span className="text-sm font-black text-teal-600">{student.average_score || 0}% Accuracy</span>
                     </div>
                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-teal-500 rounded-full transition-all duration-1000" 
                         style={{ width: `${student.average_score || 0}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 font-medium italic">No data available yet. Start by adding a child!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 px-2">Quick Actions</h2>
          <div className="space-y-4">
            <QuickActionCard 
              to="/parent/curriculum" 
              icon={BookOpen} 
              title="Explore Lessons" 
              desc="View current curriculum"
              color="teal"
            />
            <QuickActionCard 
              to="/parent/children" 
              icon={Gamepad2} 
              title="Add a Child" 
              desc="Create new student account"
              color="orange"
            />
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-2">Need Help?</h3>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">Check out our guide on how to best support your child's learning.</p>
                <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none rounded-xl font-bold w-full">
                  Read Parent Guide
                </Button>
              </div>
              <PlayCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={`bg-white border-2 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow ${colors[color].split(' ')[2]}`}>
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color].split(' ')[0]} border shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-black font-accent text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ to, icon: Icon, title, desc, color }) {
  const colors = {
    teal: "bg-teal-50 text-teal-600 border-teal-100 hover:border-teal-300",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300",
  };

  return (
    <Link to={to} className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all bg-white ${colors[color]}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color].split(' ')[0]} flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 leading-none mb-1">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </Link>
  );
}
