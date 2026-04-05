import { Home, BookOpen, HelpCircle, Gamepad2, Award, Trophy, Users, LayoutDashboard, UserCircle, Settings } from "lucide-react";

export const navConfig = {
  student: [
    { to: "/dashboard", icon: Home, label: "Home", testId: "nav-student-home" },
    { to: "/lessons", icon: BookOpen, label: "Lessons", testId: "nav-student-lessons" },
    { to: "/quizzes", icon: HelpCircle, label: "Quizzes", testId: "nav-student-quizzes" },
    { to: "/games", icon: Gamepad2, label: "Games", testId: "nav-student-games" },
    { to: "/achievements", icon: Award, label: "Awards", testId: "nav-student-achievements" },
  ],
  teacher: [
    { to: "/teacher", icon: LayoutDashboard, label: "Dashboard", testId: "nav-teacher-home" },
    { to: "/teacher/students", icon: Users, label: "My Class", testId: "nav-teacher-students" },
    { to: "/lessons", icon: BookOpen, label: "Lessons", testId: "nav-teacher-lessons" },
    { to: "/quizzes", icon: HelpCircle, label: "Quizzes", testId: "nav-teacher-quizzes" },
  ],
  parent: [
    { to: "/parent", icon: Home, label: "Dashboard", testId: "nav-parent-home" },
    { to: "/lessons", icon: BookOpen, label: "Curriculum", testId: "nav-parent-lessons" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard", testId: "nav-parent-leaderboard" },
  ],
  admin: [
    { to: "/admin", icon: LayoutDashboard, label: "Admin Panel", testId: "nav-admin-home" },
    { to: "/admin/lessons", icon: BookOpen, label: "Lessons", testId: "nav-admin-lessons" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard", testId: "nav-admin-leaderboard" },
  ],
};

export const getHomeRoute = (role) => {
  switch (role) {
    case "admin": return "/admin";
    case "teacher": return "/teacher";
    case "parent": return "/parent";
    default: return "/dashboard";
  }
};
