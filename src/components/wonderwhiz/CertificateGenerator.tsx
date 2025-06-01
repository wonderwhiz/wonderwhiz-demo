
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LearningTopic } from '@/types/wonderwhiz';

interface CertificateGeneratorProps {
  topic: LearningTopic;
  childProfile: any;
  onCertificateGenerated: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  topic,
  childProfile,
  onCertificateGenerated
}) => {
  const [childName, setChildName] = useState(childProfile?.name || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const handleGenerateCertificate = async () => {
    if (!childName.trim()) return;

    setIsGenerating(true);
    
    // Simulate certificate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCertificateGenerated(true);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    onCertificateGenerated();
  };

  if (certificateGenerated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30 p-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Certificate Ready!
          </h2>
          <p className="text-white/80 mb-6">
            Congratulations {childName}! You've mastered {topic.title}!
          </p>
          
          {/* Mock certificate preview */}
          <div className="bg-white rounded-lg p-6 mb-6 mx-auto max-w-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">🌟 Certificate of Achievement 🌟</div>
              <p className="text-gray-600 mb-4">This certifies that</p>
              <div className="text-xl font-bold text-wonderwhiz-deep-purple mb-4">{childName}</div>
              <p className="text-gray-600 mb-4">has successfully completed</p>
              <div className="text-lg font-semibold text-gray-800 mb-4">"{topic.title}"</div>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="border-yellow-400/30 text-white hover:bg-yellow-400/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
            >
              Continue Learning! 
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">
            Time for Your Certificate! 🏆
          </h2>
          <p className="text-white/80">
            You've completed all sections and passed the quiz! Let's create your personalized certificate.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2 font-medium">
              What name should appear on your certificate?
            </label>
            <Input
              type="text"
              placeholder="Enter your name..."
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-wonderwhiz-bright-pink"
            />
          </div>

          <Button
            onClick={handleGenerateCertificate}
            disabled={!childName.trim() || isGenerating}
            className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 py-6 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating Your Certificate...
              </>
            ) : (
              <>
                <Award className="h-5 w-5 mr-2" />
                Generate My Certificate!
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              🎨 Creating a beautiful certificate just for you...
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CertificateGenerator;
