import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Clock, Star, Trophy, ChevronRight, CheckCircle, XCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function GamePlayerPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState("loading"); // loading, playing, finished
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [storyPath, setStoryPath] = useState([]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (gameState !== "playing" || !game) return;
    
    // Timer for timed games
    if (game.game_type === "quiz_battle" || game.game_type === "skill_builder") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, game]);

  const fetchGame = async () => {
    try {
      const res = await apiClient.get(`/games/${gameId}`);
      setGame(res.data);
      initializeGame(res.data);
    } catch (error) {
      console.error("Failed to fetch game:", error);
      toast.error("Failed to load game");
    }
  };

  const initializeGame = (gameData) => {
    setStartTime(Date.now());
    setScore(0);
    setCurrentIndex(0);
    setBonusPoints(0);
    setFeedback(null);
    setUserAnswer("");
    
    if (gameData.game_type === "quiz_battle") {
      setTimeLeft(gameData.config.time_limit || 60);
    } else if (gameData.game_type === "skill_builder") {
      setTimeLeft((gameData.config.time_per_problem || 15) * (gameData.config.total_problems || 8));
    } else if (gameData.game_type === "story_quest") {
      setStoryPath(["start"]);
    } else if (gameData.game_type === "map_challenge") {
      setTimeLeft(gameData.config.time_limit || 120);
    }
    
    setGameState("playing");
  };

  const handleGameEnd = async () => {
    setGameState("finished");
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = score + bonusPoints;
    
    try {
      const res = await apiClient.post(`/games/${gameId}/submit`, {
        game_id: gameId,
        score: finalScore,
        time_taken: timeTaken,
        data: { bonus_points: bonusPoints }
      });
      setResults({
        ...res.data,
        score: finalScore,
        time_taken: timeTaken
      });
      toast.success(`+${res.data.points_earned} points earned!`);
    } catch (error) {
      console.error("Failed to submit game:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Skill Builder Logic
  const handleSkillBuilderAnswer = () => {
    const problem = game.config.problems[currentIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === problem.answer.toLowerCase();
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback({ type: "correct", message: "Correct!" });
    } else {
      setFeedback({ type: "incorrect", message: `Wrong! The answer was ${problem.answer}` });
    }
    
    setTimeout(() => {
      setFeedback(null);
      setUserAnswer("");
      if (currentIndex < game.config.problems.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleGameEnd();
      }
    }, 1500);
  };

  // Quiz Battle Logic
  const handleQuizBattleAnswer = (answer) => {
    const question = game.config.questions[currentIndex];
    const isCorrect = answer === question.answer;
    
    if (isCorrect) {
      setScore((prev) => prev + (game.config.points_per_question || 10));
      setFeedback({ type: "correct", message: "Correct! +10 points" });
    } else {
      setFeedback({ type: "incorrect", message: `Wrong! Correct answer: ${question.answer}` });
    }
    
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < game.config.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleGameEnd();
      }
    }, 1500);
  };

  // Story Quest Logic
  const handleStoryChoice = (choice) => {
    setBonusPoints((prev) => prev + (choice.bonus_points || 0));
    
    if (choice.next) {
      setStoryPath((prev) => [...prev, choice.next]);
      setCurrentIndex(game.config.scenes.findIndex(s => s.id === choice.next));
    }
    
    const nextScene = game.config.scenes.find(s => s.id === choice.next);
    if (nextScene?.ending) {
      setScore(nextScene.final_points || 0);
      setTimeout(handleGameEnd, 2000);
    }
  };

  // Map Challenge Logic
  const [mapGuesses, setMapGuesses] = useState([]);
  const handleMapClick = (e) => {
    if (gameState !== "playing") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const location = game.config.locations[currentIndex];
    const tolerance = game.config.tolerance || 10;
    const distance = Math.sqrt(Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2));
    const isCorrect = distance <= tolerance;
    
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback({ type: "correct", message: `Found ${location.name}!` });
      setMapGuesses((prev) => [...prev, { ...location, found: true }]);
    } else {
      setFeedback({ type: "incorrect", message: `Try again! Hint: ${location.hint}` });
    }
    
    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < game.config.locations.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          handleGameEnd();
        }
      }, 1500);
    } else {
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  if (gameState === "loading" || !game) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  // Results Screen
  if (gameState === "finished" && results) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] py-8 px-4" data-testid="game-results">
        <div className="max-w-md mx-auto">
          <div className="student-card p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>
            
            <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Game Complete!</h1>
            <p className="text-slate-600 mb-6">{game.title}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-3xl font-bold font-accent text-teal-600">{results.score}</p>
                <p className="text-sm text-slate-500">Score</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <p className="text-3xl font-bold font-accent text-amber-600">+{results.points_earned}</p>
                <p className="text-sm text-slate-500">Points Earned</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate("/games")} className="flex-1 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Games
              </Button>
              <Button 
                onClick={() => initializeGame(game)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                data-testid="play-again-btn"
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game based on type
  return (
    <div className="min-h-screen bg-[#FFFDF5] py-8 px-4" data-testid="game-player">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate("/games")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-center">
            <h1 className="font-bold font-heading text-slate-900">{game.title}</h1>
            <p className="text-sm text-slate-500 capitalize">{game.game_type.replace("_", " ")}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="font-accent font-semibold text-amber-700">{score}</span>
            </div>
            {(game.game_type === "quiz_battle" || game.game_type === "skill_builder" || game.game_type === "map_challenge") && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${timeLeft < 30 ? "bg-red-100 text-red-600" : "bg-teal-100 text-teal-600"}`}>
                <Clock className="w-4 h-4" />
                <span className="font-accent font-semibold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Toast */}
        {feedback && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${feedback.type === "correct" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {feedback.type === "correct" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* SKILL BUILDER */}
        {game.game_type === "skill_builder" && (
          <div className="student-card p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Problem {currentIndex + 1} of {game.config.problems?.length || 0}</span>
              </div>
              <Progress value={((currentIndex + 1) / (game.config.problems?.length || 1)) * 100} className="h-2" />
            </div>
            
            <div className="text-center mb-8">
              <p className="text-4xl font-bold font-heading text-slate-900 mb-2">
                {game.config.problems?.[currentIndex]?.question}
              </p>
              {game.config.problems?.[currentIndex]?.hint && (
                <p className="text-sm text-slate-500">Hint: {game.config.problems[currentIndex].hint}</p>
              )}
            </div>
            
            <div className="flex gap-4">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSkillBuilderAnswer()}
                placeholder="Your answer"
                className="skill-builder-input flex-1"
                autoFocus
                data-testid="skill-builder-input"
              />
              <Button onClick={handleSkillBuilderAnswer} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8" data-testid="submit-answer-btn">
                Check
              </Button>
            </div>
          </div>
        )}

        {/* QUIZ BATTLE */}
        {game.game_type === "quiz_battle" && (
          <div className="student-card p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Question {currentIndex + 1} of {game.config.questions?.length || 0}</span>
              </div>
              <Progress value={((currentIndex + 1) / (game.config.questions?.length || 1)) * 100} className="h-2" />
            </div>
            
            <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 text-center">
              {game.config.questions?.[currentIndex]?.question}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {game.config.questions?.[currentIndex]?.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizBattleAnswer(option)}
                  className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all font-medium text-slate-700"
                  data-testid={`quiz-battle-option-${i}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STORY QUEST */}
        {game.game_type === "story_quest" && (
          <div className="student-card p-8">
            {(() => {
              const scene = game.config.scenes?.[currentIndex];
              if (!scene) return <p>Loading scene...</p>;
              
              return (
                <>
                  <div className="prose prose-slate max-w-none mb-8">
                    <p className="text-lg text-slate-700 leading-relaxed">{scene.text}</p>
                  </div>
                  
                  {scene.ending ? (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                      <p className="text-2xl font-bold font-heading text-slate-900">The End</p>
                      <p className="text-slate-600 mt-2">Final Score: {score + bonusPoints}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scene.choices?.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => handleStoryChoice(choice)}
                          className="w-full p-4 bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:from-purple-100 transition-all text-left flex items-center gap-4"
                          data-testid={`story-choice-${i}`}
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ChevronRight className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="text-slate-700">{choice.text}</span>
                          {choice.bonus_points > 0 && (
                            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                              +{choice.bonus_points} bonus
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* MAP CHALLENGE */}
        {game.game_type === "map_challenge" && (
          <div className="student-card p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Find: <strong className="text-teal-600">{game.config.locations?.[currentIndex]?.name}</strong></span>
                <span>{currentIndex + 1} of {game.config.locations?.length || 0}</span>
              </div>
              <Progress value={((currentIndex + 1) / (game.config.locations?.length || 1)) * 100} className="h-2" />
            </div>
            
            <div 
              className="relative bg-gradient-to-br from-blue-200 to-teal-200 rounded-2xl aspect-video cursor-crosshair overflow-hidden"
              onClick={handleMapClick}
              data-testid="map-challenge-area"
            >
              {/* Caribbean Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-blue-400/50">
                <p className="text-lg font-medium">Click to locate: {game.config.locations?.[currentIndex]?.name}</p>
              </div>
              
              {/* Found locations */}
              {mapGuesses.map((loc, i) => (
                <div 
                  key={i}
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <MapPin className="w-6 h-6 text-green-500 drop-shadow-lg" />
                </div>
              ))}
            </div>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              Hint: {game.config.locations?.[currentIndex]?.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
