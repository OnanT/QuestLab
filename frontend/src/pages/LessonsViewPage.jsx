// src/pages/LessonsViewPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { ArrowLeft, Clock, Star, BookOpen, ChevronRight, HelpCircle, Target, Award, Users } from "lucide-react";
import StudentNav from "./StudentNav";

export default function LessonViewPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [relatedQuizzes, setRelatedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const [lessonRes, quizzesRes] = await Promise.all([
        apiClient.get(`/lessons/${lessonId}`),
        apiClient.get("/quizzes")
      ]);
      
      const lessonData = lessonRes.data;
      
      // Transform backend lesson to frontend format
      const transformedLesson = {
        ...lessonData,
        subject_name: getCategoryFromLesson(lessonData),
        difficulty: getRandomDifficulty(),
        estimated_time: estimateReadingTime(lessonData.content_html),
        points: 75,
        grade_levels: ["Grade 6", "Grade 7"],
        content: lessonData.content_html || "<p>No content available.</p>"
      };
      
      setLesson(transformedLesson);
      
      // Find related quizzes
      const related = quizzesRes.data.filter(q => q.lesson_id === parseInt(lessonId));
      setRelatedQuizzes(related);
      
      // Fetch user progress for this lesson
      try {
        const progressRes = await apiClient.get(`/progress/user/${lessonId}`);
        if (progressRes.data && progressRes.data.length > 0) {
          setUserProgress(progressRes.data[0]);
        }
      } catch (progressError) {
        console.log("No progress record found for this lesson");
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromLesson = (lesson) => {
    const categories = ["Math", "Science", "History", "Language", "Art", "Technology"];
    return categories[lesson.id % categories.length] || "General";
  };

  const getRandomDifficulty = () => {
    const difficulties = ["beginner", "intermediate", "advanced"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const estimateReadingTime = (content) => {
    if (!content) return 15;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return Math.min(Math.max(minutes, 10), 60);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-amber-100 text-amber-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const markAsCompleted = async () => {
    try {
      const progressData = {
        lesson_id: parseInt(lessonId),
        score: 100,
        completed: true
      };
      
      await apiClient.post("/progress", progressData);
      
      // Update local state
      setUserProgress({
        ...progressData,
        completed_at: new Date().toISOString()
      });
      
      alert("Lesson marked as completed! Points awarded.");
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
      alert("Failed to mark lesson as completed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5]">
        <StudentNav />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#FFFDF5]">
        <StudentNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Lesson not found</h1>
          <Button onClick={() => navigate("/lessons")} className="bg-teal-600 hover:bg-teal-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="lesson-view-page">
      <StudentNav />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/lessons" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>
          
          <div className="student-card p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-teal-600 font-medium mb-1">{lesson.subject_name}</p>
                <h1 className="text-2xl font-bold font-heading text-slate-900">{lesson.title}</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(lesson.difficulty)}`}>
                {lesson.difficulty}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-4 h-4" />
                {lesson.estimated_time} minutes
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Star className="w-4 h-4" />
                +{lesson.points} points
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Users className="w-4 h-4" />
                Grades {lesson.grade_levels?.join(", ")}
              </span>
            </div>
            
            {userProgress?.completed && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Completed on {new Date(userProgress.completed_at).toLocaleDateString()}</span>
                  <span className="ml-auto font-bold">Score: {userProgress.score}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="student-card p-8 mb-8">
          <div className="mb-6 pb-6 border-b border-slate-200">
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">Lesson Overview</h2>
            <p className="text-slate-600">Read through the content below and complete the interactive elements.</p>
          </div>
          
          <div 
            className="lesson-content prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-700 prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
          
          {!userProgress?.completed && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button 
                onClick={markAsCompleted}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Mark as Completed
              </Button>
              <p className="text-sm text-slate-500 text-center mt-2">
                Completing this lesson will award you {lesson.points} points!
              </p>
            </div>
          )}
        </div>

        {/* Related Quizzes */}
        {relatedQuizzes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">Test Your Knowledge</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedQuizzes.map((quiz) => (
                <div key={quiz.id} className="student-card p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{quiz.question}</h4>
                      <p className="text-sm text-slate-500">Quiz Question</p>
                    </div>
                  </div>
                  <Link to={`/quizzes/${quiz.id}`}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Take Quiz
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Resources */}
        <div className="student-card p-6 mb-8 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">Continue Learning</h3>
          <div className="space-y-3">
            <Link to="/quizzes" className="flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                </div>
                <span className="font-medium text-slate-700">Explore More Quizzes</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link to="/games" className="flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium text-slate-700">Play Educational Games</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/lessons")} 
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Lessons
          </Button>
          
          <div className="flex gap-3">
            {!userProgress?.completed && (
              <Button 
                onClick={markAsCompleted}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Target className="w-4 h-4 mr-2" />
                Complete Lesson
              </Button>
            )}
            <Link to="/quizzes">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                Browse Quizzes
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}