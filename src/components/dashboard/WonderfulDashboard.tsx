
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Rocket, Star, BookOpen, Sparkles, Brain, Map, Gift, Lightbulb, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useCurioCreation } from '@/hooks/useCurioCreation';
import { format } from 'date-fns';
import SparksBalance from '@/components/SparksBalance';
import StreakDisplay from '@/components/StreakDisplay';
import ChildTaskList from '@/components/ChildTaskList';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';

interface WonderfulDashboardProps {
  childProfile: any;
  pastCurios: any[];
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  profileId?: string;
}

const WonderfulDashboard: React.FC<WonderfulDashboardProps> = ({
  childProfile,
  pastCurios,
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  profileId
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Create a new curio when a suggestion is clicked
  const handleSuggestionClick = async (suggestion: string) => {
    if (!profileId) return;
    
    try {
      toast.loading('Creating your adventure...', { id: 'create-curio' });
      
      // Create a new curio
      const { data, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: suggestion,
          query: suggestion
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast.success('Adventure created!', { id: 'create-curio' });
      
      // Trigger confetti when created
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#3b82f6']
      });
      
      // Navigate to the curio page
      if (data?.id) {
        // Award sparks for curiosity
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 5
            })
          });
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
        
        navigate(`/curio/${profileId}/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error('Oops! Something went wrong', { id: 'create-curio' });
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && profileId) {
      handleSuggestionClick(searchQuery);
    }
  };
  
  // Get category topics
  const getTopicsByCategory = (category: string | null) => {
    if (!category || category === 'all') return curioSuggestions;
    
    return curioSuggestions.filter(topic => {
      const lowerTopic = topic.toLowerCase();
      
      switch(category) {
        case 'space':
          return lowerTopic.includes('planet') || lowerTopic.includes('space') || 
                 lowerTopic.includes('star') || lowerTopic.includes('galaxy') ||
                 lowerTopic.includes('universe') || lowerTopic.includes('rocket');
        case 'animals':
          return lowerTopic.includes('animal') || lowerTopic.includes('dog') || 
                 lowerTopic.includes('cat') || lowerTopic.includes('bird') ||
                 lowerTopic.includes('fish') || lowerTopic.includes('dinosaur');
        case 'science':
          return lowerTopic.includes('science') || lowerTopic.includes('experiment') || 
                 lowerTopic.includes('chemistry') || lowerTopic.includes('physics');
        default:
          return true;
      }
    });
  };
  
  // Generate background color based on topic
  const getTopicColor = (topic: string, index: number) => {
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('planet') || lowerTopic.includes('space') || lowerTopic.includes('star')) {
      return 'from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/40 hover:to-purple-500/40';
    }
    
    if (lowerTopic.includes('animal') || lowerTopic.includes('dog') || lowerTopic.includes('cat')) {
      return 'from-emerald-500/20 to-green-500/20 hover:from-emerald-500/40 hover:to-green-500/40';
    }
    
    if (lowerTopic.includes('dinosaur') || lowerTopic.includes('prehistoric')) {
      return 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/40 hover:to-orange-500/40';
    }
    
    // Default rotation through colors
    const colors = [
      'from-pink-500/20 to-purple-500/20 hover:from-pink-500/40 hover:to-purple-500/40',
      'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40',
      'from-amber-500/20 to-orange-500/20 hover:from-amber-500/40 hover:to-orange-500/40',
      'from-emerald-500/20 to-green-500/20 hover:from-emerald-500/40 hover:to-green-500/40'
    ];
    
    return colors[index % colors.length];
  };
  
  // Get icon for topic
  const getTopicIcon = (topic: string) => {
    const lowerTopic = topic.toLowerCase();
    
    if (lowerTopic.includes('planet') || lowerTopic.includes('space') || lowerTopic.includes('star')) {
      return <Rocket className="h-5 w-5 text-indigo-300" />;
    }
    
    if (lowerTopic.includes('animal') || lowerTopic.includes('dog') || lowerTopic.includes('cat')) {
      return <Map className="h-5 w-5 text-emerald-300" />;
    }
    
    if (lowerTopic.includes('dinosaur')) {
      return <Trophy className="h-5 w-5 text-amber-300" />;
    }
    
    if (lowerTopic.includes('science') || lowerTopic.includes('experiment')) {
      return <Brain className="h-5 w-5 text-blue-300" />;
    }
    
    return <Lightbulb className="h-5 w-5 text-wonderwhiz-gold" />;
  };

  return (
    <div className="py-6">
      {/* Hero section with greeting */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {getTimeBasedGreeting()}, {childProfile?.name || 'Explorer'}!
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What would you like to learn today?
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StreakDisplay
              streakDays={childProfile?.streak_days || 0}
              showBadgesOnly={false}
            />
            
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
              <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
              <SparksBalance
                childId={profileId || ''}
                initialBalance={childProfile?.sparks_balance || 0}
                size="sm"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Search section */}
      <motion.section 
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative mb-6"
        >
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you curious about? (e.g., Why is the sky blue?)"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50 placeholder:text-white/50 text-lg"
          />
          <Button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-white rounded-xl hover:opacity-90 transition-opacity"
            disabled={!searchQuery.trim()}
          >
            Explore
          </Button>
        </form>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <Button
            variant={!selectedCategory ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap ${!selectedCategory ? 'bg-wonderwhiz-gold text-white' : 'text-white'}`}
          >
            <Star className="h-4 w-4 mr-1.5" />
            All Topics
          </Button>
          <Button
            variant={selectedCategory === 'space' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(selectedCategory === 'space' ? null : 'space')}
            className={`whitespace-nowrap ${selectedCategory === 'space' ? 'bg-indigo-500 text-white' : 'text-white'}`}
          >
            <Rocket className="h-4 w-4 mr-1.5" />
            Space
          </Button>
          <Button
            variant={selectedCategory === 'animals' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(selectedCategory === 'animals' ? null : 'animals')}
            className={`whitespace-nowrap ${selectedCategory === 'animals' ? 'bg-emerald-500 text-white' : 'text-white'}`}
          >
            <Map className="h-4 w-4 mr-1.5" />
            Animals
          </Button>
          <Button
            variant={selectedCategory === 'science' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(selectedCategory === 'science' ? null : 'science')}
            className={`whitespace-nowrap ${selectedCategory === 'science' ? 'bg-blue-500 text-white' : 'text-white'}`}
          >
            <Brain className="h-4 w-4 mr-1.5" />
            Science
          </Button>
        </div>
      </motion.section>
      
      {/* Main content tabs */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="w-full mb-6 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-xl">
            <TabsTrigger 
              value="explore" 
              className="flex-1 data-[state=active]:bg-wonderwhiz-gradient data-[state=active]:text-white text-white/70"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore
            </TabsTrigger>
            <TabsTrigger 
              value="journey" 
              className="flex-1 data-[state=active]:bg-wonderwhiz-gradient data-[state=active]:text-white text-white/70"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              My Journey
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="flex-1 data-[state=active]:bg-wonderwhiz-gradient data-[state=active]:text-white text-white/70"
            >
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>
          
          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                  Wonder Topics
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefreshSuggestions}
                  disabled={isLoadingSuggestions}
                  className="text-white hover:text-wonderwhiz-gold"
                >
                  <motion.div 
                    animate={isLoadingSuggestions ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                  </motion.div>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getTopicsByCategory(selectedCategory).length > 0 ? (
                  getTopicsByCategory(selectedCategory).map((topic, index) => (
                    <motion.div 
                      key={`${topic}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index % 8) }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestionClick(topic)}
                      className={`bg-gradient-to-br ${getTopicColor(topic, index)} 
                                border border-white/20 rounded-xl p-4 cursor-pointer 
                                transition-all duration-300 group overflow-hidden relative`}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5"
                        animate={{ 
                          background: ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0)"] 
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          {getTopicIcon(topic)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-lg mb-1 line-clamp-2">{topic}</h3>
                          <div className="flex items-center text-white/60 text-xs">
                            <Sparkles className="w-3 h-3 mr-1 text-wonderwhiz-gold" />
                            <span>Tap to explore</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-white/70">
                    <Lightbulb className="h-10 w-10 mx-auto mb-3 text-wonderwhiz-gold opacity-50" />
                    <p className="text-lg">No topics found for this category.</p>
                    <p className="text-sm text-white/50 mt-1">Try changing the category or refreshing.</p>
                  </div>
                )}
              </div>
              
              {/* Tasks preview */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-wonderwhiz-gold mr-2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Daily Tasks
                </h2>
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-4">
                    <ChildTaskList childId={profileId || ''} maxTasks={3} />
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 text-white border-wonderwhiz-gold/50 hover:bg-wonderwhiz-gold/10"
                      onClick={() => {
                        const rewardsTab = document.querySelector('[data-state="rewards"]') as HTMLElement;
                        if (rewardsTab) rewardsTab.click();
                      }}
                    >
                      <Gift className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                      See All Tasks & Rewards
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                Your Learning Journey
              </h2>
              
              {pastCurios && pastCurios.length > 0 ? (
                <div className="space-y-4">
                  {/* Learning streak visualization */}
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-3">Your Learning Streak</h3>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const isActive = (childProfile?.streak_days || 0) > i;
                          const day = getDayName(i);
                          return (
                            <div key={i} className="flex flex-col items-center">
                              <motion.div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center 
                                          ${isActive ? 'bg-wonderwhiz-gold' : 'bg-white/10'}`}
                                whileHover={{ scale: 1.1 }}
                                initial={isActive ? { scale: 0 } : {}}
                                animate={isActive ? { scale: 1 } : {}}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                              >
                                <Star className={`h-6 w-6 ${isActive ? 'text-black' : 'text-white/30'}`} />
                              </motion.div>
                              <span className="text-xs mt-1 text-white/70">{day}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {childProfile?.streak_days ? (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-white/70">
                            You've been learning for <span className="text-wonderwhiz-gold font-bold">{childProfile.streak_days} days</span> in a row!
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-white/70">
                            Start your learning streak today!
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                  
                  {/* Past explorations */}
                  <h3 className="text-lg font-medium text-white mb-2 mt-6">Your Past Explorations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastCurios.slice(0, 6).map((curio, index) => (
                      <motion.div
                        key={curio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index % 6) }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/curio/${profileId}/${curio.id}`)}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer overflow-hidden group"
                      >
                        <motion.div 
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            {getTopicIcon(curio.title || curio.query)}
                          </div>
                          <div>
                            <h3 className="text-white font-medium line-clamp-2 mb-1">
                              {curio.title || curio.query}
                            </h3>
                            <p className="text-white/50 text-xs">
                              {format(new Date(curio.created_at), 'MMMM d')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {pastCurios.length > 6 && (
                    <div className="flex justify-center mt-4">
                      <Button variant="outline" className="text-white border-white/20">
                        View All Explorations
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-8 text-center">
                    <Rocket className="h-12 w-12 mx-auto mb-4 text-white/30" />
                    <h3 className="text-xl font-medium text-white mb-2">No Explorations Yet</h3>
                    <p className="text-white/70 mb-6">Start your learning adventure by exploring a topic!</p>
                    <Button 
                      className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-white"
                      onClick={() => {
                        const exploreTab = document.querySelector('[data-state="explore"]') as HTMLElement;
                        if (exploreTab) exploreTab.click();
                      }}
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Start Exploring
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center mb-4">
                <Gift className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                Tasks & Rewards
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sparks summary card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                      Your Sparks
                    </h3>
                    
                    <div className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 p-5 rounded-lg border border-white/10 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-white">
                          <p className="text-sm text-white/70">Total Sparks</p>
                          <div className="flex items-center">
                            <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                            <span className="text-2xl font-bold">{childProfile?.sparks_balance || 0}</span>
                          </div>
                        </div>
                        
                        <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                          <motion.div
                            animate={{ 
                              rotate: 360,
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              rotate: { repeat: Infinity, duration: 10 },
                              scale: { repeat: Infinity, duration: 2 }
                            }}
                            className="h-12 w-12 text-wonderwhiz-gold"
                          >
                            <Star className="h-12 w-12" />
                          </motion.div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-white/70 mb-2">Sparks Progress</p>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min(100, (childProfile?.sparks_balance || 0) / 2)}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-white/60">
                          <span>0</span>
                          <span>100</span>
                          <span>200</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Ways to Earn Sparks:</h4>
                      {[
                        { icon: <BookOpen className="h-4 w-4" />, text: "Complete daily explorations", value: "+5" },
                        { icon: <Brain className="h-4 w-4" />, text: "Answer quiz questions correctly", value: "+2" },
                        { icon: <Star className="h-4 w-4" />, text: "Keep your learning streak", value: "+3/day" },
                        { icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>, text: "Complete learning tasks", value: "+10" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center mr-3 text-wonderwhiz-gold">
                              {item.icon}
                            </div>
                            <span className="text-white">{item.text}</span>
                          </div>
                          <span className="text-wonderwhiz-gold font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
                
                {/* Tasks card */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-wonderwhiz-gold mr-2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                      Your Learning Tasks
                    </h3>
                    
                    <div className="h-[380px] overflow-y-auto pr-1">
                      <ChildTaskList childId={profileId || ''} />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </div>
  );
};

// Helper functions
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getDayName = (index: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  const dayIndex = (today - 6 + index) % 7;
  return days[dayIndex < 0 ? dayIndex + 7 : dayIndex];
};

export default WonderfulDashboard;
