
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, Palette, Puzzle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface PrintableActivitiesProps {
  topic: LearningTopic;
  childAge: number;
  onActivitiesComplete: () => void;
}

const PrintableActivities: React.FC<PrintableActivitiesProps> = ({
  topic,
  childAge,
  onActivitiesComplete
}) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const activities = [
    {
      type: 'coloring',
      title: `${topic.title} Coloring Page`,
      description: 'Beautiful illustrations to color and learn',
      icon: Palette,
      suitable: true
    },
    {
      type: 'puzzle',
      title: `${topic.title} Word Search`,
      description: 'Find hidden words related to the topic',
      icon: Puzzle,
      suitable: childAge >= 7
    },
    {
      type: 'worksheet',
      title: `${topic.title} Activity Sheet`,
      description: 'Fun exercises and questions to practice',
      icon: Printer,
      suitable: childAge >= 8
    },
    {
      type: 'maze',
      title: `${topic.title} Adventure Maze`,
      description: 'Navigate through learning challenges',
      icon: Puzzle,
      suitable: childAge >= 6
    }
  ];

  const suitableActivities = activities.filter(activity => activity.suitable);

  const handleGenerateActivity = async (activityType: string) => {
    setSelectedActivity(activityType);
    setIsGenerating(true);
    
    // Simulate activity generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
  };

  const handleContinue = () => {
    onActivitiesComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Printer className="h-12 w-12 text-wonderwhiz-bright-pink mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">
            {childAge <= 8 ? "Fun Activities to Print! 🎨" : "Printable Learning Activities 📚"}
          </h2>
          <p className="text-white/80">
            {childAge <= 8 
              ? "Let's create some fun activities you can print and enjoy offline!"
              : "Generate engaging printable activities to reinforce your learning about this topic."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {suitableActivities.map((activity) => {
            const Icon = activity.icon;
            const isSelected = selectedActivity === activity.type;
            
            return (
              <Card 
                key={activity.type}
                className={`bg-white/10 backdrop-blur-sm border-white/20 p-6 transition-all ${
                  isSelected ? 'ring-2 ring-wonderwhiz-bright-pink' : 'hover:bg-white/15'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-wonderwhiz-bright-pink/20 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-wonderwhiz-bright-pink" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      {activity.description}
                    </p>
                    <Button
                      onClick={() => handleGenerateActivity(activity.type)}
                      disabled={isGenerating}
                      size="sm"
                      className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                    >
                      {isGenerating && isSelected ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        'Generate & Download'
                      )}
                    </Button>
                  </div>
                </div>

                {isSelected && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="bg-white/5 rounded-lg p-4 mb-3">
                      <p className="text-white/80 text-sm mb-2">✅ Activity generated successfully!</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white">
                          <Download className="h-4 w-4 mr-1" />
                          Download PDF
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white">
                          <Printer className="h-4 w-4 mr-1" />
                          Print Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 px-8 py-3"
          >
            {childAge <= 8 ? "Let's Explore More! 🚀" : "Continue to Related Topics →"}
          </Button>
        </div>

        {isGenerating && (
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              🎨 Creating your personalized {selectedActivity} activity...
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PrintableActivities;
