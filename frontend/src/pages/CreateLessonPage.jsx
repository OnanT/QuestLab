// src/pages/CreateLessonPage.jsx - Ultimate Edition
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, apiClient } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../components/ui/select";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "../components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "../components/ui/tabs";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, Save, Plus, Trash2, Edit, Copy, Share2, 
  Download, Upload, Eye, Clock, Star, Zap, 
  HelpCircle, BookOpen, Filter, Grid, List, 
  Smartphone, Tablet, Monitor, Check, X,
  Volume2, Camera, Image, FileText, 
  Users, Brain, Trophy, Timer,
  ChevronRight, ChevronLeft, 
  Info, ExternalLink, Maximize2,
  Menu, Hash, Type, CheckSquare,
  MessageSquare, Link, HashIcon
} from "lucide-react";
import StudentNav from "./StudentNav";

// ==================== CONSTANTS & DATA ====================
const QUESTION_TYPES = [
  { id: 'mc_single', name: 'Multiple Choice (Single)', icon: Check, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'mc_multiple', name: 'Multiple Choice (Multiple)', icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'true_false', name: 'True/False', icon: Type, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'short_answer', name: 'Short Answer', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'matching', name: 'Matching', icon: Link, color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 'ordering', name: 'Ordering', icon: List, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { id: 'fill_blank', name: 'Fill in Blank', icon: HashIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-700', points: 10 },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-100 text-yellow-700', points: 20 },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-100 text-red-700', points: 30 },
  { id: 'expert', name: 'Expert', color: 'bg-purple-100 text-purple-700', points: 50 },
];

const CATEGORIES = [
  'Mathematics', 'Science', 'History', 'Language Arts', 
  'Geography', 'Computer Science', 'Art & Music', 'Physical Education',
  'Life Skills', 'Career Education', 'World Languages', 'Special Education'
];

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 
  'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
  'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College'
];

const QUIZ_MODES = [
  { id: 'standard', name: 'Standard Quiz', icon: BookOpen, description: 'Traditional question-by-question' },
  { id: 'flashcard', name: 'Flashcard Mode', icon: Copy, description: 'Study with spaced repetition' },
  { id: 'timed', name: 'Timed Challenge', icon: Timer, description: 'Beat the clock for bonus points' },
  { id: 'adaptive', name: 'Adaptive Quiz', icon: Brain, description: 'Questions adjust to student level' },
  { id: 'gamified', name: 'Gamified Quiz', icon: Trophy, description: 'Power-ups, streaks, and leaderboards' },
  { id: 'collaborative', name: 'Collaborative', icon: Users, description: 'Students work together' },
];

