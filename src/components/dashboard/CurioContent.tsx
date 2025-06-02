
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurioContentProps {
  currentCurio: any;
  contentBlocks: any[];
  blockReplies: any;
  isGenerating: boolean;
  loadingBlocks: boolean;
  visibleBlocksCount: number;
  profileId?: string;
  onLoadMore: () => void;
  hasMoreBlocks: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (query: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
  generationError?: string | null;
  playText: (text: string) => void;
  childAge: number;
  triggerGeneration: () => void;
}

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  profileId,
}) => {
  const navigate = useNavigate();

  const handleOpenEncyclopedia = () => {
    if (profileId) {
      navigate(`/wonderwhiz/${profileId}`);
    }
  };

  return (
    <div className="p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <Book className="h-16 w-16 text-wonderwhiz-bright-pink mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentCurio ? currentCurio.title : 'Ready to Learn Something Amazing?'}
          </h2>
          <p className="text-white/80 mb-6">
            {currentCurio 
              ? 'Your question is ready to be explored in our interactive encyclopedia format!'
              : 'Ask any question and watch it come to life in our magical encyclopedia!'
            }
          </p>
        </div>

        <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-purple-500/20 border-wonderwhiz-bright-pink/30 p-8 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-wonderwhiz-bright-pink" />
            <h3 className="text-xl font-bold text-white">Encyclopedia Mode</h3>
            <Sparkles className="h-6 w-6 text-wonderwhiz-bright-pink" />
          </div>
          <p className="text-white/90 mb-6">
            Experience your questions through our new interactive encyclopedia! 
            Complete with age-appropriate sections, quizzes, certificates, and printable activities.
          </p>
          
          <Button
            onClick={handleOpenEncyclopedia}
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-bold px-8 py-3 text-lg"
          >
            <Book className="h-5 w-5 mr-2" />
            Open Encyclopedia
          </Button>
        </Card>

        <div className="text-center">
          <p className="text-white/70 text-sm">
            🎓 Award-winning educational format • 🏆 Designed by learning experts
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CurioContent;
