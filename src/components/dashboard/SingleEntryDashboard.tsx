import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Camera } from 'lucide-react';

interface SingleEntryDashboardProps {
  childProfile: any;
  onSearch: (query: string) => void;
  onImageUpload: (file: File) => void;
  isGenerating: boolean;
  streakDays: number;
  sparksBalance: number;
}

const SingleEntryDashboard: React.FC<SingleEntryDashboardProps> = ({
  childProfile,
  onSearch,
  onImageUpload,
  isGenerating,
  streakDays,
  sparksBalance
}) => {
  const [query, setQuery] = useState('');
  const age = childProfile?.age || 10;
  const isYoungChild = age <= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const suggestions = isYoungChild 
    ? ["Why is the sky blue?", "How do plants grow?", "What do dinosaurs eat?"]
    : age <= 11
    ? ["How do rockets work?", "Why do we have seasons?", "How is electricity made?"]
    : ["How does artificial intelligence work?", "What causes climate change?", "How do vaccines work?"];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-wonderwhiz-deep-purple to-wonderwhiz-purple border-wonderwhiz-cyan/20">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">
            {isYoungChild ? "🚀" : age <= 11 ? "✨" : "🧠"}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isYoungChild ? `Hi ${childProfile?.name}!` : `Welcome, ${childProfile?.name}`}
          </h1>
          <p className="text-white/80">
            {isYoungChild ? "What do you want to learn today?" : "What would you like to explore?"}
          </p>
          
          {/* Compact Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
              <span className="text-white">{sparksBalance}</span>
            </div>
            {streakDays > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-orange-400">🔥</span>
                <span className="text-white">{streakDays} days</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Single Search Interface */}
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isYoungChild ? "Ask me anything!" : "What would you like to learn about?"}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-wonderwhiz-cyan h-12 text-lg"
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={!query.trim() || isGenerating}
                className="flex-1 bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 text-white font-medium h-11"
              >
                {isGenerating ? "Creating..." : isYoungChild ? "Let's Learn!" : "Explore"}
              </Button>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isGenerating}
                />
                <div className="w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md flex items-center justify-center transition-colors">
                  <Camera className="h-5 w-5 text-white/80" />
                </div>
              </label>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-6">
            <p className="text-white/60 text-sm mb-3">
              {isYoungChild ? "Try these:" : "Popular topics:"}
            </p>
            <div className="grid gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSearch(suggestion)}
                  disabled={isGenerating}
                  className="text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/80 hover:text-white transition-all text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleEntryDashboard;