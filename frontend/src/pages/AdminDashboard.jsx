import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useAdminData } from "../hooks/useAdminData";

// Import modular components from the correct subdirectory
import AdminSidebar from "./admin/AdminSidebar";
import AdminOverview from "./admin/AdminOverview";
import AdminLessons from "./admin/AdminLessons";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const adminData = useAdminData();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]" data-testid="admin-dashboard">
      <AdminSidebar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden pb-24 lg:pb-12">
        <Routes>
          <Route index element={<AdminOverview {...adminData} />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="quizzes" element={<PlaceholderSection title="Assessments Management" />} />
          <Route path="games" element={<PlaceholderSection title="Learning Games" />} />
          <Route path="users" element={<PlaceholderSection title="User Directory" />} />
          <Route path="assignments" element={<PlaceholderSection title="Student Assignments" />} />
          <Route path="schools" element={<PlaceholderSection title="Schools & Institutions" />} />
          <Route path="subjects" element={<PlaceholderSection title="Curriculum Subjects" />} />
        </Routes>
      </main>
    </div>
  );
}

function PlaceholderSection({ title }) {
  return (
    <div className="animate-fadeInUp p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
      <h2 className="text-2xl font-black font-heading text-slate-400">{title}</h2>
      <p className="text-slate-400 mt-2 font-medium">This module is currently being modernized.</p>
    </div>
  );
}
