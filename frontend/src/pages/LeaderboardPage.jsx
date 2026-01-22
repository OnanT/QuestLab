import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient, useAuth } from "../App";
import { Trophy, Medal, Star, ArrowLeft, Crown } from "lucide-react";
import StudentNav from "./StudentNav";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await apiClient.get("/leaderboard?limit=50");
      setLeaderboard(res.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { bg: "bg-gradient-to-r from-amber-400 to-yellow-400", icon: <Crown className="w-6 h-6 text-white" />, text: "text-white" };
      case 1: return { bg: "bg-gradient-to-r from-slate-300 to-slate-400", icon: <Medal className="w-6 h-6 text-white" />, text: "text-white" };
      case 2: return { bg: "bg-gradient-to-r from-amber-600 to-orange-600", icon: <Medal className="w-6 h-6 text-white" />, text: "text-white" };
      default: return { bg: "bg-slate-100", icon: null, text: "text-slate-600" };
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="leaderboard-page">
      <StudentNav />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Leaderboard</h1>
            <p className="text-slate-600">See how you rank against other students</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Second Place */}
            <div className="pt-8">
              <div className="student-card p-4 text-center bg-gradient-to-b from-slate-100 to-white">
                <div className="w-16 h-16 mx-auto bg-slate-300 rounded-full flex items-center justify-center mb-3 -mt-10 border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="font-bold text-slate-900 truncate">{leaderboard[1]?.display_name}</p>
                <p className="text-sm text-slate-500">Level {leaderboard[1]?.level}</p>
                <p className="font-accent font-bold text-lg text-slate-700 mt-2">{leaderboard[1]?.points} pts</p>
              </div>
            </div>
            
            {/* First Place */}
            <div>
              <div className="student-card p-4 text-center bg-gradient-to-b from-amber-100 to-white border-2 border-amber-200 shadow-xl">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center mb-3 -mt-12 border-4 border-white shadow-lg">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <p className="font-bold text-slate-900 truncate">{leaderboard[0]?.display_name}</p>
                <p className="text-sm text-slate-500">Level {leaderboard[0]?.level}</p>
                <p className="font-accent font-bold text-xl text-amber-600 mt-2">{leaderboard[0]?.points} pts</p>
              </div>
            </div>
            
            {/* Third Place */}
            <div className="pt-12">
              <div className="student-card p-4 text-center bg-gradient-to-b from-orange-100 to-white">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-3 -mt-8 border-4 border-white shadow-lg">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <p className="font-bold text-slate-900 truncate">{leaderboard[2]?.display_name}</p>
                <p className="text-sm text-slate-500">Level {leaderboard[2]?.level}</p>
                <p className="font-accent font-bold text-lg text-orange-700 mt-2">{leaderboard[2]?.points} pts</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="student-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Level</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Badges</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((student, index) => {
                  const rankStyle = getRankStyle(index);
                  const isCurrentUser = student.id === user?.id;
                  
                  return (
                    <tr 
                      key={student.id} 
                      className={`${isCurrentUser ? "bg-teal-50" : "hover:bg-slate-50"} transition-colors`}
                      data-testid={`leaderboard-row-${index}`}
                    >
                      <td className="px-4 py-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${rankStyle.bg} ${rankStyle.text}`}>
                          {rankStyle.icon || (index + 1)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{student.display_name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className={`font-medium ${isCurrentUser ? "text-teal-700" : "text-slate-900"}`}>
                              {student.display_name}
                              {isCurrentUser && <span className="ml-2 text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">You</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="level-badge">{student.level}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-slate-600">{student.badges?.length || 0}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-accent font-bold text-slate-900">{student.points}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
