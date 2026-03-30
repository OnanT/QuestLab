import { useState } from "react";
import { Button } from "../ui/button";
import { Info, Play, RotateCcw } from "lucide-react";

export default function InteractiveSimulation({ 
  config, 
  onScoreUpdate, 
  onComplete 
}) {
  const [isStarted, setIsStarted] = useState(false);

  const handleComplete = () => {
    onScoreUpdate(50); // High score for simulation completion
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="student-card p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{config.title || "Interactive Lab"}</h2>
          <p className="text-slate-500">{config.description || "Explore and learn through this simulation."}</p>
        </div>

        <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border-8 border-slate-100 shadow-inner">
          {!isStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm transition-all">
              <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse mb-6">
                <Play className="w-12 h-12 text-white fill-current" />
              </div>
              <Button 
                onClick={() => setIsStarted(true)}
                className="bg-white text-teal-600 hover:bg-teal-50 font-bold px-8 py-6 rounded-2xl shadow-xl"
              >
                Launch Simulation
              </Button>
            </div>
          ) : (
            <div className="w-full h-full">
              {config.embed_url ? (
                <iframe
                  src={config.embed_url}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 p-12 text-center">
                  <div className="space-y-4">
                    <Info className="w-12 h-12 mx-auto opacity-20" />
                    <p>Simulation content for <strong>{config.subject || "this topic"}</strong> would load here.</p>
                    <Button variant="outline" onClick={() => setIsStarted(false)} className="text-white border-white/20 hover:bg-white/10">
                      <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isStarted && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-12 py-6 rounded-2xl shadow-lg transition-all transform active:scale-95"
            >
              I've Finished Exploring!
            </Button>
          </div>
        )}

        <div className="mt-8 p-4 bg-amber-50 rounded-2xl flex gap-4 items-start border border-amber-100">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 text-sm">How to play:</h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              Use your mouse to interact with the elements in the lab. When you feel you've mastered the concept, click the "I've Finished Exploring" button to earn your points!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
