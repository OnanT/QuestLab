import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { HelpCircle, Clock, Star, ArrowLeft, Filter, CheckCircle } from "lucide-react";
import StudentNav from "./StudentNav";

export default function QuizzesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject_id: searchParams.get("subject") || "",
    difficulty: searchParams.get("difficulty") || "",
    grade_level: searchParams.get("grade") || "",
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [quizzesRes, subjectsRes] = await Promise.all([
        apiClient.get("/quizzes", { 
          params: { 
            subject_id: filters.subject_id || undefined,
            difficulty: filters.difficulty || undefined,
            grade_level: filters.grade_level || undefined,
          }
        }),
        apiClient.get("/subjects")
      ]);
      setQuizzes(quizzesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === "all" ? "" : value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.subject_id) params.set("subject", newFilters.subject_id);
    if (newFilters.difficulty) params.set("difficulty", newFilters.difficulty);
    if (newFilters.grade_level) params.set("grade", newFilters.grade_level);
    setSearchParams(params);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-amber-100 text-amber-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="quizzes-page">
      <StudentNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Quizzes</h1>
            <p className="text-slate-600">Test your knowledge and earn points</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <Select value={filters.subject_id || "all"} onValueChange={(v) => handleFilterChange("subject_id", v)}>
            <SelectTrigger className="w-[180px] rounded-xl" data-testid="quiz-subject-filter">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.difficulty || "all"} onValueChange={(v) => handleFilterChange("difficulty", v)}>
            <SelectTrigger className="w-[150px] rounded-xl" data-testid="quiz-difficulty-filter">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.grade_level || "all"} onValueChange={(v) => handleFilterChange("grade_level", v)}>
            <SelectTrigger className="w-[150px] rounded-xl" data-testid="quiz-grade-filter">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No quizzes found</h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quizzes/${quiz.id}`}
                className="student-card p-6 group"
                data-testid={`quiz-card-${quiz.id}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: subjects.find(s => s.id === quiz.subject_id)?.color + "20" || "#FF7F5020"
                    }}
                  >
                    <HelpCircle 
                      className="w-6 h-6"
                      style={{ color: subjects.find(s => s.id === quiz.subject_id)?.color || "#FF7F50" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      {quiz.subject_name}
                    </p>
                    <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate">
                      {quiz.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4" />
                    {quiz.questions?.length || 0} questions
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {formatTime(quiz.time_limit)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  <span className="points-badge text-xs">+{quiz.total_points} pts</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Pass score: {quiz.pass_score}%</span>
                    <span className="text-teal-600 font-medium group-hover:underline">Start Quiz →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
