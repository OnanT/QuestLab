import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Pencil, Trash2, Gamepad2, BookOpen, Settings } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    lesson_id: "",
    game_engine_id: "",
    config_json: {
      title: "",
      points: 10,
      difficulty: "medium"
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamesRes, lessonsRes, enginesRes] = await Promise.all([
        apiClient.get("/admin/games"),
        apiClient.get("/lessons"),
        apiClient.get("/admin/game-engines")
      ]);
      setGames(gamesRes.data);
      setLessons(lessonsRes.data);
      setEngines(enginesRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await apiClient.patch(`/admin/games/${editingGame.id}`, formData);
        toast.success("Game updated successfully");
      } else {
        await apiClient.post("/games", formData);
        toast.success("Game created successfully");
      }
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error("Failed to save game");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await apiClient.delete(`/admin/games/${id}`);
      toast.success("Game deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete game");
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      lesson_id: game.lesson_id,
      game_engine_id: game.game_engine_id,
      config_json: game.config_json
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      lesson_id: "",
      game_engine_id: "",
      config_json: {
        title: "",
        points: 10,
        difficulty: "medium"
      }
    });
    setEditingGame(null);
  };

  const handleConfigChange = (key, value) => {
    setFormData({
      ...formData,
      config_json: {
        ...formData.config_json,
        [key]: value
      }
    });
  };

  return (
    <div className="animate-fadeInUp" data-testid="admin-games">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-heading text-slate-900">Games</h1>
          <p className="text-slate-500 font-medium">Manage interactive learning games</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary rounded-xl" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-heading flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-teal-600" />
                {editingGame ? "Edit Game" : "Create New Game"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Associated Lesson</Label>
                  <Select value={String(formData.lesson_id)} onValueChange={(v) => setFormData({...formData, lesson_id: parseInt(v)})}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500">
                      <SelectValue placeholder="Select a lesson" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                      {lessons.map((l) => (
                        <SelectItem key={l.id} value={String(l.id)} className="font-bold text-slate-700">
                          {l.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Game Engine</Label>
                  <Select value={String(formData.game_engine_id)} onValueChange={(v) => setFormData({...formData, game_engine_id: parseInt(v)})}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500">
                      <SelectValue placeholder="Select an engine" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      {engines.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)} className="font-bold text-slate-700">
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Game Title</Label>
                <Input 
                  value={formData.config_json.title} 
                  onChange={(e) => handleConfigChange("title", e.target.value)}
                  placeholder="Enter a title for the game..."
                  className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">XP Points</Label>
                  <Input 
                    type="number" 
                    value={formData.config_json.points} 
                    onChange={(e) => handleConfigChange("points", parseInt(e.target.value))} 
                    className="h-12 rounded-xl border-2 border-slate-100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</Label>
                  <Select value={formData.config_json.difficulty} onValueChange={(v) => handleConfigChange("difficulty", v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="beginner" className="font-bold">Beginner</SelectItem>
                      <SelectItem value="medium" className="font-bold">Medium</SelectItem>
                      <SelectItem value="advanced" className="font-bold">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Settings className="w-3 h-3" />
                  Raw Configuration (JSON)
                </Label>
                <Textarea 
                  value={JSON.stringify(formData.config_json, null, 2)} 
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData({...formData, config_json: parsed});
                    } catch (err) {
                      // Allow typing invalid JSON temporarily
                    }
                  }}
                  className="rounded-xl border-2 border-slate-100 bg-slate-900 text-teal-400 font-mono text-xs min-h-[200px]"
                />
                <p className="text-[10px] text-slate-400 font-medium">Be careful when editing the raw JSON configuration.</p>
              </div>

              <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black font-accent text-lg shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4">
                {editingGame ? "Save Changes" : "Create Game"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent shadow-lg shadow-teal-500/20"></div>
        </div>
      ) : (
        <div className="student-card overflow-hidden bg-white border-2 border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4 text-left">Game</th>
                  <th className="px-6 py-4 text-left">Lesson</th>
                  <th className="px-6 py-4 text-center">Engine</th>
                  <th className="px-6 py-4 text-center">Difficulty</th>
                  <th className="px-6 py-4 text-center">XP</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100">
                          <Gamepad2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{game.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[150px]">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-500 truncate text-xs">Lesson #{game.lesson_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
                        {game.game_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center capitalize">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase border border-slate-200">
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-accent font-black text-slate-900">{game.points}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(game)} className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(game.id)} className="rounded-full hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {games.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <Gamepad2 className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No games found</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Add your first game to make learning fun.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
