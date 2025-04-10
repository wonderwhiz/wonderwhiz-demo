
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearningCertificateProps {
  learnerName: string;
  topic: string;
  date: string;
  onDownload: () => void;
  onShare: () => void;
  ageGroup: '5-7' | '8-11' | '12-16';
}

const LearningCertificate: React.FC<LearningCertificateProps> = ({
  learnerName,
  topic,
  date,
  onDownload,
  onShare,
  ageGroup
}) => {
  // Generate different certificate styles based on age group
  const getCertificateStyle = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          border: "border-4 border-dashed",
          colors: "from-wonderwhiz-vibrant-yellow via-wonderwhiz-bright-pink to-wonderwhiz-cyan",
          fontSize: "text-xl sm:text-2xl",
          decorations: true,
          iconSize: "w-8 h-8 sm:w-10 sm:h-10"
        };
      case '12-16':
        return {
          border: "border-2",
          colors: "from-indigo-500 to-blue-600",
          fontSize: "text-lg sm:text-xl",
          decorations: false,
          iconSize: "w-5 h-5 sm:w-6 sm:h-6"
        };
      default: // 8-11
        return {
          border: "border-3",
          colors: "from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow",
          fontSize: "text-xl sm:text-2xl",
          decorations: true,
          iconSize: "w-6 h-6 sm:w-8 sm:h-8"
        };
    }
  };
  
  const style = getCertificateStyle();

  // Animation variants for the stars
  const starVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="mb-12 mt-8"
    >
      <div className={`relative bg-white/5 backdrop-blur-md ${style.border} border-gradient-to-r ${style.colors} rounded-lg p-6 sm:p-8 max-w-xl mx-auto`}>
        {/* Decorative elements */}
        {style.decorations && (
          <>
            <motion.div
              className="absolute -top-3 -right-3 text-wonderwhiz-vibrant-yellow"
              variants={starVariants}
              animate="animate"
            >
              <Sparkles className={style.iconSize} />
            </motion.div>
            <motion.div
              className="absolute -bottom-3 -left-3 text-wonderwhiz-bright-pink"
              variants={starVariants}
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              <Sparkles className={style.iconSize} />
            </motion.div>
          </>
        )}
        
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow p-3 rounded-full">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-wonderwhiz-deep-purple" />
            </div>
          </div>
          
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-2">Certificate of Achievement</h2>
          
          <div className="my-6">
            <p className="text-white/70 text-sm sm:text-base">This certifies that</p>
            <h3 className={`text-white font-bold ${style.fontSize} my-2`}>{learnerName}</h3>
            <p className="text-white/70 text-sm sm:text-base">has successfully completed the exploration of</p>
            <h4 className="text-white font-semibold text-lg sm:text-xl my-2">{topic}</h4>
            <p className="text-white/50 text-xs sm:text-sm mt-4">Completed on {date}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Button
              onClick={onDownload}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningCertificate;
