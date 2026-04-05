import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Image, Music, Film, FileText, Upload, Check, Loader2 } from "lucide-react";
import { apiClient } from "../../App";
import { toast } from "sonner";

export default function MediaPicker({ onSelect, isOpen, onClose }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/all-media");
      setMedia(res.data);
    } catch (error) {
      toast.error("Failed to load media library");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await apiClient.post("/upload-media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Media uploaded successfully");
      fetchMedia();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case "image": return <Image className="w-5 h-5" />;
      case "audio": return <Music className="w-5 h-5" />;
      case "video": return <Film className="w-5 h-5" />;
      case "document": return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col rounded-3xl border-none shadow-2xl p-0">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-black font-heading">Media Library</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 border-b border-slate-100">
            <TabsList className="flex gap-4">
              <TabsTrigger value="browse" className="py-4 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
                Browse Media
              </TabsTrigger>
              <TabsTrigger value="upload" className="py-4 text-sm font-bold border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
                Upload New
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <TabsContent value="browse" className="mt-0 outline-none h-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-4" />
                  <p className="text-slate-400 font-bold">Loading assets...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`relative group cursor-pointer rounded-2xl border-2 transition-all overflow-hidden aspect-square flex flex-col items-center justify-center p-2
                        ${selectedId === item.id ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                    >
                      {item.category === 'image' ? (
                        <img 
                          src={item.url} 
                          alt={item.filename} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          {getIcon(item.category)}
                          <span className="text-[10px] font-bold text-center px-2 line-clamp-2">{item.filename}</span>
                        </div>
                      )}
                      
                      {selectedId === item.id && (
                        <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1 shadow-lg">
                          <Check className="w-3 h-3 stroke-[4px]" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {media.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-slate-400 font-medium">No media assets found.</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-0 outline-none h-full">
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-[2rem] p-12 bg-slate-50/50">
                <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-700 mb-2">Upload Content</h3>
                <p className="text-slate-400 text-center max-w-xs mb-8 font-medium">
                  Select an image, audio or video file to use in your lessons.
                </p>
                <input 
                  type="file" 
                  id="media-upload" 
                  className="hidden" 
                  onChange={handleUpload}
                  disabled={uploading}
                />
                <Button 
                  asChild 
                  disabled={uploading}
                  className="btn-primary rounded-2xl h-12 px-8"
                >
                  <label htmlFor="media-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
          <Button variant="ghost" onClick={onClose} className="flex-1 rounded-2xl h-14 font-black">
            Cancel
          </Button>
          <Button 
            disabled={!selectedId}
            onClick={() => {
              const selectedMedia = media.find(m => m.id === selectedId);
              onSelect(selectedMedia);
              onClose();
            }}
            className="flex-[2] h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20"
          >
            Insert Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
