import { useState, useEffect } from "react";
import { apiClient } from "../App";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MapPin } from "lucide-react";

export default function CountrySelect({ value, onValueChange, placeholder = "Select Country" }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);
      try {
        const res = await apiClient.get("/country");
        setCountries(res.data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  return (
    <div className="relative group">
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors z-10" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 pl-11 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-teal-500 focus:bg-white transition-all font-medium">
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-2 border-slate-100 shadow-xl">
          {countries.map((c) => (
            <SelectItem key={c.id} value={c.name} className="font-medium focus:bg-teal-50 focus:text-teal-600 rounded-lg">
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
