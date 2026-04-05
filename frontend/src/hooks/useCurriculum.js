import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useCurriculum() {
  const [lessons, setLessons] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lessonsRes, gamesRes] = await Promise.all([
        apiClient.get("/lessons"),
        apiClient.get("/games")
      ]);
      setLessons(lessonsRes.data);
      setGames(gamesRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch curriculum:", err);
      setError("Failed to load curriculum data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { lessons, games, loading, error, refetch: fetchData };
}
