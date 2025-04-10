
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface LearningCertificateProps {
  learnerName: string;
  topic: string;
  date: string;
  onDownload?: () => void;
  onShare?: () => void;
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
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // Launch confetti when certificate appears
  useEffect(() => {
    if (certificateRef.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5BA3', '#00E2FF', '#FFD54F', '#00D68F'],
      });
    }
  }, []);
  
  // Certificate styling based on age group
  const getCertificateStyle = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          borderColor: 'border-wonderwhiz-vibrant-yellow',
          bgGradient: 'from-wonderwhiz-vibrant-yellow/10 to-wonderwhiz-bright-pink/5',
          accentColor: 'text-wonderwhiz-vibrant-yellow'
        };
      case '8-11':
        return {
          borderColor: 'border-wonderwhiz-bright-pink',
          bgGradient: 'from-wonderwhiz-bright-pink/10 to-wonderwhiz-cyan/5',
          accentColor: 'text-wonderwhiz-bright-pink'
        };
      case '12-16':
        return {
          borderColor: 'border-wonderwhiz-cyan',
          bgGradient: 'from-wonderwhiz-cyan/10 to-wonderwhiz-deep-purple/5',
          accentColor: 'text-wonderwhiz-cyan'
        };
      default:
        return {
          borderColor: 'border-wonderwhiz-vibrant-yellow',
          bgGradient: 'from-wonderwhiz-vibrant-yellow/10 to-wonderwhiz-bright-pink/5',
          accentColor: 'text-wonderwhiz-vibrant-yellow'
        };
    }
  };
  
  const { borderColor, bgGradient, accentColor } = getCertificateStyle();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-10 mt-6"
      ref={certificateRef}
    >
      <div className={cn(
        "p-8 border-4 rounded-xl bg-gradient-to-br shadow-lg",
        borderColor,
        bgGradient
      )}>
        <div className="relative">
          {/* Stars in background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Star className="h-4 w-4 text-white/20" />
              </motion.div>
            ))}
          </div>
          
          {/* Certificate content */}
          <div className="text-center relative z-10">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="font-nunito font-bold text-2xl sm:text-3xl text-white mb-1">Certificate of Achievement</h2>
            <p className={cn("text-sm mb-6", accentColor)}>For completing the Wonder Whiz learning journey</p>
            
            <div className="my-6 py-4 border-t border-b border-white/10">
              <p className="text-white/70 text-sm mb-2">This certificate is proudly presented to</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{learnerName}</h3>
              <p className="text-white/70 text-sm">for exploring and mastering</p>
              <p className="text-lg sm:text-xl font-semibold text-white mt-1">{topic}</p>
            </div>
            
            <p className="text-white/60 text-sm mt-6">Completed on {date}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDownload}
          className="bg-white/5 border-white/20 text-white hover:bg-white/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShare}
          className="bg-white/5 border-white/20 text-white hover:bg-white/10"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningCertificate;
