import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useDashboardData(updateUser) {
  const [progress, setProgress] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // We use /users/stats/me for accurate statistics
      const [statsRes, subjectsRes, gamesRes] = await Promise.all([
        apiClient.get("/users/stats/me"),
        apiClient.get("/subjects/enhanced"),
        apiClient.get("/games/list?limit=4"),
      ]);

      setProgress({
        points:            statsRes.data.total_points || 0,
        level:             statsRes.data.level || 1,
        streak:            statsRes.data.streak || 0,
        quizzes_completed: statsRes.data.quizzes_completed || 0,
        games_played:      statsRes.data.games_played || 0,
        badges:            statsRes.data.badges || [],
      });

      setSubjects(subjectsRes.data);
      setRecentGames(gamesRes.data.slice(0, 4));

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      if (err.response?.status === 404 && err.config?.url?.includes("/subjects")) {
        setSubjects([
          { id: 1, name: "Math",    color: "#3B82F6" },
          { id: 2, name: "Science", color: "#10B981" },
        ]);
      } else {
        setError("Unable to load dashboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { progress, subjects, recentGames, loading, error, refetch: fetchData };
}
