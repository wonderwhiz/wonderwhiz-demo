
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MagicalSearchBar from '@/components/dashboard/MagicalSearchBar';

interface SimplifiedCurioHeaderProps {
  title: string;
  showLearningPath: boolean;
  setShowLearningPath: (show: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  recentQueries?: string[];
  isGenerating?: boolean;
}

const SimplifiedCurioHeader: React.FC<SimplifiedCurioHeaderProps> = ({
  title,
  showLearningPath,
  setShowLearningPath,
  query,
  setQuery,
  handleSearch,
  recentQueries = [],
  isGenerating = false
}) => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left text-white font-nunito">
          {title}
        </h1>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLearningPath(!showLearningPath)}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {showLearningPath ? "Hide Path" : "Show Path"}
        </Button>
      </div>
      
      <MagicalSearchBar
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={() => {
          if (query.trim()) {
            handleSearch({ preventDefault: () => {} } as React.FormEvent);
          }
        }}
        isGenerating={isGenerating}
        recentQueries={recentQueries}
        placeholder="Ask another question or search within this topic..."
      />
    </motion.div>
  );
};

export default SimplifiedCurioHeader;
