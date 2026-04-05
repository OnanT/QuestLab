import { useState, useMemo, useEffect } from "react";
import { BarChart3, Users, Calendar, Download } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useParentData } from "../../hooks/useParentData";
import { useReports } from "../../hooks/useReports";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import ActivityTable from "../../components/parent/ActivityTable";

export default function ParentReports() {
  const { students, loading: loadingStudents } = useParentData();
  const location = useLocation();
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  // Get studentId from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const studentId = params.get("studentId");
    if (studentId) {
      setSelectedStudentId(studentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id.toString());
    }
  }, [location.search, students]);

  const { reports, loading: loadingReports } = useReports(selectedStudentId);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id.toString() === selectedStudentId),
    [students, selectedStudentId]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Progress Reports</h1>
          <p className="text-slate-500 font-medium">View detailed activity logs and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-2 border-slate-100 h-12 font-bold text-slate-600">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="rounded-2xl border-2 border-slate-100 h-12 font-bold text-slate-600">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Student Selector */}
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Select Student</p>
            <Select value={selectedStudentId || ""} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-[240px] border-none p-0 h-auto font-black text-lg focus:ring-0">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-xl">
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id.toString()} className="rounded-xl font-bold py-3">
                    {student.display_name || student.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedStudent && (
          <div className="flex gap-8 items-center pr-4 border-l-2 border-slate-50 pl-8 hidden lg:flex">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Points</p>
               <p className="text-xl font-black text-slate-900">{selectedStudent.total_points || 0}</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Accuracy</p>
               <p className="text-xl font-black text-teal-600">{selectedStudent.average_score || 0}%</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lessons</p>
               <p className="text-xl font-black text-slate-900">{selectedStudent.quizzes_completed || 0}</p>
             </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Recent Activity
            </h2>
        </div>
        
        {loadingReports ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <ActivityTable reports={reports} />
        )}
      </div>
    </div>
  );
}
