
import React, { useEffect, useState } from "react";
import CurioSuggestion from "@/components/CurioSuggestion";
import { RefreshCw, Compass, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      // Show feedback toast
      toast.info("Discovering new wonders for you...", {
        id: "wonder-suggestions",
        duration: 3000,
      });
      
      const response = await supabase.functions.invoke("groq-wonder-suggestions", {
        body: { interests: childInterests }
      });
      
      if (response.error) {
        console.error("Error fetching wonder suggestions:", response.error);
        toast.error("Couldn't fetch new wonders", {
          id: "wonder-suggestions",
          duration: 2000,
        });
        
        // Use default fallbacks instead
        setSuggestions(["Explore volcanoes", "What are tardigrades?", "Mysteries of black holes"]);
        return;
      }
      
      if (response.data && Array.isArray(response.data.suggestions)) {
        setSuggestions(response.data.suggestions);
        toast.success("Found exciting new wonders!", {
          id: "wonder-suggestions",
          duration: 2000,
        });
      } else {
        setSuggestions(["Amazing ocean facts", "How do rainbows work?", "Who were the pharaohs?"]);
      }
    } catch (err) {
      console.error("Error fetching dynamic suggestions:", err);
      setSuggestions(["Amazing animal adaptations", "Secrets of ancient civilizations", "How do computers think?"]);
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
    if (s.includes("space") || s.includes("planet") || s.includes("star") || s.includes("galaxy")) return "space";
    if (s.includes("animal") || s.includes("creature") || s.includes("dinosaur")) return "animals";
    if (s.includes("science") || s.includes("experiment") || s.includes("chemical")) return "science";
    if (s.includes("history") || s.includes("ancient") || s.includes("past")) return "history";
    if (s.includes("technology") || s.includes("computer") || s.includes("robot")) return "technology";
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
