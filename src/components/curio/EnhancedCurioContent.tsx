
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Mic, Camera, Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import SpecialistContentBlock from '@/components/content-blocks/SpecialistContentBlock';
import LearningProgressIndicator from './LearningProgressIndicator';
import LearningStyleBlock from '@/components/content-blocks/LearningStyleBlock';
import EnhancedBlockReplies from '@/components/content-blocks/EnhancedBlockReplies';
import CelebrationSystem from './CelebrationSystem';
import FloatingNavigation from './FloatingNavigation';

interface EnhancedCurioContentProps {
  title: string | null;
  blocks: any[];
  onSearch: (query: string) => void;
  onVoiceCapture?: (transcript: string) => void;
  onImageCapture?: (file: File) => void;
  onBookmark?: (blockId: string) => void;
  onReply?: (blockId: string, message: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  onExplore?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  childAge?: number;
}

const EnhancedCurioContent: React.FC<EnhancedCurioContentProps> = ({
  title,
  blocks,
  onSearch,
  onVoiceCapture,
  onImageCapture,
  onBookmark,
  onReply,
  onReadAloud,
  onExplore,
  onRabbitHoleClick,
  childAge = 10
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | 'logical' | 'social' | 'reading'>('visual');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [viewedBlocks, setViewedBlocks] = useState<string[]>([]);
  const [hasEarnedAchievement, setHasEarnedAchievement] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // First-load celebration effect
  useEffect(() => {
    if (blocks.length > 0) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [blocks.length]);
  
  // Track block views
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute('data-block-id');
            if (blockId) {
              setViewedBlocks(prev => {
                if (!prev.includes(blockId)) {
                  return [...prev, blockId]; 
                }
                return prev;
              });
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    
    document.querySelectorAll('[data-block-id]').forEach(element => {
      observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [blocks]);
  
  // Achievement when all blocks are viewed
  useEffect(() => {
    if (blocks.length > 0 && viewedBlocks.length === blocks.length && !hasEarnedAchievement) {
      const timer = setTimeout(() => {
        setHasEarnedAchievement(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [viewedBlocks.length, blocks.length, hasEarnedAchievement]);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };
  
  const handleStartVoiceCapture = () => {
    if (!onVoiceCapture) return;
    
    setIsRecording(true);
    
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onVoiceCapture(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = () => {
        toast.error("We couldn't hear you. Please try again.");
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
      
      // Auto-stop after 5 seconds if no result
      setTimeout(() => {
        if (isRecording) {
          recognition.stop();
        }
      }, 5000);
    } else {
      toast.error("Voice recognition is not supported in your browser");
      setIsRecording(false);
    }
  };
  
  const handleImageCapture = () => {
    if (!onImageCapture) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        onImageCapture(file);
      }
    };
    input.click();
  };
  
  const handleBlockNavigation = (index: number) => {
    setCurrentBlockIndex(index);
    const blockElement = document.getElementById(`block-${index}`);
    if (blockElement) {
      blockElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const getProgressStage = () => {
    const progress = viewedBlocks.length / Math.max(blocks.length, 1);
    
    if (progress < 0.2) return 'foundational';
    if (progress < 0.4) return 'expansion';
    if (progress < 0.6) return 'connection';
    if (progress < 0.8) return 'application';
    return 'deeper_dive';
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Search panel */}
      <AnimatePresence>
        {showSearchPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-wonderwhiz-deep-purple/90 backdrop-blur-md border border-wonderwhiz-purple/30 rounded-lg p-5 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold text-white mb-4">Search or Ask</h2>
              
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder={childAge <= 8 ? "What do you want to know?" : "Search or ask a question..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-20 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                      setShowSearchPanel(false);
                    }
                  }}
                />
                <div className="absolute right-1 top-1 flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full text-white/70 hover:bg-white/10"
                    onClick={handleStartVoiceCapture}
                    disabled={isRecording}
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? 'text-red-400 animate-pulse' : ''}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full text-white/70 hover:bg-white/10"
                    onClick={handleImageCapture}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-white/80 mb-2">How do you prefer to learn?</h3>
                <div className="grid grid-cols-2 gap-2">
                  <LearningStyleBlock
                    style="visual"
                    title=""
                    description="Learn through images, videos, and seeing"
                    onSelect={() => setSelectedLearningStyle('visual')}
                    selected={selectedLearningStyle === 'visual'}
                    childAge={childAge}
                    className="h-full"
                  />
                  <LearningStyleBlock
                    style="auditory"
                    title=""
                    description="Learn through listening and speaking"
                    onSelect={() => setSelectedLearningStyle('auditory')}
                    selected={selectedLearningStyle === 'auditory'}
                    childAge={childAge}
                    className="h-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <LearningStyleBlock
                    style="kinesthetic"
                    title=""
                    description="Learn by doing hands-on activities"
                    onSelect={() => setSelectedLearningStyle('kinesthetic')}
                    selected={selectedLearningStyle === 'kinesthetic'}
                    childAge={childAge}
                    className="h-full"
                  />
                  <LearningStyleBlock
                    style="logical"
                    title=""
                    description="Learn through reasoning and thinking"
                    onSelect={() => setSelectedLearningStyle('logical')}
                    selected={selectedLearningStyle === 'logical'}
                    childAge={childAge}
                    className="h-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white/100 hover:bg-white/10"
                  onClick={() => setShowSearchPanel(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-wonderwhiz-bright-pink hover:bg-pink-500 text-white"
                  onClick={() => {
                    handleSearch();
                    setShowSearchPanel(false);
                  }}
                >
                  {childAge <= 8 ? "Let's Go!" : "Search"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setShowSearchPanel(true)}
            >
              <Search className="h-4 w-4 mr-1.5" />
              <span>{childAge <= 8 ? "Ask" : "Search"}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={handleStartVoiceCapture}
              disabled={isRecording}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'text-red-400 animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Title */}
        {title && (
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h1>
        )}
        
        {/* Learning Progress */}
        {blocks.length > 0 && (
          <LearningProgressIndicator
            currentStage={getProgressStage() as any}
            viewedBlocks={viewedBlocks.length}
            totalBlocks={blocks.length}
            childAge={childAge}
            onClick={(stage) => {
              toast.info(`${stage} level content`);
            }}
          />
        )}
        
        {/* Content Blocks */}
        <div className="space-y-6">
          {blocks.map((block, index) => (
            <div 
              key={block.id || index} 
              id={`block-${index}`} 
              data-block-id={block.id || `block-${index}`}
            >
              <SpecialistContentBlock
                specialistId={block.specialist_id}
                title={
                  block.content?.title || 
                  block.content?.question || 
                  block.content?.headline || 
                  block.content?.prompt || 
                  ""
                }
                content={
                  <div>
                    {block.content?.fact && <p>{block.content.fact}</p>}
                    {block.content?.text && <p>{block.content.text}</p>}
                    {block.content?.body && <p>{block.content.body}</p>}
                    {block.content?.description && <p>{block.content.description}</p>}
                    
                    {block.content?.options && (
                      <div className="mt-3 space-y-2">
                        {block.content.options.map((option: string, i: number) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    )}
                    
                    {block.content?.steps && (
                      <ol className="mt-2 list-decimal pl-5 space-y-1">
                        {block.content.steps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                }
                contentType={block.type}
                difficultyLevel={(block.content?.difficulty === "hard" ? 3 : block.content?.difficulty === "medium" ? 2 : 1) as 1 | 2 | 3}
                onBookmark={() => onBookmark && onBookmark(block.id)}
                onReply={(message) => onReply && onReply(block.id, message)}
                onReadAloud={() => {
                  const text = block.content?.fact || 
                    block.content?.text || 
                    block.content?.question || 
                    block.content?.headline || 
                    block.content?.body || 
                    block.content?.description || 
                    "";
                  
                  onReadAloud && onReadAloud(text, block.specialist_id);
                }}
                childAge={childAge}
                relatedQuestions={block.content?.rabbitHoles || []}
                onRabbitHoleClick={onRabbitHoleClick}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Navigation */}
      {blocks.length > 3 && (
        <FloatingNavigation
          blocks={blocks}
          currentBlockIndex={currentBlockIndex}
          onNavigate={handleBlockNavigation}
          childAge={childAge}
        />
      )}
      
      {/* Celebrations */}
      {showCelebration && (
        <CelebrationSystem
          milestone="first_block"
          sparksEarned={0}
          childAge={childAge}
        />
      )}
      
      {hasEarnedAchievement && (
        <CelebrationSystem
          achievement={{
            id: "topic_master",
            title: "Topic Master!",
            description: "You've explored this entire topic and learned so much!",
            icon: "trophy",
            color: "#FFB800"
          }}
          childAge={childAge}
          position="center"
          onClose={() => setHasEarnedAchievement(false)}
        />
      )}
    </div>
  );
};

export default EnhancedCurioContent;
