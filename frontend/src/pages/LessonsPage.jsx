// src/pages/LessonsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import StudentNav from "./StudentNav";
import { 
  BookOpen, Search, Filter, Clock, Star, ChevronRight, 
  Plus, Bookmark, TrendingUp, Users, Calendar, Hash
} from "lucide-react";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  
  // Mock categories - you should get these from your backend
  const categories = [
    { id: "all", name: "All Subjects", color: "bg-slate-100 text-slate-700" },
    { id: "math", name: "Math", color: "bg-blue-100 text-blue-700" },
    { id: "science", name: "Science", color: "bg-green-100 text-green-700" },
    { id: "history", name: "History", color: "bg-amber-100 text-amber-700" },
    { id: "language", name: "Language", color: "bg-purple-100 text-purple-700" },
    { id: "art", name: "Art", color: "bg-pink-100 text-pink-700" },
    { id: "technology", name: "Technology", color: "bg-cyan-100 text-cyan-700" },
  ];
  
  const difficulties = [
    { id: "all", name: "All Levels", color: "bg-slate-100" },
    { id: "beginner", name: "Beginner", color: "bg-green-100 text-green-700" },
    { id: "intermediate", name: "Intermediate", color: "bg-yellow-100 text-yellow-700" },
    { id: "advanced", name: "Advanced", color: "bg-red-100 text-red-700" },
  ];

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/lessons");
      // Transform backend data to match frontend expectations
      const transformedLessons = response.data.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.content_html?.substring(0, 100) + "...",
        subject_name: getCategoryName(lesson),
        difficulty: getRandomDifficulty(),
        estimated_time: Math.floor(Math.random() * 30) + 15,
        points: Math.floor(Math.random() * 100) + 50,
        grade_levels: ["Grade 6", "Grade 7"],
        content: lesson.content_html,
        category: getCategoryFromTitle(lesson.title),
        popularity: Math.floor(Math.random() * 100),
        created_at: lesson.created_at
      }));
      
      setLessons(transformedLessons);
      setFilteredLessons(transformedLessons);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      // Fallback to mock data if API fails
      setLessons(mockLessons);
      setFilteredLessons(mockLessons);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (lesson) => {
    const categories = ["Math", "Science", "History", "Language", "Art", "Technology"];
    return categories[lesson.id % categories.length] || "General";
  };

  const getRandomDifficulty = () => {
    const difficulties = ["beginner", "intermediate", "advanced"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getCategoryFromTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("math") || lowerTitle.includes("calculus") || lowerTitle.includes("algebra")) return "math";
    if (lowerTitle.includes("science") || lowerTitle.includes("physics") || lowerTitle.includes("chemistry")) return "science";
    if (lowerTitle.includes("history") || lowerTitle.includes("social")) return "history";
    if (lowerTitle.includes("language") || lowerTitle.includes("english") || lowerTitle.includes("spanish")) return "language";
    if (lowerTitle.includes("art") || lowerTitle.includes("drawing") || lowerTitle.includes("music")) return "art";
    if (lowerTitle.includes("tech") || lowerTitle.includes("computer") || lowerTitle.includes("programming")) return "technology";
    return "general";
  };

  const filterLessons = () => {
    let filtered = [...lessons];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(lesson =>
        lesson.category === selectedCategory || lesson.subject_name.toLowerCase() === selectedCategory
      );
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(lesson => lesson.difficulty === selectedDifficulty);
    }
    
    setFilteredLessons(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-amber-100 text-amber-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category) || categories[0];
    return cat.color;
  };

  // Mock data for fallback
  const mockLessons = [
    {
      id: 1,
      title: "Introduction to Fractions",
      description: "Learn the basics of fractions and how to work with them in everyday math.",
      subject_name: "Math",
      difficulty: "beginner",
      estimated_time: 25,
      points: 75,
      grade_levels: ["Grade 5", "Grade 6"],
      category: "math",
      popularity: 95
    },
    {
      id: 2,
      title: "Photosynthesis Process",
      description: "Discover how plants convert sunlight into energy through photosynthesis.",
      subject_name: "Science",
      difficulty: "intermediate",
      estimated_time: 30,
      points: 100,
      grade_levels: ["Grade 7", "Grade 8"],
      category: "science",
      popularity: 88
    },
    {
      id: 3,
      title: "Ancient Egyptian Civilization",
      description: "Explore the pyramids, pharaohs, and daily life in ancient Egypt.",
      subject_name: "History",
      difficulty: "beginner",
      estimated_time: 20,
      points: 60,
      grade_levels: ["Grade 6"],
      category: "history",
      popularity: 72
    },
    {
      id: 4,
      title: "Basic Spanish Vocabulary",
      description: "Essential Spanish words and phrases for beginners.",
      subject_name: "Language",
      difficulty: "beginner",
      estimated_time: 15,
      points: 50,
      grade_levels: ["Grade 4", "Grade 5", "Grade 6"],
      category: "language",
      popularity: 81
    },
    {
      id: 5,
      title: "Introduction to Coding",
      description: "Learn the basics of programming with fun, interactive examples.",
      subject_name: "Technology",
      difficulty: "intermediate",
      estimated_time: 35,
      points: 120,
      grade_levels: ["Grade 7", "Grade 8"],
      category: "technology",
      popularity: 92
    },
    {
      id: 6,
      title: "Color Theory Basics",
      description: "Understanding primary, secondary, and complementary colors.",
      subject_name: "Art",
      difficulty: "beginner",
      estimated_time: 18,
      points: 55,
      grade_levels: ["Grade 5", "Grade 6"],
      category: "art",
      popularity: 65
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="lessons-page">
      <StudentNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Explore Lessons</h1>
              <p className="text-slate-600">Discover interactive lessons tailored for Caribbean students</p>
            </div>
            <Link to="/lessons/create">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Search lessons by title or description..."
              className="pl-12 h-12 rounded-xl border-2 border-slate-200 focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Chips */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-slate-700">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-slate-500 mr-2">Subject:</span>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id ? category.color + ' ring-2 ring-offset-2 ring-opacity-50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-500 mr-2">Level:</span>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDifficulty === difficulty.id ? difficulty.color + ' ring-2 ring-offset-2 ring-opacity-50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="student-card p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-20 bg-slate-200 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredLessons.length}</span> of{" "}
                <span className="font-semibold text-slate-900">{lessons.length}</span> lessons
              </p>
            </div>
            
            {/* Lessons Grid */}
            {filteredLessons.length === 0 ? (
              <div className="student-card p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No lessons found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <Link 
                    key={lesson.id} 
                    to={`/lessons/${lesson.id}`}
                    className="student-card p-6 hover:shadow-xl transition-all duration-300 group"
                    data-testid={`lesson-card-${lesson.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCategoryColor(lesson.category)}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {lesson.subject_name}
                          </span>
                          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                            {lesson.title}
                          </h3>
                        </div>
                      </div>
                      <button 
                        className="text-slate-400 hover:text-amber-500 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle bookmark
                        }}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {lesson.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {lesson.estimated_time} min
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="w-3 h-3" />
                        {lesson.points} pts
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {lesson.grade_levels?.slice(0, 2).map((grade) => (
                          <span key={grade} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                            {grade}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-slate-500 group-hover:text-teal-600 transition-colors">
                        <span className="text-sm font-medium">Start Lesson</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                    
                    {/* Popularity indicator */}
                    {lesson.popularity > 80 && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-amber-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>Highly Popular</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Stats Section */}
            <div className="mt-12 student-card p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold font-accent text-slate-900">{lessons.length}</p>
                  <p className="text-sm text-slate-500">Total Lessons</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold font-accent text-slate-900">
                    {lessons.reduce((sum, lesson) => sum + lesson.estimated_time, 0)}
                  </p>
                  <p className="text-sm text-slate-500">Total Learning Hours</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold font-accent text-slate-900">
                    {lessons.reduce((sum, lesson) => sum + lesson.points, 0)}
                  </p>
                  <p className="text-sm text-slate-500">Total Points Available</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold font-accent text-slate-900">6</p>
                  <p className="text-sm text-slate-500">Subjects Covered</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}