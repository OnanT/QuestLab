import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useAdminData() {
  const [stats, setStats] = useState({ users: 0, lessons: 0, quizzes: 0, games: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, lessons, quizzes, games] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/lessons"),
        apiClient.get("/quizzes"),
        apiClient.get("/games/list")
      ]);
      setStats({
        users: users.data.length,
        lessons: lessons.data.length,
        quizzes: quizzes.data.length,
        games: games.data.length
      });
    } catch (err) {
      console.error("Admin stats fetch error:", err);
      setError("Failed to load administration data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
