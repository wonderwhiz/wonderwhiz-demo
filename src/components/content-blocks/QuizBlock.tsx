
import React from 'react';
import EnhancedQuizBlock from './EnhancedQuizBlock';
import { QuizBlockProps } from '../content-blocks/interfaces';
import { validateBlock } from '@/types/content-blocks';

// This is a wrapper component to maintain backward compatibility
const QuizBlock: React.FC<QuizBlockProps> = (props) => {
  // Extract all the needed props for the enhanced component
  const {
    question,
    options,
    correctIndex,
    explanation,
    specialistId,
    onLike,
    onBookmark,
    onReply,
    onCorrectAnswer,
    onRabbitHoleClick,
    onQuizCorrect,
    updateHeight,
    childAge,
    blockId
  } = props;
  
  // Generate an ID if not provided
  const id = blockId || `quiz-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <EnhancedQuizBlock
      id={id}
      question={question}
      options={options || []}
      correctIndex={correctIndex || 0}
      explanation={explanation}
      specialistId={specialistId}
      blockId={blockId}
      onLike={onLike}
      onBookmark={onBookmark}
      onReply={onReply}
      onQuizCorrect={onQuizCorrect || onCorrectAnswer}
      onRabbitHoleClick={onRabbitHoleClick}
      updateHeight={updateHeight}
      childAge={childAge}
    />
  );
};

export default QuizBlock;
