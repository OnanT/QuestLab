import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient, useAuth } from "../App";
import { Award, Trophy, Star, Flame, Zap, Crown, Target, Gamepad2, ArrowLeft, Lock } from "lucide-react";
import StudentNav from "./StudentNav";

export default function AchievementsPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await apiClient.get("/badges");
      setBadges(res.data);
    } catch (error) {
      console.error("Failed to fetch badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeId) => {
    switch (badgeId) {
      case "first_quiz": return <Trophy className="w-8 h-8" />;
      case "quiz_master_5": return <Star className="w-8 h-8" />;
      case "quiz_master_10": return <Crown className="w-8 h-8" />;
      case "first_game": return <Gamepad2 className="w-8 h-8" />;
      case "game_explorer_5": return <Target className="w-8 h-8" />;
      case "century_100": return <Zap className="w-8 h-8" />;
      case "champion_500": return <Award className="w-8 h-8" />;
      case "legend_1000": return <Flame className="w-8 h-8" />;
      default: return <Award className="w-8 h-8" />;
    }
  };

  const userBadges = user?.badges || [];

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="achievements-page">
      <StudentNav />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Achievements</h1>
            <p className="text-slate-600">Collect badges by completing challenges</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="student-card p-6 text-center">
            <p className="text-4xl font-bold font-accent text-teal-600">{userBadges.length}</p>
            <p className="text-sm text-slate-500">Badges Earned</p>
          </div>
          <div className="student-card p-6 text-center">
            <p className="text-4xl font-bold font-accent text-slate-400">{badges.length - userBadges.length}</p>
            <p className="text-sm text-slate-500">Remaining</p>
          </div>
          <div className="student-card p-6 text-center">
            <p className="text-4xl font-bold font-accent text-amber-600">{user?.points || 0}</p>
            <p className="text-sm text-slate-500">Total Points</p>
          </div>
        </div>

        {/* Badges Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => {
              const isUnlocked = userBadges.includes(badge.id);
              
              return (
                <div 
                  key={badge.id}
                  className={`student-card p-6 text-center ${isUnlocked ? "" : "opacity-60"}`}
                  data-testid={`badge-${badge.id}`}
                >
                  <div 
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isUnlocked ? "" : "grayscale"}`}
                    style={{ backgroundColor: isUnlocked ? `${badge.color}20` : "#e2e8f0" }}
                  >
                    {isUnlocked ? (
                      <span style={{ color: badge.color }}>{getBadgeIcon(badge.id)}</span>
                    ) : (
                      <Lock className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <h3 className="font-bold font-heading text-slate-900 mb-1">{badge.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">{badge.description}</p>
                  {isUnlocked ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Unlocked!
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                      Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
