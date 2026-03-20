import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, Check, UserCircle } from "lucide-react";
import { toast } from "sonner";

const PREDEFINED_AVATARS = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
];

export default function AvatarSelector({ currentAvatar, onSelect }) {
  const [uploading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Call the parent's onSelect with the formData for uploading
      await onSelect(formData, true);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={currentAvatar || "/default_avatar.png"}
            alt="Current Avatar"
            className="w-24 h-24 rounded-full border-4 border-teal-500 object-cover shadow-xl"
            onError={(e) => { e.target.src = "/default_avatar.png"; }}
          />
          <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
            <Check className="w-3 h-3" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">Your Avatar</h3>
          <p className="text-sm text-slate-500 font-medium">Choose a character or upload your own photo.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {PREDEFINED_AVATARS.map((avatarUrl) => (
          <button
            key={avatarUrl}
            onClick={() => onSelect(avatarUrl, false)}
            className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
              currentAvatar === avatarUrl 
                ? "border-teal-500 ring-2 ring-teal-500 ring-offset-2 scale-95" 
                : "border-slate-100 hover:border-teal-200 hover:scale-105"
            }`}
          >
            <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
            {currentAvatar === avatarUrl && (
              <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            )}
          </button>
        ))}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all aspect-square gap-1 group"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-teal-500" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-600 uppercase tracking-tighter">Upload</span>
            </>
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
