import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useParentData() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch students linked to this parent
      const response = await apiClient.get("/users/my-students");
      
      // For each student, we want to fetch their stats too
      const studentsWithStats = await Promise.all(
        response.data.map(async (student) => {
          try {
            const statsRes = await apiClient.get(`/users/${student.id}/stats`);
            const data = statsRes.data;
            // Ensure badges is an array
            if (data.badges && typeof data.badges === 'string') {
              data.badges = data.badges.split(',').filter(Boolean);
            } else if (!Array.isArray(data.badges)) {
              data.badges = [];
            }
            return { ...student, ...data };
          } catch (e) {
            console.error(`Failed to fetch stats for student ${student.id}`, e);
            return { ...student, badges: [] };
          }
        })
      );

      setStudents(studentsWithStats);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch parent dashboard data:", err);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { students, loading, error, lastUpdated, refetch: fetchData };
}
