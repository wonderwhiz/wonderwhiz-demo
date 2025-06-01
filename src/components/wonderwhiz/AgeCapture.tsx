
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AgeCaptureProps {
  initialAge: number;
  onAgeConfirm: (age: number) => void;
}

const AgeCapture: React.FC<AgeCaptureProps> = ({ initialAge, onAgeConfirm }) => {
  const [selectedAge, setSelectedAge] = useState([initialAge]);

  const getAgeMessage = (age: number) => {
    if (age <= 6) return "Perfect! We'll make everything super fun and visual! 🎨";
    if (age <= 9) return "Great! We'll add cool facts and interactive elements! 🚀";
    if (age <= 12) return "Awesome! We'll include detailed explanations and amazing discoveries! 🔬";
    return "Excellent! We'll dive deep into fascinating details and complex concepts! 🧠";
  };

  const getEmoji = (age: number) => {
    if (age <= 6) return "🧸";
    if (age <= 9) return "🎲";
    if (age <= 12) return "🎯";
    return "🏆";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getEmoji(selectedAge[0])}</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            How old is our curious learner?
          </h2>
          <p className="text-white/80">
            This helps us customize the content perfectly for maximum understanding and fun! 🎉
          </p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-wonderwhiz-bright-pink mb-2">
              {selectedAge[0]} years old
            </div>
            
            <div className="px-6">
              <Slider
                value={selectedAge}
                onValueChange={setSelectedAge}
                max={16}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-sm mt-2">
                <span>5 years</span>
                <span>16 years</span>
              </div>
            </div>
          </div>

          <motion.div
            key={selectedAge[0]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-wonderwhiz-bright-pink/20 rounded-lg p-4 text-center"
          >
            <Users className="h-6 w-6 text-wonderwhiz-bright-pink mx-auto mb-2" />
            <p className="text-white font-medium">
              {getAgeMessage(selectedAge[0])}
            </p>
          </motion.div>

          <Button
            onClick={() => onAgeConfirm(selectedAge[0])}
            size="lg"
            className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-bold text-lg py-6"
          >
            Let's Start Learning! 
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            💡 Our content adapts to different learning styles and developmental stages
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default AgeCapture;
