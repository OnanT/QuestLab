import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";
import { toast } from "sonner";

export function useParentData() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch students linked to this parent - now includes stats from backend
      const response = await apiClient.get("/users/my-students");
      setStudents(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch parent dashboard data:", err);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const registerStudent = useCallback(async (studentData) => {
    try {
      const response = await apiClient.post("/users/register-student", studentData);
      toast.success(`Successfully registered ${studentData.username}!`);
      await fetchData(); // Refresh list after registration
      return response.data;
    } catch (err) {
      console.error("Failed to register student:", err);
      toast.error(err.response?.data?.detail || "Failed to register student");
      throw err;
    }
  }, [fetchData]);

  const removeStudent = useCallback(async (studentId) => {
    try {
      await apiClient.delete(`/users/student/${studentId}`);
      toast.success("Student account removed successfully");
      await fetchData(); // Refresh list after removal
      return true;
    } catch (err) {
      console.error("Failed to remove student:", err);
      toast.error(err.response?.data?.detail || "Failed to remove student");
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    students, 
    loading, 
    error, 
    lastUpdated, 
    refetch: fetchData, 
    registerStudent,
    removeStudent
  };
}