// ==================== MAIN COMPONENT ====================
export default function CreateLessonPage() {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditing = !!lessonId;

  // Main state
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    category: 'Mathematics',
    difficulty: 'beginner',
    estimatedTime: 30,
    points: 100,
    gradeLevels: ['Grade 6'],
    description: '',
    objectives: '',
    prerequisites: '',
    tags: []
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mc_single',
    text: '',
    options: [{ id: 'A', text: '', isCorrect: false }],
    correctAnswer: '',
    explanation: '',
    points: 10,
    difficulty: 'beginner',
    timeLimit: 0,
    imageUrl: '',
    audioUrl: '',
    tags: []
  });

  const [activeTab, setActiveTab] = useState('basics');
  const [quizMode, setQuizMode] = useState('standard');
  const [creationMode, setCreationMode] = useState('simple'); // simple, advanced, bulk
  const [bulkInput, setBulkInput] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load draft from localStorage
    const draft = localStorage.getItem('lessonDraft');
    if (draft && !isEditing) {
      const { lesson: draftLesson, questions: draftQuestions } = JSON.parse(draft);
      setLesson(draftLesson);
      setQuestions(draftQuestions);
      setDraftSaved(true);
    }

    if (isEditing) {
      fetchLesson();
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [isEditing, lessonId]);

  useEffect(() => {
    // Auto-save draft
    const saveDraft = () => {
      if (lesson.title || questions.length > 0) {
        localStorage.setItem('lessonDraft', JSON.stringify({ lesson, questions }));
        setDraftSaved(true);
      }
    };
    
    const timeoutId = setTimeout(saveDraft, 2000);
    return () => clearTimeout(timeoutId);
  }, [lesson, questions]);

  // ==================== API FUNCTIONS ====================
  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/lessons/enhanced/${lessonId}`);
      const lessonData = response.data;
      
      setLesson({
        title: lessonData.title,
        content: lessonData.content_html,
        category: lessonData.category || 'Mathematics',
        difficulty: lessonData.difficulty || 'beginner',
        estimatedTime: lessonData.estimated_time || 30,
        points: lessonData.points || 100,
        gradeLevels: lessonData.grade_levels || ['Grade 6'],
        description: lessonData.description || '',
        objectives: lessonData.objectives || '',
        prerequisites: lessonData.prerequisites || '',
        tags: lessonData.tags || []
      });

      // Fetch questions
      const quizzesRes = await apiClient.get(`/quizzes?lesson_id=${lessonId}`);
      const transformedQuestions = quizzesRes.data.map(q => ({
        id: q.id,
        type: q.question_type || 'mc_single',
        text: q.question,
        options: q.options.map((opt, idx) => ({ 
          id: String.fromCharCode(65 + idx), 
          text: opt, 
          isCorrect: q.correct_answer === String.fromCharCode(65 + idx) 
        })),
        correctAnswer: q.correct_answer,
        explanation: q.explanation || '',
        points: q.points || 10,
        difficulty: q.difficulty || 'beginner',
        timeLimit: q.time_limit || 0,
        imageUrl: q.image_url || '',
        audioUrl: q.audio_url || '',
        tags: q.tags || []
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      toast.error('Failed to load lesson');
      navigate('/lessons');
    } finally {
      setLoading(false);
    }
  };

  const saveLesson = async () => {
    if (!lesson.title.trim()) {
      toast.error('Please enter a lesson title');
      return;
    }

    setSaving(true);
    try {
      // Prepare lesson data
      const lessonData = {
        title: lesson.title,
        content_html: lesson.content,
        category: lesson.category,
        difficulty: lesson.difficulty,
        estimated_time: parseInt(lesson.estimatedTime),
        points: parseInt(lesson.points),
        grade_levels: lesson.gradeLevels,
        description: lesson.description,
        objectives: lesson.objectives,
        prerequisites: lesson.prerequisites,
        tags: lesson.tags
      };

      let savedLessonId = lessonId;

      if (isEditing) {
        await apiClient.put(`/lessons/${lessonId}`, lessonData);
      } else {
        const response = await apiClient.post('/lessons', lessonData);
        savedLessonId = response.data.id;
        // Clear draft after successful save
        localStorage.removeItem('lessonDraft');
        setDraftSaved(false);
      }

      // Save questions
      if (questions.length > 0) {
        for (const q of questions) {
          const quizData = {
            lesson_id: savedLessonId,
            question: q.text,
            question_type: q.type,
            options: q.options.map(opt => opt.text),
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points,
            difficulty: q.difficulty,
            time_limit: q.timeLimit,
            image_url: q.imageUrl,
            audio_url: q.audioUrl,
            tags: q.tags
          };
          
          if (q.id) {
            await apiClient.put(`/quizzes/${q.id}`, quizData);
          } else {
            await apiClient.post('/quizzes', quizData);
          }
        }
      }

      toast.success(isEditing ? 'Lesson updated!' : 'Lesson created!');
      navigate('/lessons');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(`Save failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ==================== QUESTION HANDLERS ====================
  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast.error('Please enter question text');
      return;
    }

    const newQuestion = { ...currentQuestion, id: Date.now() };
    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      type: 'mc_single',
      text: '',
      options: [{ id: 'A', text: '', isCorrect: false }],
      correctAnswer: '',
      explanation: '',
      points: 10,
      difficulty: 'beginner',
      timeLimit: 0,
      imageUrl: '',
      audioUrl: '',
      tags: []
    });
    
    toast.success('Question added!');
  };

  const updateQuestionType = (type) => {
    let newOptions = [];
    
    switch (type) {
      case 'mc_single':
      case 'mc_multiple':
        newOptions = ['A', 'B', 'C', 'D'].map(letter => ({
          id: letter,
          text: '',
          isCorrect: false
        }));
        break;
      case 'true_false':
        newOptions = [
          { id: 'T', text: 'True', isCorrect: false },
          { id: 'F', text: 'False', isCorrect: false }
        ];
        break;
      case 'short_answer':
        newOptions = [{ id: 'SA', text: '', isCorrect: true }];
        break;
      default:
        newOptions = [{ id: 'A', text: '', isCorrect: false }];
    }
    
    setCurrentQuestion(prev => ({
      ...prev,
      type,
      options: newOptions,
      correctAnswer: ''
    }));
  };

  const addOption = () => {
    const nextLetter = String.fromCharCode(65 + currentQuestion.options.length);
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, { id: nextLetter, text: '', isCorrect: false }]
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 1) return;
    
    const newOptions = [...currentQuestion.options];
    newOptions.splice(index, 1);
    
    // Re-letter options
    const relettered = newOptions.map((opt, idx) => ({
      ...opt,
      id: String.fromCharCode(65 + idx)
    }));
    
    setCurrentQuestion(prev => ({
      ...prev,
      options: relettered,
      correctAnswer: prev.correctAnswer === currentQuestion.options[index].id ? '' : prev.correctAnswer
    }));
  };

  const toggleCorrectOption = (optionId) => {
    if (currentQuestion.type === 'mc_multiple') {
      // Multiple select - toggle
      const newOptions = currentQuestion.options.map(opt => 
        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
      
      const correctAnswers = newOptions.filter(opt => opt.isCorrect).map(opt => opt.id);
      
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: correctAnswers.join(',')
      }));
    } else {
      // Single select - set one correct
      const newOptions = currentQuestion.options.map(opt => ({
        ...opt,
        isCorrect: opt.id === optionId
      }));
      
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions,
        correctAnswer: optionId
      }));
    }
  };

  const parseBulkInput = () => {
    const lines = bulkInput.split('\n');
    const newQuestions = [];
    let currentQ = null;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Detect question
      if (trimmed.match(/^\d+\.\s/) || trimmed.match(/^[Qq]\d+\./)) {
        if (currentQ) newQuestions.push(currentQ);
        currentQ = {
          type: 'mc_single',
          text: trimmed.replace(/^\d+\.\s/, '').replace(/^[Qq]\d+\.\s/, ''),
          options: [],
          correctAnswer: '',
          explanation: '',
          points: 10,
          difficulty: 'beginner'
        };
      }
      // Detect option with correct marker
      else if (trimmed.match(/^[A-Da-d]\)/) && currentQ) {
        const optionLetter = trimmed[0].toUpperCase();
        const isCorrect = trimmed.includes('✓') || trimmed.includes('*');
        const optionText = trimmed.replace(/^[A-Da-d]\)\s*/, '').replace(/✓|\*/g, '').trim();
        
        currentQ.options.push({
          id: optionLetter,
          text: optionText,
          isCorrect
        });
        
        if (isCorrect) {
          currentQ.correctAnswer = optionLetter;
        }
      }
      // Detect True/False
      else if ((trimmed.includes('True') || trimmed.includes('False')) && currentQ) {
        const isTrueCorrect = trimmed.includes('✓') && trimmed.includes('True');
        const isFalseCorrect = trimmed.includes('✓') && trimmed.includes('False');
        
        currentQ.type = 'true_false';
        currentQ.options = [
          { id: 'T', text: 'True', isCorrect: isTrueCorrect },
          { id: 'F', text: 'False', isCorrect: isFalseCorrect }
        ];
        currentQ.correctAnswer = isTrueCorrect ? 'T' : 'F';
      }
    });
    
    if (currentQ) newQuestions.push(currentQ);
    
    if (newQuestions.length > 0) {
      setQuestions(prev => [...prev, ...newQuestions]);
      setBulkInput('');
      toast.success(`Added ${newQuestions.length} questions from bulk import!`);
    } else {
      toast.error('No valid questions found in the input');
    }
  };

  // ==================== MEDIA HANDLERS ====================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lesson_id', lessonId || '');
      
      const response = await apiClient.post('/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCurrentQuestion(prev => ({
        ...prev,
        imageUrl: response.data.url
      }));
      
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  // ==================== RENDER HELPERS ====================
  const renderQuestionForm = () => {
    switch (creationMode) {
      case 'simple':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700">
                  Simple Mode: Add questions with 4 fixed options. Perfect for quick creation.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Textarea
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your question..."
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Options (Mark correct with check)</Label>
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCorrectOption(letter)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        currentQuestion.options.find(o => o.id === letter)?.isCorrect
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                      }`}
                    >
                      {currentQuestion.options.find(o => o.id === letter)?.isCorrect ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        letter
                      )}
                    </button>
                    <Input
                      value={currentQuestion.options[idx]?.text || ''}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        if (newOptions[idx]) {
                          newOptions[idx].text = e.target.value;
                        } else {
                          newOptions[idx] = { id: letter, text: e.target.value, isCorrect: false };
                        }
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${letter}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addQuestion} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
                <Button variant="outline" onClick={() => setCreationMode('advanced')}>
                  Advanced Mode
                </Button>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-700">
                    Advanced Mode: Full control over question types, media, and settings.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCreationMode('simple')}>
                  Switch to Simple
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Question Type</Label>
                <Select value={currentQuestion.type} onValueChange={updateQuestionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <type.icon className={`w-4 h-4 ${type.color}`} />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Difficulty</Label>
                <Select 
                  value={currentQuestion.difficulty} 
                  onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map(level => (
                      <SelectItem key={level.id} value={level.id}>
                        <div className="flex items-center justify-between">
                          <span>{level.name}</span>
                          <span className="text-xs text-gray-500">{level.points} pts</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Question Text</Label>
              <Textarea
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your question..."
                rows={3}
              />
            </div>
            
            {/* Options based on type */}
            {currentQuestion.type !== 'short_answer' && currentQuestion.type !== 'fill_blank' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  {currentQuestion.type !== 'true_false' && (
                    <Button variant="outline" size="sm" onClick={addOption}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCorrectOption(option.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          option.isCorrect
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                        }`}
                      >
                        {option.isCorrect ? (
                          <Check className="w-4 h-4" />
                        ) : currentQuestion.type === 'mc_multiple' ? (
                          <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                        ) : (
                          option.id
                        )}
                      </button>
                      <Input
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[idx].text = e.target.value;
                          setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${option.id}`}
                      />
                      {currentQuestion.options.length > 1 && currentQuestion.type !== 'true_false' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Short answer field */}
            {currentQuestion.type === 'short_answer' && (
              <div>
                <Label>Correct Answer(s)</Label>
                <Textarea
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  placeholder="Enter correct answer. Separate multiple acceptable answers with commas."
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Students' answers will be matched against these (case-insensitive, ignoring extra spaces)
                </p>
              </div>
            )}
            
            {/* Fill in blank */}
            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-3">
                <Label>Question with Blanks</Label>
                <Textarea
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter text with blanks marked as ______. Example: 'The capital of France is ______.'"
                  rows={3}
                />
                <div>
                  <Label>Correct Answers for Blanks</Label>
                  <Textarea
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    placeholder="Enter correct answers for each blank, separated by |. Example: 'Paris|Madrid|Berlin'"
                    rows={2}
                  />
                </div>
              </div>
            )}
            
            {/* Media upload */}
            <div className="space-y-3">
              <Label>Add Media (Optional)</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button variant="outline">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Record Audio
                </Button>
              </div>
              {currentQuestion.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question" 
                    className="max-h-40 rounded-lg"
                  />
                </div>
              )}
            </div>
            
            {/* Explanation */}
            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={currentQuestion.explanation}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Explain why the answer is correct. This will be shown to students after they answer."
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addQuestion} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
              <Button variant="outline" onClick={() => setCurrentQuestion({
                type: 'mc_single',
                text: '',
                options: [{ id: 'A', text: '', isCorrect: false }],
                correctAnswer: '',
                explanation: '',
                points: 10,
                difficulty: 'beginner',
                timeLimit: 0,
                imageUrl: '',
                audioUrl: '',
                tags: []
              })}>
                Clear
              </Button>
            </div>
          </div>
        );

      case 'bulk':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Bulk Import: Paste multiple questions at once. Format:
                </p>
              </div>
              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
{`1. What is the capital of France?
A) London
B) Berlin
C) Paris ✓
D) Madrid

