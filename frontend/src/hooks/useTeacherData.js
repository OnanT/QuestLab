import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useTeacherData() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ lessons: 0, quizzes: 0, games: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, lessonsRes, quizzesRes, gamesRes] = await Promise.all([
        apiClient.get("/users/my-students"),
        apiClient.get("/lessons"),
        apiClient.get("/quizzes"),
        apiClient.get("/games/list") // Use standardized games list
      ]);

      // For teacher dashboard, we also want deeper stats for top students
      const studentsWithStats = await Promise.all(
        studentsRes.data.map(async (student) => {
          try {
            const sRes = await apiClient.get(`/users/${student.id}/stats`);
            return { ...student, ...sRes.data };
          } catch (e) {
            return student;
          }
        })
      );

      setStudents(studentsWithStats);
      setStats({
        lessons: lessonsRes.data.length,
        quizzes: quizzesRes.data.length,
        games: gamesRes.data.length
      });
    } catch (err) {
      console.error("Teacher dashboard fetch error:", err);
      setError("Failed to load teacher data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { students, stats, loading, error, refetch: fetchData };
}
