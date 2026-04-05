import { useState, useMemo } from "react";
import { Users, UserPlus, Search, Filter } from "lucide-react";
import { useParentData } from "../../hooks/useParentData";
import { Button } from "../../components/ui/button";
import ChildCard from "../../components/parent/ChildCard";
import AddChildModal from "../../components/parent/AddChildModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function ParentChildren() {
  const { students, loading, registerStudent, removeStudent } = useParentData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = (s.display_name || s.username).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === "all" || s.grade?.toString() === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [students, searchQuery, gradeFilter]);

  const grades = useMemo(() => {
    const uniqueGrades = [...new Set(students.map(s => s.grade).filter(Boolean))].sort((a, b) => a - b);
    return uniqueGrades;
  }, [students]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">My Children</h1>
          <p className="text-slate-500 font-medium">Manage and track your children's learning accounts.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary rounded-2xl px-6 h-12 shadow-lg shadow-teal-500/20"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Child
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl text-sm font-medium transition-all outline-none"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl border-2 border-slate-100 h-12 px-6 font-bold text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              {gradeFilter === "all" ? "All Grades" : `Grade ${gradeFilter}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl border-2 border-slate-100 shadow-xl p-2 min-w-[160px]">
            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400 p-2">Filter by Grade</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => setGradeFilter("all")}
              className={`rounded-xl font-bold py-2.5 ${gradeFilter === "all" ? "bg-teal-50 text-teal-600" : ""}`}
            >
              All Grades
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            {grades.map(grade => (
              <DropdownMenuItem 
                key={grade}
                onClick={() => setGradeFilter(grade.toString())}
                className={`rounded-xl font-bold py-2.5 ${gradeFilter === grade.toString() ? "bg-teal-50 text-teal-600" : ""}`}
              >
                Grade {grade}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {loading && !students.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.map(student => (
            <ChildCard key={student.id} student={student} onRemove={removeStudent} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No children found</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            {searchQuery 
              ? `We couldn't find any children matching your criteria.`
              : "You haven't added any children to your account yet. Get started by adding your first child!"}
          </p>
          {!searchQuery && gradeFilter === "all" && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary rounded-2xl px-8 h-12"
            >
              Add Your First Child
            </Button>
          )}
        </div>
      )}

      {/* Add Child Modal */}
      <AddChildModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={registerStudent}
      />
    </div>
  );
}
