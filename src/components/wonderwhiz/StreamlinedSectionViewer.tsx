import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import ContentTypography from '../content-blocks/ContentTypography';

interface StreamlinedSectionViewerProps {
  topic: LearningTopic;
  sectionIndex: number;
  childAge: number;
  onBackToTOC: () => void;
  onNextSection: () => void;
  onPreviousSection: () => void;
  onFinishTopic: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

const StreamlinedSectionViewer: React.FC<StreamlinedSectionViewerProps> = ({
  topic,
  sectionIndex,
  childAge,
  onBackToTOC,
  onNextSection,
  onPreviousSection,
  onFinishTopic,
  isFirstSection,
  isLastSection,
}) => {
  const section = topic.table_of_contents[sectionIndex];
  const isYoungChild = childAge <= 8;

  return (
    <div className="space-y-6">
      {/* Simplified Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBackToTOC}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-white/60 text-sm">
          {sectionIndex + 1} of {topic.table_of_contents.length}
        </div>
      </div>

      {/* Main Content - Reduced visual complexity */}
      <Card className="bg-white/5 border border-white/10 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          {section.title}
        </h2>
        
        {section.image_url && (
          <img
            src={section.image_url}
            alt={section.title}
            className="w-full rounded-lg mb-4"
          />
        )}

        <div className="text-white/90">
          <ContentTypography content={section.content || ''} childAge={childAge} />
        </div>

        {/* Simplified Facts Display */}
        {section.facts && section.facts.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              {isYoungChild ? "Cool Facts! 🌟" : "Key Facts"}
            </h3>
            <ul className="space-y-2">
              {section.facts.map((fact, index) => (
                <li key={index} className="text-white/80 flex items-start gap-2">
                  <span className="text-wonderwhiz-cyan">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Streamlined Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onPreviousSection}
          disabled={isFirstSection}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {!isLastSection ? (
          <Button
            onClick={onNextSection}
            className="bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 text-white font-medium px-6"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onFinishTopic}
            className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/80 text-black font-medium px-6"
          >
            Complete
            <Trophy className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StreamlinedSectionViewer;