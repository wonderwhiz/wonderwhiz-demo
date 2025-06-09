
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FloatingSearchProps {
  onSearch: (query: string) => void;
  onImageCapture?: (file: File) => void;
  onVoiceStart?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const FloatingSearch: React.FC<FloatingSearchProps> = ({
  onSearch,
  onImageCapture,
  onVoiceStart,
  isLoading = false,
  placeholder = "What sparks your curiosity?",
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setIsExpanded(false);
    }
  }, [query, onSearch]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setQuery('');
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageCapture) {
      onImageCapture(file);
      setIsExpanded(false);
    }
  }, [onImageCapture]);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <motion.div
      className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}
      initial={false}
      animate={{
        width: isExpanded ? 320 : 56,
        height: isExpanded ? 120 : 56
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleExpand}
              className="w-14 h-14 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
            >
              <Search className="h-6 w-6 text-wonderwhiz-deep-purple group-hover:scale-110 transition-transform" />
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Quick Search</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapse}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-wonderwhiz-bright-pink"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!query.trim() || isLoading}
                    className="absolute right-1 top-1 h-7 w-7 p-0 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 border-t border-white rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  {onVoiceStart && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onVoiceStart}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Mic className="h-4 w-4 mr-1" />
                      Voice
                    </Button>
                  )}
                  
                  {onImageCapture && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Image
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FloatingSearch;
