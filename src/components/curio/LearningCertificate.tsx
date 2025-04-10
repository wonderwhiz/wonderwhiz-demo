
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LearningCertificateProps {
  learnerName: string;
  topic: string;
  date: string;
  onDownload: () => void;
  onShare: () => void;
  ageGroup?: '5-7' | '8-11' | '12-16';
}

const LearningCertificate: React.FC<LearningCertificateProps> = ({
  learnerName,
  topic,
  date,
  onDownload,
  onShare,
  ageGroup = '8-11'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-12"
    >
      <Card className="relative p-8 border-2 border-indigo-500/30 overflow-hidden bg-gradient-to-b from-indigo-950/80 to-purple-950/80 backdrop-blur-lg">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/certificate-bg.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative text-center z-10">
          <div className="flex justify-center mb-6">
            <Award className="h-16 w-16 text-yellow-400" />
          </div>
          
          <h2 className={`text-white font-bold mb-2 ${ageGroup === '5-7' ? 'text-3xl' : 'text-2xl'}`}>
            Certificate of Exploration
          </h2>
          
          <p className="text-white/80 mb-6">This certificate is proudly presented to</p>
          
          <h3 className={`font-bold text-white mb-6 ${ageGroup === '5-7' ? 'text-4xl' : 'text-2xl'}`}>
            {learnerName}
          </h3>
          
          <p className="text-white/80 mb-3">for successfully exploring the wonders of</p>
          
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg inline-block mb-6">
            <h4 className={`font-semibold text-white ${ageGroup === '5-7' ? 'text-xl' : 'text-lg'}`}>
              {topic}
            </h4>
          </div>
          
          <p className="text-white/60 mb-8">Awarded on {date}</p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={onDownload} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={onShare} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LearningCertificate;
