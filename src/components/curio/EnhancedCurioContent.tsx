import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, Share2, VolumeIcon, Brain, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import FireflyQuizBlock from './FireflyQuizBlock';
import MindfulnessBlock from './MindfulnessBlock';
import CreativeBlock from './CreativeBlock';
import EnhancedSearchBar from './EnhancedSearchBar';

interface SpecialistBlockProps {
  specialistId: string;
  content: string;
  followupQuestions?: string[];
  onRabbitHoleClick?: (question: string) => void;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: () => void;
  onReadAloud?: () => void;
  childAge?: number;
}

const SpecialistBlock: React.FC<SpecialistBlockProps> = ({
  specialistId,
  content,
  followupQuestions = [],
  onRabbitHoleClick,
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  childAge = 10
}) => {
  const specialist = getSpecialistInfo(specialistId);
  const [showReplyInput, setShowReplyInput] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-light-purple/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-bright-pink/5 to-wonderwhiz-cyan/5 pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex items-start gap-4 mb-5">
            <Avatar className="h-12 w-12 rounded-2xl border-2 border-white/10 ring-2 ring-wonderwhiz-bright-pink/20 shadow-glow-brand-pink">
              <AvatarImage src={specialist.avatar} />
              <AvatarFallback className={specialist.fallbackColor}>
                {specialist.fallbackInitial}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-nunito">{specialist.name}</h3>
                <div className={`h-2 w-2 rounded-full animate-pulse ${
                  specialistId === 'nova' ? 'bg-wonderwhiz-bright-pink' :
                  specialistId === 'spark' ? 'bg-wonderwhiz-vibrant-yellow' :
                  'bg-wonderwhiz-cyan'
                }`} />
              </div>
              <p className="text-sm text-white/70 font-inter">{specialist.title}</p>
            </div>
          </div>

          <div className="text-white font-inter leading-relaxed mb-6">
            {content}
          </div>

          {followupQuestions.length > 0 && (
            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium text-white/70 mb-3 font-nunito">
                {childAge < 8 ? "Let's explore more!" : "Explore further..."}
              </p>
              <div className="grid gap-2">
                {followupQuestions.map((question, idx) => (
                  <motion.button
                    key={idx}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group"
                    onClick={() => onRabbitHoleClick?.(question)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-wonderwhiz-bright-pink/10 text-wonderwhiz-bright-pink">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-white group-hover:text-wonderwhiz-bright-pink transition-colors">
                        {question}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="text-white/70 hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10"
              >
                <Heart className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Like</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                className="text-white/70 hover:text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10"
              >
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span className="font-medium">Save</span>
              </Button>

              {onReadAloud && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReadAloud}
                  className="text-white/70 hover:text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10"
                >
                  <VolumeIcon className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">
                    {childAge && childAge < 8 ? "Read to me" : "Listen"}
                  </span>
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className={`text-white/70 hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10 ${
                showReplyInput ? 'bg-wonderwhiz-bright-pink/10 text-wonderwhiz-bright-pink' : ''
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="font-medium">Reply</span>
            </Button>
          </div>

          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={childAge && childAge < 8 ? "What do you think?" : "Share your thoughts..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50 font-inter resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReplyInput(false)}
                      className="text-white/70"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={onReply}
                      disabled={!replyText.trim()}
                      className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

interface EnhancedCurioContentProps {
  title: string;
  blocks: any[];
  onSearch: (query: string) => void;
  onVoiceCapture?: (transcript: string) => void;
  onImageCapture?: (file: File) => void;
  onLike?: (blockId: string) => void;
  onBookmark?: (blockId: string) => void;
  onReply?: (blockId: string, message: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  onExplore?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  childAge?: number;
}

const getSpecialistInfo = (specialistId: string) => {
  const specialists = {
    nova: {
      name: 'Nova',
      title: 'Space Expert',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      name: 'Spark',
      title: 'Creative Genius',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      name: 'Prism',
      title: 'Science Wizard',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    whizzy: {
      name: 'Whizzy',
      title: 'Assistant',
      avatar: '/specialists/whizzy-avatar.png',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'W',
    },
  };

  return specialists[specialistId as keyof typeof specialists] || specialists.whizzy;
};

const EnhancedCurioContent: React.FC<EnhancedCurioContentProps> = ({
  title,
  blocks,
  onSearch,
  onVoiceCapture,
  onImageCapture,
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  onExplore,
  onRabbitHoleClick,
  childAge = 10
}) => {
  // Example blocks for the design
  const exampleBlocks = [
    {
      id: '1',
      type: 'fact',
      specialist_id: 'nova',
      content: {
        fact: "Fireflies, also known as lightning bugs, produce light through a chemical reaction in their bodies. They have a specialized light organ in their abdomen that uses a molecule called luciferin to produce light.",
        rabbitHoles: [
          "How do fireflies use their light to communicate?",
          "What is the purpose of fireflies' bioluminescence?"
        ]
      }
    },
    {
      id: '2',
      type: 'funFact',
      specialist_id: 'spark',
      content: {
        fact: "Did you know that fireflies can flash their lights in a specific pattern to signal to potential mates? It's like a secret language!"
      }
    },
    {
      id: '3',
      type: 'quiz',
      specialist_id: 'prism',
      content: {
        question: "What is the main source of light for fireflies?",
        options: [
          "The sun",
          "The moon",
          "A chemical reaction in their bodies",
          "Electricity"
        ],
        correctIndex: 2,
        explanation: "Fireflies produce light through a process called bioluminescence, which is a chemical reaction in their bodies that produces light without generating heat."
      }
    },
    {
      id: '4',
      type: 'quiz',
      specialist_id: 'prism',
      content: {
        question: "What is the name of the molecule that helps fireflies produce light?",
        options: [
          "Luciferase",
          "Luciferin",
          "Oxygen",
          "Enzyme"
        ],
        correctIndex: 1,
        explanation: "Luciferin is the molecule that produces light when it reacts with the enzyme luciferase in the presence of oxygen."
      }
    },
    {
      id: '5',
      type: 'mindfulness',
      specialist_id: 'spark',
      content: {
        title: "Firefly Light Meditation",
        instruction: "Find a quiet and comfortable place to sit. Close your eyes and imagine you are a firefly. Visualize your light organ glowing softly. As you breathe in, imagine fresh air filling your light organ and making it shine brighter. As you breathe out, imagine any worries or stress leaving your body. Continue for 3 minutes.",
        duration: 180,
        benefit: "This meditation helps calm the mind and reduce stress by focusing on breathing and visualization."
      }
    },
    {
      id: '6',
      type: 'creative',
      specialist_id: 'spark',
      content: {
        prompt: "Use your imagination to explore How do fireflies make light? in a creative way.",
        examples: [
          "Draw a picture",
          "Write a story",
          "Make a model"
        ]
      }
    }
  ];
  
  // Use provided blocks or example blocks
  const displayBlocks = blocks.length > 0 ? blocks : exampleBlocks;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <div className="sticky top-0 z-40 bg-gradient-to-b from-indigo-950/95 to-indigo-950/90 backdrop-blur-sm py-4 px-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">{title}</h1>
          <EnhancedSearchBar 
            onSearch={onSearch}
            onVoiceCapture={onVoiceCapture}
            onImageCapture={onImageCapture}
            onExplore={onExplore}
            childAge={childAge}
          />
        </div>
      </div>
      
      <main className="flex-grow py-6">
        <div className="max-w-3xl mx-auto px-4">
          {displayBlocks.map((block) => {
            if (block.type === 'quiz') {
              return (
                <FireflyQuizBlock
                  key={block.id}
                  question={block.content.question}
                  options={block.content.options}
                  correctIndex={block.content.correctIndex}
                  explanation={block.content.explanation}
                  childAge={childAge}
                />
              );
            } else if (block.type === 'mindfulness') {
              return (
                <MindfulnessBlock
                  key={block.id}
                  title={block.content.title}
                  instructions={block.content.instruction}
                  duration={block.content.duration}
                  benefit={block.content.benefit}
                  childAge={childAge}
                />
              );
            } else if (block.type === 'creative') {
              return (
                <CreativeBlock
                  key={block.id}
                  prompt={block.content.prompt}
                  examples={block.content.examples}
                  specialistId={block.specialist_id}
                  childAge={childAge}
                />
              );
            } else {
              // For fact and funFact blocks
              const content = block.content?.fact || block.content?.text || '';
              const followupQuestions = block.content?.rabbitHoles || [];
              
              return (
                <SpecialistBlock
                  key={block.id}
                  specialistId={block.specialist_id}
                  content={content}
                  followupQuestions={followupQuestions}
                  onRabbitHoleClick={onRabbitHoleClick}
                  onLike={() => onLike && onLike(block.id)}
                  onBookmark={() => onBookmark && onBookmark(block.id)}
                  onReply={() => onReply && onReply(block.id, 'Great explanation!')}
                  onReadAloud={() => onReadAloud && onReadAloud(content, block.specialist_id)}
                  childAge={childAge}
                />
              );
            }
          })}
        </div>
      </main>
    </div>
  );
};

export default EnhancedCurioContent;