2. True or False: The sun rises in the west.
True
False ✓

3. Which of these are planets? (Select all)
A) Earth ✓
B) Sun
C) Mars ✓
D) Moon`}
              </pre>
            </div>
            
            <div>
              <Label>Paste Questions</Label>
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste your questions here..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={parseBulkInput} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Import Questions
              </Button>
              <Button variant="outline" onClick={() => setCreationMode('simple')}>
                Switch to Simple
              </Button>
            </div>
          </div>
        );
    }
  };

  const renderQuestionsList = () => (
    <div className="space-y-3">
      {questions.map((q, idx) => {
        const questionType = QUESTION_TYPES.find(t => t.id === q.type);
        
        return (
          <Card key={q.id || idx} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={questionType?.bg + ' ' + questionType?.color}>
                      <questionType.icon className="w-3 h-3 mr-1" />
                      {questionType?.name}
                    </Badge>
                    <Badge className={DIFFICULTY_LEVELS.find(d => d.id === q.difficulty)?.color}>
                      {q.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{q.points} pts</span>
                  </div>
                  <CardTitle className="text-base">{q.text}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentQuestion({ ...q });
                      setCreationMode('advanced');
                      toast.info('Editing question. Make changes and click "Update Question"');
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newQuestions = [...questions];
                      newQuestions.splice(idx, 1);
                      setQuestions(newQuestions);
                      toast.success('Question removed');
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {q.type === 'mc_single' || q.type === 'mc_multiple' ? (
                <div className="space-y-1">
                  {q.options.map(opt => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded ${
                        opt.isCorrect
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          opt.isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {opt.isCorrect ? <Check className="w-3 h-3" /> : opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : q.type === 'true_false' ? (
                <div className="flex gap-4">
                  {q.options.map(opt => (
                    <Badge
                      key={opt.id}
                      className={`${
                        opt.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {opt.text} {opt.isCorrect && '✓'}
                    </Badge>
                  ))}
                </div>
              ) : q.type === 'short_answer' ? (
                <div className="bg-blue-50 p-2 rounded">
                  <span className="font-medium">Answer: </span>
                  <span className="text-blue-700">{q.correctAnswer}</span>
                </div>
              ) : null}
              
              {q.explanation && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {questions.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No questions added yet</p>
          <p className="text-sm text-gray-400">Add questions using one of the creation modes above</p>
        </div>
      )}
    </div>
  );

  const renderQuizModeSettings = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUIZ_MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setQuizMode(mode.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              quizMode === mode.id
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <mode.icon className={`w-5 h-5 ${
                quizMode === mode.id ? 'text-teal-600' : 'text-gray-500'
              }`} />
              <span className={`font-medium ${
                quizMode === mode.id ? 'text-teal-700' : 'text-gray-700'
              }`}>
                {mode.name}
              </span>
            </div>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </button>
        ))}
      </div>
      
      {/* Mode-specific settings */}
      {quizMode === 'timed' && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <Label>Time Settings</Label>
          <div className="grid md:grid-cols-3 gap-3 mt-2">
            <div>
              <Label className="text-sm">Time per question (seconds)</Label>
              <Input
                type="number"
                min="0"
                defaultValue="30"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Bonus points for speed</Label>
              <Select defaultValue="2x">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5x">1.5x multiplier</SelectItem>
                  <SelectItem value="2x">2x multiplier</SelectItem>
                  <SelectItem value="3x">3x multiplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Time penalty</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No penalty</SelectItem>
                  <SelectItem value="points">Lose points</SelectItem>
                  <SelectItem value="skip">Skip question</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {quizMode === 'gamified' && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <Label>Game Elements</Label>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch id="streaks" />
                <Label htmlFor="streaks">Correct answer streaks</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="powerups" />
                <Label htmlFor="powerups">Power-ups (skip, 50/50)</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch id="leaderboard" />
                <Label htmlFor="leaderboard">Live leaderboard</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="sound" />
                <Label htmlFor="sound">Sound effects</Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== MAIN RENDER ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5]">
        <StudentNav />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading lesson editor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <StudentNav />
      
      {/* Tutorial Dialog */}
      <Dialog open={showTutorial && !isEditing} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎓 Welcome to Lesson Creator!</DialogTitle>
            <DialogDescription>
              Create engaging lessons and quizzes in minutes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">1. Lesson Basics</h4>
                <p className="text-sm text-gray-600">Start with title, content, and settings</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">2. Add Questions</h4>
                <p className="text-sm text-gray-600">Choose from 7 question types</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">3. Share & Save</h4>
                <p className="text-sm text-gray-600">Save, share templates, or assign to class</p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">Pro Tips</h4>
                  <ul className="text-sm text-amber-700 space-y-1 mt-1">
                    <li>• Use <strong>Simple Mode</strong> for quick multiple-choice questions</li>
                    <li>• Try <strong>Bulk Import</strong> to paste many questions at once</li>
                    <li>• Add <strong>explanations</strong> to help students learn from mistakes</li>
                    <li>• Enable <strong>Gamified Mode</strong> to increase engagement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowTutorial(false)}>
              Let's Get Started!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Preview</DialogTitle>
            <DialogDescription>
              How your lesson will appear to students
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{lesson.title || "Untitled Lesson"}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20">📚 {lesson.category}</Badge>
                <Badge className="bg-white/20">⏱️ {lesson.estimatedTime} min</Badge>
                <Badge className="bg-white/20">⭐ {lesson.points} pts</Badge>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <h3>Lesson Content</h3>
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {lesson.content || "No content yet"}
              </div>
            </div>
            
            {questions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Quiz ({questions.length} questions)</h3>
                <div className="space-y-4">
                  {questions.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Q{idx + 1}:</span>
                        <span className="text-sm text-gray-600">{q.points} pts</span>
                      </div>
                      <p className="mb-3">{q.text}</p>
                      {q.type === 'mc_single' || q.type === 'mc_multiple' ? (
                        <div className="space-y-2">
                          {q.options.map(opt => (
                            <div key={opt.id} className="p-2 border rounded">
                              {opt.id}) {opt.text}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {questions.length > 3 && (
                    <p className="text-center text-gray-500">
                      ... and {questions.length - 3} more questions
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <a 
                href="/lessons" 
                onClick={(e) => { e.preventDefault(); navigate('/lessons'); }}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Lessons
              </a>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update your lesson and questions' : 'Build an engaging lesson with interactive quizzes'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="hidden md:inline-flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTutorial(true)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button
                onClick={saveLesson}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : isEditing ? 'Update Lesson' : 'Publish Lesson'}
              </Button>
            </div>
          </div>
          
          {/* Draft saved indicator */}
          {draftSaved && (
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 mb-4">
              <Check className="w-4 h-4" />
              <span className="text-sm">Draft auto-saved</span>
            </div>
          )}
          
          {/* Mobile actions bar */}
          <div className="md:hidden flex justify-between items-center p-3 bg-white border rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Mobile View</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={saveLesson}
                disabled={saving}
              >
                {saving ? '...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Navigation & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Basics</span>
                    <span>{lesson.title ? '✓' : '○'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all" 
                      style={{ width: lesson.title ? '100%' : '0%' }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Content</span>
                    <span>{lesson.content ? '✓' : '○'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all" 
                      style={{ width: lesson.content ? '100%' : '0%' }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Questions</span>
                    <span>{questions.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all" 
                      style={{ width: `${Math.min(questions.length * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Creation Modes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => setCreationMode('simple')}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    creationMode === 'simple'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      creationMode === 'simple' ? 'bg-teal-100' : 'bg-gray-100'
                    }`}>
                      <Check className={`w-5 h-5 ${
                        creationMode === 'simple' ? 'text-teal-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className={`font-medium ${
                        creationMode === 'simple' ? 'text-teal-700' : 'text-gray-700'
                      }`}>
                        Simple Mode
                      </div>
                      <div className="text-sm text-gray-600">Quick 4-option questions</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setCreationMode('advanced')}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    creationMode === 'advanced'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      creationMode === 'advanced' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <Brain className={`w-5 h-5 ${
                        creationMode === 'advanced' ? 'text-purple-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className={`font-medium ${
                        creationMode === 'advanced' ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        Advanced Mode
                      </div>
                      <div className="text-sm text-gray-600">Full control, all types</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setCreationMode('bulk')}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    creationMode === 'bulk'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      creationMode === 'bulk' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        creationMode === 'bulk' ? 'text-amber-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className={`font-medium ${
                        creationMode === 'bulk' ? 'text-amber-700' : 'text-gray-700'
                      }`}>
                        Bulk Import
                      </div>
                      <div className="text-sm text-gray-600">Paste multiple questions</div>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points</span>
                  <span className="font-semibold">{questions.reduce((sum, q) => sum + (q.points || 10), 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Difficulty</span>
                  <span className="font-semibold">
                    {questions.length > 0 
                      ? questions.reduce((sum, q) => {
                          const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
                          return sum + (levels[q.difficulty] || 1);
                        }, 0) / questions.length 
                      : 1
                    }/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-semibold">
                    {questions.length * 2 + parseInt(lesson.estimatedTime || 0)} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column - Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Basics Tab */}
              <TabsContent value="basics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Information</CardTitle>
                    <CardDescription>
                      Set the basic details for your lesson
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Lesson Title *</Label>
                      <Input
                        id="title"
                        value={lesson.title}
                        onChange={(e) => setLesson(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter an engaging title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={lesson.category} 
                        onValueChange={(value) => setLesson(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select 
                          value={lesson.difficulty} 
                          onValueChange={(value) => setLesson(prev => ({ ...prev, difficulty: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_LEVELS.map(level => (
                              <SelectItem key={level.id} value={level.id}>
                                <div className="flex items-center justify-between">
                                  <span>{level.name}</span>
                                  <span className="text-xs text-gray-500">{level.points} pts</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="points">Points Reward</Label>
                        <Input
                          id="points"
                          type="number"
                          min="0"
                          value={lesson.points}
                          onChange={(e) => setLesson(prev => ({ ...prev, points: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                        <Input
                          id="estimatedTime"
                          type="number"
                          min="5"
                          max="240"
                          value={lesson.estimatedTime}
                          onChange={(e) => setLesson(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Grade Levels</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {GRADE_LEVELS.slice(5, 10).map(grade => (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => {
                                const newGrades = lesson.gradeLevels.includes(grade)
                                  ? lesson.gradeLevels.filter(g => g !== grade)
                                  : [...lesson.gradeLevels, grade];
                                setLesson(prev => ({ ...prev, gradeLevels: newGrades }));
                              }}
                              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                lesson.gradeLevels.includes(grade)
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {grade}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Short Description</Label>
                      <Textarea
                        id="description"
                        value={lesson.description}
                        onChange={(e) => setLesson(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of what students will learn"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Content</CardTitle>
                    <CardDescription>
                      Write your lesson material. You can use basic HTML for formatting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="objectives">Learning Objectives</Label>
                        <Textarea
                          id="objectives"
                          value={lesson.objectives}
                          onChange={(e) => setLesson(prev => ({ ...prev, objectives: e.target.value }))}
                          placeholder="What will students be able to do after this lesson?"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="prerequisites">Prerequisites</Label>
                        <Textarea
                          id="prerequisites"
                          value={lesson.prerequisites}
                          onChange={(e) => setLesson(prev => ({ ...prev, prerequisites: e.target.value }))}
                          placeholder="What should students know before starting?"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Main Content *</Label>
                        <div className="mb-2 flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            Add Heading
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Add Image
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Add Video
                          </Button>
                        </div>
                        <Textarea
                          id="content"
                          value={lesson.content}
                          onChange={(e) => setLesson(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Write your lesson content here... You can use basic HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;"
                          rows={12}
                          className="font-sans"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Questions Tab */}
              <TabsContent value="questions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Questions</CardTitle>
                    <CardDescription>
                      {creationMode === 'simple' && 'Simple mode: Quick multiple-choice questions'}
                      {creationMode === 'advanced' && 'Advanced mode: Full control with 7 question types'}
                      {creationMode === 'bulk' && 'Bulk import: Paste multiple questions at once'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderQuestionForm()}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Questions ({questions.length})</CardTitle>
                      {questions.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Clear all questions?')) {
                              setQuestions([]);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderQuestionsList()}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Settings</CardTitle>
                    <CardDescription>
                      Configure how students will experience the quiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderQuizModeSettings()}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback & Review</CardTitle>
                    <CardDescription>
                      Control how feedback is shown to students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showExplanations">Show explanations after each question</Label>
                        <Switch id="showExplanations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowRetry">Allow retry on incorrect answers</Label>
                        <Switch id="allowRetry" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showScore">Show score during quiz</Label>
                        <Switch id="showScore" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="randomize">Randomize question order</Label>
                        <Switch id="randomize" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shuffle">Shuffle answer options</Label>
                        <Switch id="shuffle" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sharing & Collaboration</CardTitle>
                    <CardDescription>
                      Share your lesson with other teachers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowCopy">Allow other teachers to copy</Label>
                        <Switch id="allowCopy" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="studentSubmit">Allow students to submit questions</Label>
                        <Switch id="studentSubmit" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Share as Template</Label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" className="flex-1">
                          <Copy className="w-4 h-4 mr-2" />
                          Save as Template
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share with Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 md:-mx-8 md:px-8 mt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {questions.length} questions • {questions.reduce((sum, q) => sum + (q.points || 10), 0)} total points
                </div>
                
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Lesson</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export as PDF
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export as Word Doc
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export as Google Form
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Export QTI (for LMS)
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    onClick={saveLesson}
                    disabled={saving}
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700 px-8"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Saving...' : isEditing ? 'Update Lesson' : 'Publish Lesson'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}