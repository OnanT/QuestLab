import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useReports(studentId = null) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!studentId) {
        setReports([]);
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.get(`/progress/user/${studentId}`);
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}
