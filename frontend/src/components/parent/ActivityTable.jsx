import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "../ui/table";
import { Badge } from "../ui/badge";
import { BookOpen, Gamepad2, CheckCircle2 } from "lucide-react";

export default function ActivityTable({ reports }) {
  const formatDate = (dateString) => {
    if (!dateString) return "In Progress";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">No activity recorded for this student yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[10px] py-4 px-6">Type</TableHead>
            <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[10px] py-4">Activity</TableHead>
            <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[10px] py-4">Score</TableHead>
            <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[10px] py-4">Date</TableHead>
            <TableHead className="font-black text-slate-900 uppercase tracking-wider text-[10px] py-4 text-right pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
              <TableCell className="py-4 px-6">
                {report.lesson_id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Lesson</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Game</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-bold text-slate-800 text-sm">
                {report.lesson_title || `Activity #${report.lesson_id || report.game_id || 'N/A'}`}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black ${
                    (report.score || 0) >= 80 ? 'text-teal-600' : 
                    (report.score || 0) >= 50 ? 'text-amber-600' : 'text-red-500'
                  }`}>
                    {report.score || 0}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-sm font-medium">
                {formatDate(report.completed_at)}
              </TableCell>
              <TableCell className="text-right pr-6">
                {report.completed ? (
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 rounded-lg font-bold hover:bg-teal-50">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-400 border-slate-200 rounded-lg font-bold">
                    In Progress
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
