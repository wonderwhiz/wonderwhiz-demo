import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LearningTopic } from '@/types/wonderwhiz';
import { ArrowRight, ArrowLeft, Home, Volume2, VolumeX, Star } from 'lucide-react';

interface SimpleEncyclopediaProps {
  topic: LearningTopic;
  childAge: number;
  onFinish: () => void;
  onGoHome: () => void;
}

const SimpleEncyclopedia: React.FC<SimpleEncyclopediaProps> = ({
  topic,
  childAge,
  onFinish,
  onGoHome
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const sections = topic.table_of_contents || [];
  const isVeryYoung = childAge <= 8;
  const isLastStep = currentStep >= sections.length - 1;
  const progress = ((currentStep + 1) / sections.length) * 100;

  const currentSection = sections[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onFinish();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleReading = () => {
    setIsReading(!isReading);
    // Here you would integrate with text-to-speech
  };

  const getStepEmoji = (index: number) => {
    const emojis = ['🌟', '🔍', '💡', '🎯', '🚀', '✨', '🏆'];
    return emojis[index % emojis.length];
  };

  if (!currentSection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple flex items-center justify-center p-6">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-white/80 mb-6">Something went wrong with your topic.</p>
          <Button onClick={onGoHome} className="bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple">
      {/* Top Bar with Progress */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={onGoHome}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>

          <div className="flex-1 mx-6">
            <div className="text-center mb-2">
              <span className="text-white/80 text-sm">
                {currentStep + 1} of {sections.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Button
            onClick={toggleReading}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            {isReading ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
                {/* Section Header */}
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">
                    {getStepEmoji(currentStep)}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentSection.title}
                  </h1>
                  {isVeryYoung && (
                    <p className="text-white/80 text-lg">
                      Step {currentStep + 1}: Let&apos;s explore!
                    </p>
                  )}
                </div>

                {/* Image */}
                {currentSection.image_url && (
                  <div className="px-6 mb-6">
                    <motion.img
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={currentSection.image_url}
                      alt={currentSection.title}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/90 text-lg leading-relaxed space-y-4"
                  >
                    {/* Simplified content display */}
                    {currentSection.content && (
                      <div className="bg-white/5 p-6 rounded-2xl">
                        {currentSection.content.split('\n\n').slice(0, isVeryYoung ? 2 : 3).map((paragraph, index) => (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Fun Facts */}
                    {currentSection.facts && currentSection.facts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-wonderwhiz-cyan/20 to-wonderwhiz-bright-pink/20 p-6 rounded-2xl border border-white/20"
                      >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                          {isVeryYoung ? "Cool Facts!" : "Did You Know?"}
                        </h3>
                        <div className="space-y-3">
                          {currentSection.facts.slice(0, isVeryYoung ? 2 : 3).map((fact, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <span className="text-2xl">💫</span>
                              <p className="text-white/90">{fact}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between mt-8"
          >
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-wonderwhiz-cyan scale-125'
                      : index < currentStep
                      ? 'bg-wonderwhiz-vibrant-yellow'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className={`${
                isLastStep
                  ? 'bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/80 text-black'
                  : 'bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 text-white'
              } font-bold px-6`}
            >
              {isLastStep ? (
                <>
                  Finish! 🏆
                </>
              ) : (
                <>
                  {isVeryYoung ? "Next!" : "Continue"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Encouraging Message */}
          {!isLastStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6"
            >
              <p className="text-white/60 text-sm">
                {isVeryYoung 
                  ? "You're doing great! Keep going! 🌟" 
                  : `${sections.length - currentStep - 1} more steps to complete this topic`
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleEncyclopedia;