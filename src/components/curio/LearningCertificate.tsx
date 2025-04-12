
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const getCertificateStyle = () => {
    if (ageGroup === '5-7') {
      return {
        container: "p-6 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-2 border-wonderwhiz-gold/50",
        header: "text-2xl font-bold",
        title: "text-xl font-semibold"
      };
    } else if (ageGroup === '8-11') {
      return {
        container: "p-5 rounded-lg bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-wonderwhiz-gold/40",
        header: "text-xl font-bold",
        title: "text-lg font-semibold"
      };
    } else {
      return {
        container: "p-4 rounded-md bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-wonderwhiz-gold/30",
        header: "text-lg font-bold",
        title: "text-base font-semibold"
      };
    }
  };
  
  const style = getCertificateStyle();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="my-12"
    >
      <Card className={style.container}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Award className="h-12 w-12 text-wonderwhiz-gold" />
          </div>
          <h2 className={`${style.header} text-wonderwhiz-gold mb-1`}>Certificate of Exploration</h2>
          <p className="text-white/60 text-sm">For completing a wonderful learning journey</p>
        </div>
        
        <div className="text-center border-t border-b border-white/10 py-6 mb-6">
          <p className="text-white/70 mb-2">This certifies that</p>
          <h3 className="text-wonderwhiz-bright-pink text-xl font-bold mb-4">{learnerName}</h3>
          <p className="text-white/70 mb-2">has explored and discovered</p>
          <h4 className={`${style.title} text-wonderwhiz-vibrant-yellow mb-4`}>{topic}</h4>
          <p className="text-white/70 text-sm">on {date}</p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button 
            variant="outline" 
            onClick={onDownload}
            className="border-wonderwhiz-gold/30 text-wonderwhiz-gold hover:bg-wonderwhiz-gold/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            onClick={onShare}
            className="border-wonderwhiz-bright-pink/30 text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default LearningCertificate;
