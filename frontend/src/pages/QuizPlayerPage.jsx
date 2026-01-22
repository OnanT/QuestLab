import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiClient, useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Star, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function QuizPlayerPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizState, setQuizState] = useState("loading"); // loading, playing, submitting, results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizState !== "playing" || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const res = await apiClient.get(`/quizzes/${quizId}`);
      setQuiz(res.data);
      setTimeLeft(res.data.time_limit);
      setQuizState("playing");
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (quizState !== "playing") return;
    
    setQuizState("submitting");
    try {
      const res = await apiClient.post(`/quizzes/${quizId}/submit`, {
        quiz_id: quizId,
        answers: answers
      });
      setResults(res.data);
      setQuizState("results");
      
      // Update user points in context
      if (res.data.points_earned > 0) {
        toast.success(`+${res.data.points_earned} points earned!`);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz");
      setQuizState("playing");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Quiz not found</h1>
          <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === "results" && results) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] py-8 px-4" data-testid="quiz-results">
        <div className="max-w-2xl mx-auto">
          <div className={`student-card p-8 text-center mb-8 ${results.passed ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${results.passed ? "bg-green-100" : "bg-orange-100"}`}>
              {results.passed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <Star className="w-10 h-10 text-orange-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">
              {results.passed ? "Congratulations!" : "Good Effort!"}
            </h1>
            <p className="text-slate-600 mb-6">
              {results.passed ? "You passed the quiz!" : "Keep practicing to improve!"}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-3xl font-bold font-accent text-teal-600">{results.score}%</p>
                <p className="text-sm text-slate-500">Score</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-3xl font-bold font-accent text-slate-900">{results.correct}/{results.total}</p>
                <p className="text-sm text-slate-500">Correct</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-3xl font-bold font-accent text-amber-600">+{results.points_earned}</p>
                <p className="text-sm text-slate-500">Points</p>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold font-heading text-slate-900">Question Review</h2>
            {results.results.map((result, index) => {
              const question = quiz.questions[index];
              return (
                <div 
                  key={result.question_id}
                  className={`student-card p-4 border-l-4 ${result.is_correct ? "border-green-500" : "border-red-500"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${result.is_correct ? "bg-green-100" : "bg-red-100"}`}>
                      {result.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">{question.question_text}</p>
                      <p className="text-sm">
                        <span className="text-slate-500">Your answer: </span>
                        <span className={result.is_correct ? "text-green-600" : "text-red-600"}>
                          {result.user_answer || "(No answer)"}
                        </span>
                      </p>
                      {!result.is_correct && (
                        <p className="text-sm">
                          <span className="text-slate-500">Correct answer: </span>
                          <span className="text-green-600">{result.correct_answer}</span>
                        </p>
                      )}
                      {result.explanation && (
                        <p className="text-sm text-slate-500 mt-2 italic">{result.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/quizzes")} className="flex-1 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Quizzes
            </Button>
            <Button 
              onClick={() => {
                setAnswers({});
                setCurrentQuestion(0);
                setTimeLeft(quiz.time_limit);
                setResults(null);
                setQuizState("playing");
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              data-testid="retry-quiz-btn"
            >
              Try Again
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-[#FFFDF5] py-8 px-4" data-testid="quiz-player">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/quizzes")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="font-bold font-heading text-slate-900 truncate px-4">{quiz.title}</h1>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-accent font-semibold ${timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-teal-100 text-teal-600"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <div className="student-card p-8 mb-8">
          <div className="mb-6">
            <span className="text-xs text-teal-600 uppercase tracking-wide font-medium">
              {question.question_type.replace("_", " ")}
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-900 mt-2">
              {question.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full quiz-option text-left ${answers[question.id] === option ? "selected" : ""}`}
                data-testid={`quiz-option-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${answers[question.id] === option ? "border-teal-500 bg-teal-500 text-white" : "border-slate-300 text-slate-500"}`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-slate-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex-1 rounded-xl"
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={quizState === "submitting"}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              data-testid="submit-quiz-btn"
            >
              {quizState === "submitting" ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              data-testid="next-question-btn"
            >
              Next Question
            </Button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentQuestion 
                  ? "bg-teal-500" 
                  : answers[q.id] 
                    ? "bg-teal-200" 
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
