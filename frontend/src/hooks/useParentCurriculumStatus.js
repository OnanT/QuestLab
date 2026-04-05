import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useParentCurriculumStatus() {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/progress/parent/curriculum-status");
      setStatus(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch curriculum status:", err);
      setError("Failed to load curriculum status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, loading, error, refetch: fetchData };
}
