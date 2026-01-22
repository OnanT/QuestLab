import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Gamepad2, Target, Flame, BookOpen, Map, ArrowLeft, Filter, Star } from "lucide-react";
import StudentNav from "./StudentNav";

export default function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game_type: searchParams.get("type") || "",
    subject_id: searchParams.get("subject") || "",
    difficulty: searchParams.get("difficulty") || "",
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [gamesRes, subjectsRes] = await Promise.all([
        apiClient.get("/games", { 
          params: { 
            game_type: filters.game_type || undefined,
            subject_id: filters.subject_id || undefined,
            difficulty: filters.difficulty || undefined,
          }
        }),
        apiClient.get("/subjects")
      ]);
      setGames(gamesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === "all" ? "" : value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.game_type) params.set("type", newFilters.game_type);
    if (newFilters.subject_id) params.set("subject", newFilters.subject_id);
    if (newFilters.difficulty) params.set("difficulty", newFilters.difficulty);
    setSearchParams(params);
  };

  const getGameTypeIcon = (type) => {
    switch (type) {
      case "skill_builder": return <Target className="w-6 h-6" />;
      case "quiz_battle": return <Flame className="w-6 h-6" />;
      case "story_quest": return <BookOpen className="w-6 h-6" />;
      case "map_challenge": return <Map className="w-6 h-6" />;
      default: return <Gamepad2 className="w-6 h-6" />;
    }
  };

  const getGameTypeColor = (type) => {
    switch (type) {
      case "skill_builder": return { bg: "from-blue-400 to-blue-600", light: "bg-blue-100", text: "text-blue-600" };
      case "quiz_battle": return { bg: "from-red-400 to-red-600", light: "bg-red-100", text: "text-red-600" };
      case "story_quest": return { bg: "from-purple-400 to-purple-600", light: "bg-purple-100", text: "text-purple-600" };
      case "map_challenge": return { bg: "from-green-400 to-green-600", light: "bg-green-100", text: "text-green-600" };
      default: return { bg: "from-teal-400 to-teal-600", light: "bg-teal-100", text: "text-teal-600" };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-amber-100 text-amber-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const gameTypes = [
    { value: "skill_builder", label: "Skill Builder" },
    { value: "quiz_battle", label: "Quiz Battle" },
    { value: "story_quest", label: "Story Quest" },
    { value: "map_challenge", label: "Map Challenge" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5]" data-testid="games-page">
      <StudentNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Games</h1>
            <p className="text-slate-600">Learn through play and earn rewards</p>
          </div>
        </div>

        {/* Game Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {gameTypes.map((type) => {
            const colors = getGameTypeColor(type.value);
            const isActive = filters.game_type === type.value;
            return (
              <button
                key={type.value}
                onClick={() => handleFilterChange("game_type", isActive ? "all" : type.value)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isActive 
                    ? `border-transparent bg-gradient-to-br ${colors.bg} text-white shadow-lg` 
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                data-testid={`game-type-filter-${type.value}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isActive ? "bg-white/20" : colors.light}`}>
                  <span className={isActive ? "text-white" : colors.text}>
                    {getGameTypeIcon(type.value)}
                  </span>
                </div>
                <p className={`font-bold ${isActive ? "text-white" : "text-slate-900"}`}>{type.label}</p>
              </button>
            );
          })}
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">More Filters:</span>
          </div>
          
          <Select value={filters.subject_id || "all"} onValueChange={(v) => handleFilterChange("subject_id", v)}>
            <SelectTrigger className="w-[180px] rounded-xl" data-testid="game-subject-filter">
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
            <SelectTrigger className="w-[150px] rounded-xl" data-testid="game-difficulty-filter">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No games found</h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const colors = getGameTypeColor(game.game_type);
              return (
                <Link
                  key={game.id}
                  to={`/games/${game.id}`}
                  className="game-card p-6 group hover:shadow-xl transition-shadow"
                  data-testid={`game-card-${game.id}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className="text-white">{getGameTypeIcon(game.game_type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                        {game.game_type.replace("_", " ")}
                      </p>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                        {game.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{game.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">{game.subject_name}</span>
                    </div>
                    <span className="points-badge text-xs flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {game.points} pts
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
