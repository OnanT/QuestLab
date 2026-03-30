import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Clock, Star, Trophy, ChevronRight, CheckCircle, XCircle, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import SkillBuilder from "../components/games/SkillBuilder";
import QuizBattle from "../components/games/QuizBattle";
import StoryQuest from "../components/games/StoryQuest";
import MapChallenge from "../components/games/MapChallenge";
import MemoryMatch from "../components/games/MemoryMatch";
import SentenceBuilder from "../components/games/SentenceBuilder";
import BucketSort from "../components/games/BucketSort";
import FillInBlanks from "../components/games/FillInBlanks";
import DragAndDrop from "../components/games/DragAndDrop";
import InteractiveSimulation from "../components/games/InteractiveSimulation";
import TypingGame from "../components/games/TypingGame/TypingGame";

// Fix for Leaflet default marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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
    const gType = game.game_type?.toLowerCase();
    if (gType === "quiz_battle" || gType === "skill_builder") {
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
      const gameData = res.data;
      // Normalize config property
      if (gameData.config_json && !gameData.config) {
        gameData.config = gameData.config_json;
      }
      setGame(gameData);
      console.log("Loaded Game Data:", gameData);
      initializeGame(gameData);
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
    
    const gameType = gameData.game_type?.toLowerCase();
    
    if (gameType === "quiz_battle") {
      setTimeLeft(gameData.config.time_limit || 60);
    } else if (gameType === "skill_builder") {
      setTimeLeft((gameData.config.time_per_problem || 15) * (gameData.config.total_problems || 8));
    } else if (gameType === "story_quest") {
      setStoryPath(["start"]);
    } else if (gameType === "map_challenge") {
      setTimeLeft(gameData.config.time_limit || 120);
    } else if (gameType === "memorymatch") {
      setTimeLeft(gameData.config.time_limit || 120);
    } else if (gameType === "sentencebuilder") {
      setTimeLeft(gameData.config.time_limit || 120);
    } else if (gameType === "bucketsort") {
      setTimeLeft(gameData.config.time_limit || 120);
    } else if (gameType === "fill in the blanks") {
      setTimeLeft(gameData.config.time_limit || 180);
    } else if (gameType === "drag and drop") {
      setTimeLeft(gameData.config.time_limit || 180);
    } else if (gameType === "typing") {
      setTimeLeft(gameData.config.timeLimit || 60);
    }
    
    setGameState("playing");
  };

  const handleGameEnd = async (stats = null) => {
    setGameState("finished");
    
    // Typing game handles its own submission to award shells and calculate complex stats
    if (stats && game.game_type?.toLowerCase() === "typing") {
        // TypingGame component already called the API, we just update local results for UI
        setResults({
            score: stats.score,
            points_earned: stats.shells_awarded || 0,
            time_taken: Math.floor((Date.now() - startTime) / 1000)
        });
        return;
    }

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
  
  const processMapGuess = (coords) => {
    if (gameState !== "playing") return;
    
    const location = game.config.locations[currentIndex];
    const tolerance = game.config.tolerance || 10;
    const isLeaflet = game.config.map_type === "leaflet";
    
    let isCorrect = false;
    if (isLeaflet) {
      // coords is {lat, lng}
      const distance = L.latLng(coords.lat, coords.lng).distanceTo(L.latLng(location.lat, location.lng));
      // tolerance in km, distance in meters
      isCorrect = distance <= (tolerance * 1000);
      console.log(`Leaflet Distance: ${distance.toFixed(0)}m, Tolerance: ${tolerance * 1000}m`);
    } else {
      // coords is {x, y}
      const distance = Math.sqrt(Math.pow(coords.x - location.x, 2) + Math.pow(coords.y - location.y, 2));
      isCorrect = distance <= tolerance;
      console.log(`Image Distance: ${distance.toFixed(2)}, Tolerance: ${tolerance}`);
    }
    
    if (isCorrect) {
      setScore((prev) => prev + (game.config.points_per_location || 10));
      setFeedback({ type: "correct", message: `Found ${location.name}!` });
      setMapGuesses((prev) => [...prev, { ...location, found: true }]);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < game.config.locations.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          handleGameEnd();
        }
      }, 1500);
    } else {
      setFeedback({ type: "incorrect", message: `Try again! Hint: ${location.hint}` });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleMapClick = (e) => {
    if (gameState !== "playing") return;
    
    // Check if it's a Leaflet event
    if (e.latlng) {
      processMapGuess({ lat: e.latlng.lat, lng: e.latlng.lng });
    } else {
      // Standard click event for Image mode
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      processMapGuess({ x, y });
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
  const gameType = game.game_type?.toLowerCase();

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
            {(gameType === "quiz_battle" || gameType === "skill_builder" || gameType === "map_challenge") && (
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
        {gameType === "skill_builder" && (
          <SkillBuilder 
            config={game.config}
            currentIndex={currentIndex}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            onAnswer={handleSkillBuilderAnswer}
            progress={((currentIndex + 1) / (game.config.problems?.length || 1)) * 100}
          />
        )}

        {/* QUIZ BATTLE */}
        {gameType === "quiz_battle" && (
          <QuizBattle 
            config={game.config}
            currentIndex={currentIndex}
            onAnswer={handleQuizBattleAnswer}
            progress={((currentIndex + 1) / (game.config.questions?.length || 1)) * 100}
          />
        )}

        {/* STORY QUEST */}
        {gameType === "story_quest" && (
          <StoryQuest 
            config={game.config}
            currentIndex={currentIndex}
            onChoice={handleStoryChoice}
            score={score}
            bonusPoints={bonusPoints}
          />
        )}

        {/* MAP CHALLENGE */}
        {gameType === "map_challenge" && (
          <MapChallenge 
            config={game.config}
            currentIndex={currentIndex}
            gameState={gameState}
            mapGuesses={mapGuesses}
            onMapClick={handleMapClick}
            progress={((currentIndex + 1) / (game.config.locations?.length || 1)) * 100}
          />
        )}

        {/* MEMORY MATCH */}
        {(gameType === "memorymatch" || gameType === "memory match") && (
          <MemoryMatch 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* SENTENCE BUILDER */}
        {gameType === "sentencebuilder" && (
          <SentenceBuilder 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* BUCKET SORT */}
        {gameType === "bucketsort" && (
          <BucketSort 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* FILL IN THE BLANKS */}
        {gameType === "fill in the blanks" && (
          <FillInBlanks 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* DRAG AND DROP */}
        {gameType === "drag and drop" && (
          <DragAndDrop 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* INTERACTIVE SIMULATION */}
        {(gameType === "interactive simulation" || gameType === "interactive_simulation") && (
          <InteractiveSimulation 
            config={game.config}
            onScoreUpdate={(points) => setScore(prev => prev + points)}
            onComplete={handleGameEnd}
          />
        )}

        {/* TYPING GAME */}
        {gameType === "typing" && (
          <TypingGame 
            config={game.config}
            gameId={gameId}
            onComplete={handleGameEnd}
          />
        )}
      </div>
    </div>
  );
}
