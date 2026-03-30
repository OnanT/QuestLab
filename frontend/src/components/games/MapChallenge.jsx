import { Progress } from "../ui/progress";
import { MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

export default function MapChallenge({ 
  config, 
  currentIndex, 
  gameState, 
  mapGuesses, 
  onMapClick, 
  progress 
}) {
  const location = config.locations?.[currentIndex];

  const MapEvents = ({ onMapClick }) => {
    useMapEvents({
      click: (e) => onMapClick(e),
    });
    return null;
  };

  return (
    <div className="student-card p-6">
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Find: <strong className="text-teal-600 underline decoration-teal-300 decoration-2 underline-offset-4">{location?.name}</strong></span>
          <span>{currentIndex + 1} of {config.locations?.length || 0}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-50">
        {config.map_type === "leaflet" ? (
          <div className="aspect-video w-full z-0">
            <MapContainer 
              center={[config.center_lat || 18, config.center_lng || -77]} 
              zoom={config.zoom || 7} 
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEvents onMapClick={onMapClick} />
              
              {/* Found locations */}
              {mapGuesses.map((loc, i) => (
                <Marker key={i} position={[loc.lat, loc.lng]} />
              ))}
            </MapContainer>
          </div>
        ) : (
          <div 
            className="relative aspect-video cursor-crosshair bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{ 
              backgroundImage: config.image_url 
                ? `url(${config.image_url})` 
                : "linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%)",
            }}
            onClick={onMapClick}
            data-testid="map-challenge-area"
          >
            {/* Overlay if no image */}
            {!config.image_url && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-400/50 pointer-events-none">
                <div className="text-center">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-lg font-medium">Click to locate: {location?.name}</p>
                </div>
              </div>
            )}
            
            {/* Found locations */}
            {mapGuesses.map((loc, i) => (
              <div 
                key={i}
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 animate-bounce transition-all duration-300"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <MapPin className="w-8 h-8 text-green-500 drop-shadow-lg fill-white/20" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50 flex items-start gap-3">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Search className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-teal-900">Hint</p>
          <p className="text-sm text-teal-700 italic">"{location?.hint}"</p>
        </div>
      </div>
    </div>
  );
}