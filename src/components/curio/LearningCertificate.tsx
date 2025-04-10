
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
  // Render different certificate styles based on age group
  const getCertificateStyle = () => {
    if (ageGroup === '5-7') {
      return {
        mainBg: 'from-pink-500/20 to-yellow-500/20',
        titleColor: 'text-yellow-300',
        textSize: 'text-lg',
        borderColor: 'border-yellow-500/30',
        iconColor: 'text-yellow-400'
      };
    } else if (ageGroup === '8-11') {
      return {
        mainBg: 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-cyan/20',
        titleColor: 'text-wonderwhiz-bright-pink',
        textSize: 'text-xl',
        borderColor: 'border-wonderwhiz-bright-pink/30',
        iconColor: 'text-wonderwhiz-bright-pink'
      };
    } else {
      return {
        mainBg: 'from-blue-600/20 to-purple-600/20',
        titleColor: 'text-blue-400',
        textSize: 'text-xl',
        borderColor: 'border-blue-500/30',
        iconColor: 'text-blue-400'
      };
    }
  };
  
  const style = getCertificateStyle();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 mb-10"
    >
      <div className={`
        relative overflow-hidden rounded-xl border-2 ${style.borderColor}
        bg-gradient-to-br ${style.mainBg} backdrop-blur-md
        p-8 text-center
      `}>
        {/* Background decoration elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-1/3 translate-y-1/3" />
        
        {/* Certificate content */}
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className={`h-16 w-16 rounded-full ${style.iconColor} flex items-center justify-center`}>
              <Award className="h-10 w-10" />
            </div>
          </div>
          
          <h4 className={`uppercase tracking-widest text-white/70 text-sm mb-1`}>Certificate of Achievement</h4>
          <h2 className={`${style.titleColor} ${style.textSize} font-bold mb-6 font-nunito`}>Wonders Explorer</h2>
          
          <p className="text-white/80 mb-2">This certifies that</p>
          <h3 className="text-white text-2xl font-bold mb-2 font-nunito">{learnerName}</h3>
          <p className="text-white/80 mb-6">
            has successfully completed an exploration of
            <span className="block font-semibold text-lg mt-1">{topic}</span>
          </p>
          
          <div className="border-t border-white/20 pt-4 mt-4">
            <p className="text-white/70 text-sm">{date}</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center mt-4 gap-3">
        <Button variant="outline" size="sm" onClick={onDownload} className="text-white/80 border-white/20">
          <Download className="h-4 w-4 mr-2" />
          <span>Download</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onShare} className="text-white/80 border-white/20">
          <Share2 className="h-4 w-4 mr-2" />
          <span>Share</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningCertificate;
