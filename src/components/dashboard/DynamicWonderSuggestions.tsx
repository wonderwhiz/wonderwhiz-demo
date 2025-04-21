
import React, { useEffect, useState } from "react";
import CurioSuggestion from "@/components/CurioSuggestion";
import { RefreshCw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

// This component fetches and shows dynamic, Groq-generated topic suggestions based on child interests.
interface DynamicWonderSuggestionsProps {
  childId: string;
  childInterests: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  childId,
  childInterests,
  isLoading,
  onSuggestionClick
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch fresh dynamic topics via Groq edge function
  const fetchDynamicSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/groq-wonder-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ interests: childInterests })
      });
      const data = await response.json();
      // Expect: { suggestions: ["..."] }
      if (data && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions(["Explore volcanoes", "What are tardigrades?", "Mysteries of black holes"]);
      }
    } catch (err) {
      setSuggestions(["Amazing ocean facts", "How do rainbows work?", "Who were the pharaohs?"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchDynamicSuggestions();
    }
    // eslint-disable-next-line
  }, [childInterests, isLoading]);

  // Card type helper for icon/color logic (reuse main dashboard logic)
  const getCardType = (suggestion: string): "space" | "animals" | "science" | "history" | "technology" | "general" => {
    const s = suggestion.toLowerCase();
    if (s.includes("space")) return "space";
    if (s.includes("animal")) return "animals";
    if (s.includes("science")) return "science";
    if (s.includes("history")) return "history";
    if (s.includes("technology")) return "technology";
    return "general";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3">
            <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />
          </div>
          <h2 className="text-xl font-bold text-white font-nunito">
            Discover New Wonders
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/5 hover:bg-white/10 text-white rounded-full h-8 w-8"
          onClick={fetchDynamicSuggestions}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(loading || isLoading)
          ? Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="h-24 animate-pulse bg-white/10 rounded-xl" />
              ))
          : suggestions.slice(0, 3).map((suggestion, idx) => (
              <div
                key={idx}
                className="h-full cursor-pointer transition-transform hover:-translate-y-1"
              >
                <CurioSuggestion
                  suggestion={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  type={getCardType(suggestion)}
                  loading={false}
                  index={idx}
                  profileId={childId}
                />
              </div>
            ))}
      </div>
      <div className="pt-2 text-xs text-white/70 italic">
        Topics matched to your interests for fresh discovery! Click one to start a unique exploration.
      </div>
    </div>
  );
};

export default DynamicWonderSuggestions;
