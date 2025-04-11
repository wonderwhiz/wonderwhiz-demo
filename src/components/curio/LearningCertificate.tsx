
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
  const getDesign = () => {
    if (ageGroup === '5-7') {
      return {
        title: "Super Explorer Award",
        bgClass: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-bright-pink/20",
        borderClass: "border-wonderwhiz-vibrant-yellow",
        iconClass: "text-wonderwhiz-vibrant-yellow"
      };
    } else if (ageGroup === '8-11') {
      return {
        title: "Knowledge Explorer Certificate",
        bgClass: "bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-bright-pink/20",
        borderClass: "border-wonderwhiz-cyan",
        iconClass: "text-wonderwhiz-cyan"
      };
    } else {
      return {
        title: "Mastery Certificate",
        bgClass: "bg-gradient-to-br from-purple-500/20 to-wonderwhiz-bright-pink/20",
        borderClass: "border-purple-500",
        iconClass: "text-purple-500"
      };
    }
  };
  
  const design = getDesign();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className={`relative p-6 rounded-xl border-2 ${design.borderClass} ${design.bgClass} text-center`}>
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-wonderwhiz-deep-purple p-2 rounded-full">
          <Award className={`h-8 w-8 ${design.iconClass}`} />
        </div>
        
        <h2 className="mt-4 text-white font-bold text-xl">{design.title}</h2>
        <p className="text-white/80 mt-1">Awarded to</p>
        <h3 className="text-white font-semibold text-2xl my-2">{learnerName}</h3>
        <p className="text-white/80 mb-2">For successfully exploring and learning about:</p>
        <p className="text-white font-medium text-lg mb-3">{topic}</p>
        <p className="text-white/60 text-xs">Awarded on {date}</p>
        
        <div className="flex justify-center space-x-3 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownload}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningCertificate;
