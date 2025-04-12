
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2 } from 'lucide-react';
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
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return 'from-emerald-700/20 to-sky-700/20 border-emerald-500/30';
      case '12-16':
        return 'from-purple-800/20 to-indigo-800/20 border-purple-500/30';
      default: // 8-11
        return 'from-indigo-800/20 to-purple-800/20 border-indigo-500/30';
    }
  };
  
  const gradientStyle = getAgeGroupStyles();
  
  return (
    <motion.div 
      className={`mb-8 p-6 rounded-lg border border-white/20 bg-gradient-to-r ${gradientStyle} backdrop-blur-sm`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="text-center mb-4">
        <motion.div
          className="inline-block"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Award className="h-12 w-12 text-wonderwhiz-gold mx-auto mb-2" />
        </motion.div>
        <h2 className="text-white font-bold text-xl sm:text-2xl">Certificate of Completion</h2>
        <p className="text-white/70 text-sm">Awarded for completing this learning journey</p>
      </div>
      
      <div className="py-4 px-6 bg-white/5 rounded-lg border border-white/10 mb-6">
        <p className="text-center text-white/80 text-sm mb-4">This certifies that</p>
        <h3 className="text-center text-white text-xl font-bold mb-4 font-nunito">{learnerName}</h3>
        <p className="text-center text-white/80 text-sm mb-3">has successfully explored and learned about</p>
        <p className="text-center text-wonderwhiz-bright-pink font-semibold mb-4">{topic}</p>
        <div className="h-px w-32 bg-white/20 mx-auto mb-4"></div>
        <p className="text-center text-white/60 text-xs">{date}</p>
      </div>
      
      <div className="flex justify-center gap-3 flex-wrap">
        <Button 
          onClick={onDownload}
          variant="outline"
          className="border-indigo-500/30 bg-indigo-500/10 text-white hover:bg-indigo-500/20 text-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
        
        <Button 
          onClick={onShare}
          variant="outline"
          className="border-purple-500/30 bg-purple-500/10 text-white hover:bg-purple-500/20 text-sm"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Achievement
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningCertificate;
