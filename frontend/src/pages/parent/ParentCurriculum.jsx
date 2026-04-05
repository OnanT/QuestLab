import { useState, useMemo } from "react";
import { BookOpen, Gamepad2, Search, Filter, PlayCircle } from "lucide-react";
import { useCurriculum } from "../../hooks/useCurriculum";
import { useParentData } from "../../hooks/useParentData";
import { useParentCurriculumStatus } from "../../hooks/useParentCurriculumStatus";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import CurriculumCard from "../../components/parent/CurriculumCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function ParentCurriculum() {
  const { lessons, games, loading: loadingCurriculum } = useCurriculum();
  const { students } = useParentData();
  const { status: curriculumStatus, loading: loadingStatus } = useParentCurriculumStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const loading = loadingCurriculum || loadingStatus;

  const subjects = useMemo(() => {
    const all = [...lessons.map(l => l.category), ...games.map(g => g.subject_name)].filter(Boolean);
    return [...new Set(all)].sort();
  }, [lessons, games]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (l.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || l.category === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [lessons, searchQuery, subjectFilter]);

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (g.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || g.subject_name === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [games, searchQuery, subjectFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Curriculum Explorer</h1>
          <p className="text-slate-500 font-medium">Explore the lessons and games available to your children.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search lessons or games..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl border-2 border-slate-100 h-12 px-6 font-bold text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              {subjectFilter === "all" ? "All Subjects" : subjectFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl border-2 border-slate-100 shadow-xl p-2 min-w-[180px]">
            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400 p-2">Filter by Subject</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => setSubjectFilter("all")}
              className={`rounded-xl font-bold py-2.5 ${subjectFilter === "all" ? "bg-teal-50 text-teal-600" : ""}`}
            >
              All Subjects
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            {subjects.map(subject => (
              <DropdownMenuItem 
                key={subject}
                onClick={() => setSubjectFilter(subject)}
                className={`rounded-xl font-bold py-2.5 ${subjectFilter === subject ? "bg-teal-50 text-teal-600" : ""}`}
              >
                {subject}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <Tabs defaultValue="lessons" className="space-y-8">
        <div className="flex justify-center md:justify-start">
          <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl h-14 border border-slate-100">
            <TabsTrigger value="lessons" className="rounded-xl px-8 font-black data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="games" className="rounded-xl px-8 font-black data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lessons" className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLessons.map(lesson => (
                <CurriculumCard 
                  key={lesson.id} 
                  item={lesson} 
                  type="lesson" 
                  students={students}
                  status={curriculumStatus[lesson.id] || []}
                />
              ))}
            </div>
          ) : (
            <EmptyState query={searchQuery} type="lessons" />
          )}
        </TabsContent>

        <TabsContent value="games" className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGames.map(game => (
                <CurriculumCard 
                  key={game.id} 
                  item={game} 
                  type="game" 
                  students={students}
                  status={curriculumStatus[game.lesson_id] || []} // Games are usually linked to a lesson
                />
              ))}
            </div>
          ) : (
            <EmptyState query={searchQuery} type="games" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ query, type }) {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        {type === 'lessons' ? <BookOpen className="w-10 h-10 text-slate-300" /> : <Gamepad2 className="w-10 h-10 text-slate-300" />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No {type} found</h3>
      <p className="text-slate-500 font-medium max-w-sm mx-auto">
        {query 
          ? `We couldn't find any ${type} matching "${query}"`
          : `There are no ${type} available in the curriculum at the moment.`}
      </p>
    </div>
  );
}
