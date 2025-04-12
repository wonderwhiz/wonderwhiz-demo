
import React from 'react';
import FactBlock from './FactBlock';
import QuizBlock from './QuizBlock';
import FlashcardBlock from './FlashcardBlock';
import CreativeBlock from './CreativeBlock';
import TaskBlock from './TaskBlock';
import RiddleBlock from './RiddleBlock';
import NewsBlock from './NewsBlock';
import ActivityBlock from './ActivityBlock';
import MindfulnessBlock from './MindfulnessBlock';

interface ContentBlockRendererProps {
  blockType: string;
  blockContent: any;
  specialistId: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  onQuizCorrect?: () => void;
  onNewsRead?: () => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  handleRabbitHoleClick: (question: string) => void;
  uploadFeedback?: string | null;
  updateHeight: (height: number) => void;
  curioId?: string;
}

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  blockType,
  blockContent,
  specialistId,
  narrativePosition,
  expanded,
  setExpanded,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload,
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  handleRabbitHoleClick,
  uploadFeedback,
  updateHeight,
  curioId
}) => {
  switch (blockType) {
    case 'fact':
    case 'funFact':
      return (
        <FactBlock 
          fact={blockContent?.fact || blockContent?.text}
          title={blockContent?.title}
          specialistId={specialistId}
          rabbitHoles={blockContent?.rabbitHoles || []}
          expanded={expanded} 
          setExpanded={setExpanded} 
          textSize={getTextSize(blockType)}
          narrativePosition={narrativePosition}
          onRabbitHoleClick={handleRabbitHoleClick}
          updateHeight={updateHeight}
        />
      );
    case 'quiz':
      return (
        <QuizBlock 
          question={blockContent?.question}
          options={blockContent?.options}
          correctIndex={blockContent?.correctIndex}
          explanation={blockContent?.explanation}
          specialistId={specialistId}
          onQuizCorrect={onQuizCorrect}
          updateHeight={updateHeight}
        />
      );
    case 'flashcard':
      return (
        <FlashcardBlock 
          content={{
            front: blockContent?.front,
            back: blockContent?.back,
            hint: blockContent?.hint
          }}
          specialistId={specialistId}
          updateHeight={updateHeight}
        />
      );
    case 'creative':
      return (
        <CreativeBlock 
          content={{
            prompt: blockContent?.prompt,
            description: blockContent?.description,
            guidelines: blockContent?.guidelines,
            examples: blockContent?.examples || []
          }}
          specialistId={specialistId}
          onCreativeUpload={onCreativeUpload} 
          uploadFeedback={uploadFeedback}
          updateHeight={updateHeight}
          curioId={curioId}
        />
      );
    case 'task':
      return (
        <TaskBlock 
          content={{
            task: blockContent?.task || "",
            reward: blockContent?.reward || "5",
            title: blockContent?.title,
            description: blockContent?.description,
            steps: blockContent?.steps || []
          }}
          specialistId={specialistId}
          onTaskComplete={onTaskComplete || (() => {})}
          updateHeight={updateHeight}
        />
      );
    case 'riddle':
      return (
        <RiddleBlock 
          content={{
            riddle: blockContent?.riddle || blockContent?.question || "",
            answer: blockContent?.answer || "",
            question: blockContent?.question,
            hint: blockContent?.hint
          }}
          specialistId={specialistId}
          updateHeight={updateHeight}
        />
      );
    case 'news':
      return (
        <NewsBlock 
          content={{
            headline: blockContent?.headline,
            summary: blockContent?.summary,
            body: blockContent?.body,
            source: blockContent?.source,
            date: blockContent?.date
          }}
          specialistId={specialistId}
          onNewsRead={onNewsRead || (() => {})}
          updateHeight={updateHeight}
        />
      );
    case 'activity':
      return (
        <ActivityBlock 
          content={{
            activity: blockContent?.activity || blockContent?.title || "",
            title: blockContent?.title,
            instructions: blockContent?.instructions,
            steps: blockContent?.steps || []
          }}
          specialistId={specialistId}
          onActivityComplete={onActivityComplete || (() => {})}
          updateHeight={updateHeight}
        />
      );
    case 'mindfulness':
      return (
        <MindfulnessBlock 
          content={{
            exercise: blockContent?.exercise || blockContent?.title || "",
            duration: blockContent?.duration || 60,
            title: blockContent?.title,
            instruction: blockContent?.instruction
          }}
          specialistId={specialistId}
          onMindfulnessComplete={onMindfulnessComplete || (() => {})}
          updateHeight={updateHeight}
        />
      );
    default:
      return <p className="text-white/70 text-sm">This content type is not supported yet.</p>;
  }
};

// Helper function copied from BlockStyleUtils to avoid circular dependencies
const getTextSize = (type: string): string => {
  switch (type) {
    case 'fact':
      return 'text-sm sm:text-base font-inter leading-relaxed tracking-wide';
    case 'quiz':
      return 'text-base sm:text-lg font-nunito leading-relaxed';
    case 'creative':
      return 'text-sm sm:text-base font-inter leading-relaxed';
    case 'news':
      return 'text-sm sm:text-base font-inter leading-relaxed font-medium';
    default:
      return 'text-sm sm:text-base font-inter leading-relaxed';
  }
};

export default ContentBlockRenderer;
