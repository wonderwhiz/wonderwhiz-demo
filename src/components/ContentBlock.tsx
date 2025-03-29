
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, BookmarkPlus, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import SpecialistAvatar, { SPECIALISTS } from '@/components/SpecialistAvatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ConfettiTrigger from '@/components/ConfettiTrigger';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export interface ContentBlockProps {
  block: {
    id: string;
    type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
    specialist_id: string;
    content: any;
    liked: boolean;
    bookmarked: boolean;
  };
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ 
  block, 
  onToggleLike, 
  onToggleBookmark,
  onReply,
  onSetQuery
}) => {
  const [reply, setReply] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(block.type === 'mindfulness' ? block.content.duration : 30);
  const [uploadHover, setUploadHover] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  let content;
  switch (block.type) {
    case 'fact':
    case 'funFact':
      content = (
        <div className="space-y-3">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {block.content.fact}
          </motion.p>
          {block.content.rabbitHoles && (
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-sm font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-blue" /> 
                Want to know more?
              </p>
              <div className="flex flex-col space-y-2">
                {block.content.rabbitHoles.map((question: string, idx: number) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-102 transition-all"
                          onClick={() => {
                            toast("Great question! Finding the answer...", {
                              icon: "🔍",
                            });
                            onSetQuery(question);
                          }}
                        >
                          {question}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Click to explore this!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      );
      break;
    
    case 'quiz':
      const [selectedOption, setSelectedOption] = useState<number | null>(null);
      const [showAnswer, setShowAnswer] = useState(false);
      
      content = (
        <div className="space-y-4">
          <motion.p 
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {block.content.question}
          </motion.p>
          <div className="space-y-2">
            {block.content.options.map((option: string, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Button
                  variant={showAnswer 
                    ? (idx === block.content.correctIndex ? "default" : "outline")
                    : (selectedOption === idx ? "secondary" : "outline")
                  }
                  className={`justify-start w-full ${
                    showAnswer && idx === block.content.correctIndex 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  } ${
                    !showAnswer ? "hover:scale-102 transition-all" : ""
                  } ${
                    showAnswer && idx === block.content.correctIndex ? "pulse-border" : ""
                  }`}
                  onClick={() => {
                    if (!showAnswer) {
                      setSelectedOption(idx);
                    }
                  }}
                >
                  {showAnswer && idx === block.content.correctIndex && (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-200" />
                  )}
                  {showAnswer && idx !== block.content.correctIndex && selectedOption === idx && (
                    <XCircle className="h-4 w-4 mr-2 text-red-300" />
                  )}
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
          {selectedOption !== null && !showAnswer ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ConfettiTrigger>
                <Button 
                  className="mt-2 bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90 hover:scale-105 transition-all" 
                  onClick={() => setShowAnswer(true)}
                >
                  Check Answer
                </Button>
              </ConfettiTrigger>
            </motion.div>
          ) : null}
          {showAnswer && (
            <motion.div 
              className={`p-3 rounded-lg ${selectedOption === block.content.correctIndex ? "bg-green-600/30" : "bg-amber-600/30"}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {selectedOption === block.content.correctIndex ? (
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-300" />
                  <p className="text-green-300">Correct! ✅</p>
                </div>
              ) : (
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-amber-300" />
                  <p className="text-amber-300">
                    Not quite! The correct answer is: {block.content.options[block.content.correctIndex]}
                  </p>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white/10 border-white/20 hover:bg-white/20 flex items-center"
                onClick={() => {
                  setShowAnswer(false);
                  setSelectedOption(null);
                }}
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Try Again
              </Button>
            </motion.div>
          )}
        </div>
      );
      break;
      
    case 'flashcard':
      content = (
        <motion.div 
          className="flip-card cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-front bg-white/20 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
              <p className="font-medium text-center">{block.content.front}</p>
              <div className="absolute bottom-2 right-2 text-white/40 text-xs">Tap to flip</div>
            </div>
            <div className="flip-card-back bg-white/30 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
              <p className="text-center">{block.content.back}</p>
              <div className="absolute bottom-2 right-2 text-white/40 text-xs">Tap to flip back</div>
            </div>
          </div>
        </motion.div>
      );
      break;
      
    case 'creative':
      content = (
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {block.content.prompt}
          </motion.p>
          <motion.div
            className={`p-6 border-2 border-dashed ${uploadHover ? 'border-wonderwhiz-pink bg-white/10' : 'border-white/30'} rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setUploadHover(true)}
            onMouseLeave={() => setUploadHover(false)}
            onClick={() => toast.success("Great job! Your creation is saved.", {
              icon: "🎨",
            })}
          >
            <Sparkles className={`h-8 w-8 mb-3 ${uploadHover ? 'text-wonderwhiz-pink animate-pulse' : 'text-white/60'}`} />
            <p className={`${uploadHover ? 'text-white' : 'text-white/60'} text-sm text-center`}>
              Tap to upload your {block.content.type}
            </p>
            <p className="text-white/40 text-xs mt-1">
              (You can draw, take a photo, or upload a file!)
            </p>
          </motion.div>
        </div>
      );
      break;
      
    case 'task':
      const [taskComplete, setTaskComplete] = useState(false);
      content = (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${taskComplete ? 'line-through text-white/60' : ''}`}
          >
            {block.content.task}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Switch
              checked={taskComplete}
              onCheckedChange={(checked) => {
                setTaskComplete(checked);
                if (checked) {
                  toast.success(`You earned ${block.content.reward} Sparks!`, {
                    icon: "✨",
                  });
                }
              }}
            />
            <span className="text-sm text-white/70">Mark as completed</span>
          </motion.div>
          
          <ConfettiTrigger>
            <Button 
              className={`space-x-2 ${taskComplete ? 'bg-wonderwhiz-gold hover:bg-wonderwhiz-gold/90' : 'bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90'} hover:scale-105 transition-all`}
              disabled={taskComplete}
              onClick={() => {
                setTaskComplete(true);
                toast.success(`You earned ${block.content.reward} Sparks!`, {
                  icon: "✨",
                });
              }}
            >
              <span>Complete Task</span>
              <Sparkles className="h-4 w-4" />
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs bg-white/20 px-2 py-1 rounded-full"
              >
                +{block.content.reward} Sparks
              </motion.span>
            </Button>
          </ConfettiTrigger>
        </div>
      );
      break;
      
    case 'riddle':
      const [riddleSolved, setRiddleSolved] = useState(false);
      content = (
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {block.content.riddle}
          </motion.p>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 transition-all"
                  onClick={() => !riddleSolved && setRiddleSolved(true)}
                >
                  {riddleSolved ? 'Show Answer' : 'I Give Up! Reveal Answer'}
                </Button>
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-3 bg-white/10 rounded-lg"
              >
                <Sparkles className="h-4 w-4 text-wonderwhiz-gold inline mr-2" />
                {block.content.answer}
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
          {!riddleSolved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-white/50 italic"
            >
              Try to solve it before revealing the answer!
            </motion.div>
          )}
        </div>
      );
      break;
      
    case 'activity':
      const [activityStarted, setActivityStarted] = useState(false);
      content = (
        <div className="space-y-3">
          <motion.p 
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Try This Activity:
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {block.content.activity}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              className={`${activityStarted ? 'bg-green-600 hover:bg-green-700' : 'bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90'} hover:scale-105 transition-all`}
              onClick={() => {
                setActivityStarted(!activityStarted);
                toast(activityStarted ? "Activity paused!" : "Activity started! Have fun!", {
                  icon: activityStarted ? "⏸️" : "🎮",
                });
              }}
            >
              {activityStarted ? 'I\'m Doing It!' : 'Start Activity'}
            </Button>
          </motion.div>
        </div>
      );
      break;
      
    case 'news':
      content = (
        <div className="space-y-3">
          <motion.h3 
            className="text-lg font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {block.content.headline}
          </motion.h3>
          <motion.p 
            className="italic text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {block.content.summary}
          </motion.p>
          <motion.p 
            className="text-xs text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Source: {block.content.source}
          </motion.p>
        </div>
      );
      break;
      
    case 'mindfulness':
      React.useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timerActive && timeRemaining > 0) {
          interval = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1) {
                setTimerActive(false);
                toast.success("Great job completing the mindfulness exercise!", {
                  icon: "🧘‍♂️",
                });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [timerActive, timeRemaining]);

      content = (
        <div className="space-y-3">
          <motion.p 
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Mindfulness Exercise ({block.content.duration} seconds)
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {block.content.exercise}
          </motion.p>
          
          {timerActive ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Time remaining:</span>
                <span className="font-bold text-wonderwhiz-blue">{timeRemaining}s</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-wonderwhiz-blue"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / block.content.duration) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full border-white/20 hover:bg-white/10"
                onClick={() => {
                  setTimerActive(false);
                  setTimeRemaining(block.content.duration);
                  toast("Exercise paused. You can restart anytime!", {
                    icon: "⏸️",
                  });
                }}
              >
                Stop
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 transition-all"
                onClick={() => {
                  setTimerActive(true);
                  toast("Mindfulness exercise started. Take a deep breath...", {
                    icon: "🧘‍♂️",
                  });
                }}
              >
                Start Timer
              </Button>
            </motion.div>
          )}
        </div>
      );
      break;
      
    default:
      content = <p>This content is still loading...</p>;
  }
  
  const handleSubmitReply = () => {
    if (reply.trim()) {
      onReply(block.id, reply);
      setReply('');
      setChatOpen(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-0">
          <div className={`p-3 flex items-center ${block.specialist_id ? SPECIALISTS[block.specialist_id]?.color : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
            <SpecialistAvatar specialistId={block.specialist_id} showName={true} />
          </div>
          <div className="p-4 text-white bg-wonderwhiz-dark">
            {content}
          </div>
          <div className="p-2 bg-wonderwhiz-dark/80 flex justify-end space-x-1 border-t border-white/10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`hover:bg-white/10 ${block.liked ? 'text-red-400' : 'text-white/70'} hover:scale-110 transition-all`}
                    onClick={() => {
                      onToggleLike(block.id);
                      if (!block.liked) {
                        toast("You liked this content!", {
                          icon: "❤️",
                        });
                      }
                    }}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>{block.liked ? 'Unlike this' : 'Like this!'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:bg-white/10 hover:scale-110 transition-all"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat with {SPECIALISTS[block.specialist_id]?.name || 'Wonder Wizard'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DialogContent className="bg-wonderwhiz-dark text-white border-wonderwhiz-purple/30">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <SpecialistAvatar specialistId={block.specialist_id} size="sm" className="mr-2" />
                    <span>Chat with {SPECIALISTS[block.specialist_id]?.name || 'Wonder Wizard'}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-sm text-white/80">
                      {block.type === 'fact' || block.type === 'funFact' 
                        ? block.content.fact 
                        : block.type === 'quiz' 
                          ? block.content.question
                          : 'What would you like to know about this?'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea 
                      placeholder={`Ask ${SPECIALISTS[block.specialist_id]?.name || 'Wonder Wizard'} a question...`}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                    />
                    <Button 
                      onClick={handleSubmitReply} 
                      disabled={!reply.trim()}
                      className="w-full bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 hover:scale-102 transition-all"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`hover:bg-white/10 ${block.bookmarked ? 'text-wonderwhiz-blue' : 'text-white/70'} hover:scale-110 transition-all`}
                    onClick={() => {
                      onToggleBookmark(block.id);
                      if (!block.bookmarked) {
                        toast("Content saved to your bookmarks!", {
                          icon: "📚",
                        });
                      }
                    }}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>{block.bookmarked ? 'Remove bookmark' : 'Save this!'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      <style>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          min-height: 120px;
          cursor: pointer;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .hover\:scale-110:hover {
          transform: scale(1.1);
        }
      `}</style>
    </motion.div>
  );
};

export default ContentBlock;
