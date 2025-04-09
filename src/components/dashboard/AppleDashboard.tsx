
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleButton } from '@/components/ui/apple-button';
import { Search, Sparkles, Compass, Book, Star, Clock, Plus, ArrowRight, CheckCircle, Lightbulb, BadgeCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import KnowledgeGlobe from './KnowledgeGlobe';
import WonderPathItem from './WonderPathItem';
import ChildTaskList from '@/components/ChildTaskList';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface AppleDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
}

const AppleDashboard: React.FC<AppleDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions = [],
  isLoadingSuggestions = false,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios = []
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showGlobe, setShowGlobe] = useState(false);
  const [wonderPathExpanded, setWonderPathExpanded] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  
  // Create suggested topics from past curios and predefined options
  const suggestedTopics = React.useMemo(() => {
    const fromPastCurios = pastCurios
      .slice(0, 3)
      .map(curio => ({ id: curio.id, title: curio.title || 'Untitled Wonder' }));
      
    const predefinedTopics = [
      { id: 'space', title: 'Space Exploration' },
      { id: 'animals', title: 'Amazing Animals' },
      { id: 'science', title: 'Science Experiments' }
    ];
    
    return [...fromPastCurios, ...predefinedTopics.slice(0, 3 - fromPastCurios.length)];
  }, [pastCurios]);
  
  const dailyChallenges = [
    { id: 'quiz', title: 'Answer today\'s wonder quiz', completed: false, type: 'quiz' },
    { id: 'read', title: 'Discover a new fascinating fact', completed: false, type: 'read' },
    { id: 'create', title: 'Create something inspired by what you learned', completed: false, type: 'create' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onCurioSuggestionClick(searchValue);
      setSearchValue('');
    }
  };
  
  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  
  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const name = childProfile?.name || 'Explorer';
    return `Good ${timeOfDay}, ${name}`;
  };
  
  const handleCurioClick = (topic: string) => {
    if (onCurioSuggestionClick) {
      onCurioSuggestionClick(topic);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    if (onCurioSuggestionClick) {
      onCurioSuggestionClick(suggestion);
    }
  };

  const handleGlobeToggle = () => {
    setShowGlobe(prev => !prev);
  };

  const handleTaskCompleted = () => {
    toast.success("Task completed!", {
      description: "You've earned sparks for your achievement!",
      icon: <BadgeCheck className="h-5 w-5 text-green-400" />
    });
  };
  
  const popularTopics = [
    "dinosaurs", "space", "animals", "robots", "planets"
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="mx-auto max-w-4xl pt-3 pb-8 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-6 flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-white/20">
            {childProfile?.avatar_url ? (
              <img src={childProfile.avatar_url} alt={childProfile?.name || 'Profile'} />
            ) : (
              <div className="bg-gradient-to-br from-amber-400 to-pink-500 w-full h-full flex items-center justify-center text-2xl font-medium text-white">
                {(childProfile?.name?.charAt(0) || 'W').toUpperCase()}
              </div>
            )}
          </Avatar>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-white">{getGreeting()}</h1>
            <div className="flex items-center gap-3 mt-1">
              {childProfile?.streak_days > 0 && (
                <div className="flex items-center gap-1 text-amber-300 text-sm">
                  <Star className="h-3.5 w-3.5" />
                  <span>{childProfile.streak_days} day streak</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-amber-300 text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{childProfile?.sparks_balance || 0} sparks</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <AppleButton 
            variant="secondary" 
            size="sm"
            onClick={handleGlobeToggle}
          >
            {showGlobe ? 'Hide' : 'Show'} Knowledge Globe
          </AppleButton>
        </div>
      </motion.div>
      
      {/* Main search - the central focus */}
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <form onSubmit={handleSearch} className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="What are you curious about today?"
            className="pr-12 pl-5 py-7 text-base sm:text-lg rounded-full bg-white shadow-xl border-0 text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={() => setShowCommandK(true)}
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
        
        {/* Popular topics */}
        <div className="flex flex-wrap items-center justify-center mt-3 gap-2">
          {popularTopics.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium py-1 px-3 rounded-full border border-white/10 transition-colors"
              onClick={() => onCurioSuggestionClick(topic)}
            >
              #{topic}
            </motion.button>
          ))}
        </div>
        
        <p className="text-white/60 text-xs text-center mt-2">
          The more you ask, the more sparks you'll earn!
        </p>
      </motion.div>
      
      {/* Command K Dialog */}
      <CommandDialog open={showCommandK} onOpenChange={setShowCommandK}>
        <Command className="rounded-lg border-none">
          <CommandInput placeholder="What would you like to learn about today?" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Popular Topics">
              {popularTopics.map((topic) => (
                <CommandItem
                  key={topic}
                  onSelect={() => {
                    onCurioSuggestionClick(topic);
                    setShowCommandK(false);
                  }}
                >
                  <span className="mr-2">#</span>
                  {topic}
                </CommandItem>
              ))}
            </CommandGroup>
            {pastCurios.length > 0 && (
              <CommandGroup heading="Previous Wonders">
                {pastCurios.slice(0, 3).map((curio) => (
                  <CommandItem
                    key={curio.id}
                    onSelect={() => {
                      onCurioSuggestionClick(curio.title || curio.query);
                      setShowCommandK(false);
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {curio.title || curio.query}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
      
      {/* Knowledge Globe (when activated) */}
      <AnimatePresence>
        {showGlobe && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6 overflow-hidden"
          >
            <KnowledgeGlobe pastCurios={pastCurios} childProfile={childProfile} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Active tasks - always visible and prominent */}
      <motion.div
        variants={itemVariants}
        className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-medium text-white">My Tasks</h2>
          </div>
        </div>
        
        <ChildTaskList childId={childId} onTaskCompleted={handleTaskCompleted} />
      </motion.div>
      
      {/* Main content area - simplified grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left column: Wonder Journeys */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                  <Compass className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-medium text-white">Wonder Journeys</h2>
              </div>
              
              <AppleButton
                variant="icon"
                size="icon"
                onClick={handleRefreshSuggestions}
                className="flex items-center justify-center"
                aria-label="Refresh suggestions"
              >
                <Plus className="h-4 w-4 text-white" />
              </AppleButton>
            </div>
            
            <div className="space-y-3">
              {curioSuggestions.slice(0, 3).map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="w-full text-left p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  <h3 className="text-white font-medium group-hover:text-white/90 line-clamp-2">{suggestion}</h3>
                  <div className="flex items-center mt-2 text-xs text-white/60">
                    <span>Explore</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mr-3">
                  <Book className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-medium text-white">Your Wonder Path</h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {suggestedTopics.slice(0, wonderPathExpanded ? undefined : 3).map((topic, index) => (
                <WonderPathItem
                  key={topic.id}
                  title={topic.title}
                  index={index}
                  onClick={() => handleCurioClick(topic.title)}
                />
              ))}
              
              {suggestedTopics.length > 3 && (
                <button 
                  className="w-full text-center text-white/70 text-sm hover:text-white transition-colors py-2"
                  onClick={() => setWonderPathExpanded(!wonderPathExpanded)}
                >
                  {wonderPathExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Right column: Today's Challenges and Time Capsule */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-medium text-white">Today's Challenges</h2>
            </div>
            
            <div className="space-y-3">
              {dailyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  className={cn(
                    "p-3 rounded-lg transition-all relative overflow-hidden",
                    challenge.completed 
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-white/5 border border-white/10 hover:border-white/20"
                  )}
                  whileHover={{ scale: challenge.completed ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                  onClick={() => {
                    toast.success("Challenge started!", { 
                      description: "Let's complete this challenge together!" 
                    });
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      challenge.completed ? "bg-green-500" : "bg-white/10"
                    )}>
                      {challenge.completed ? (
                        <Star className="h-3 w-3 text-white" />
                      ) : (
                        <span className="text-white text-xs">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-white font-medium text-sm">{challenge.title}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">5 min</span>
                        
                        <div className="ml-3 flex items-center">
                          <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                          <span className="text-amber-300 text-xs">+5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-medium text-white">Time Capsule</h2>
            </div>
            
            <div className="space-y-3">
              {pastCurios.slice(0, 3).map((curio, index) => (
                <motion.div
                  key={curio.id || index}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                  onClick={() => handleCurioClick(curio.title || curio.query || '')}
                >
                  <p className="text-white font-medium text-sm line-clamp-2">{curio.title || 'Untitled Wonder'}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-white/60 mr-1" />
                    <span className="text-white/60 text-xs">
                      {new Date(curio.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {pastCurios.length === 0 && (
                <div className="text-center py-3">
                  <p className="text-white/60 text-sm">Your memories will appear here</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom "Ask anything" button */}
      <motion.div 
        className="flex justify-center"
        variants={itemVariants}
      >
        <AppleButton 
          variant="default"
          size="lg"
          onClick={focusSearchInput}
          className="group bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-sm border border-white/20"
        >
          <Lightbulb className="mr-2 h-4 w-4 text-amber-300 group-hover:text-amber-200 transition-colors" />
          <span>Ask me anything</span>
        </AppleButton>
      </motion.div>
    </motion.div>
  );
};

export default AppleDashboard;
