
import { ContentBlock } from '@/types/curio';
import { similarity } from './textSimilarity';

const SIMILARITY_THRESHOLD = 0.8;

export const isContentDuplicate = (
  newBlock: ContentBlock,
  existingBlocks: ContentBlock[]
): boolean => {
  // Skip similarity check for interactive blocks
  if (['quiz', 'creative', 'mindfulness'].includes(newBlock.type)) {
    return false;
  }

  for (const block of existingBlocks) {
    if (block.type !== newBlock.type) continue;

    const existingContent = getBlockMainContent(block);
    const newContent = getBlockMainContent(newBlock);
    
    if (similarity(existingContent, newContent) > SIMILARITY_THRESHOLD) {
      return true;
    }
  }
  
  return false;
};

const getBlockMainContent = (block: ContentBlock): string => {
  if (!block.content) return '';
  
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return block.content.fact || block.content.text || '';
    case 'quiz':
      return block.content.question || '';
    case 'flashcard':
      return `${block.content.front} ${block.content.back}`;
    case 'creative':
      return block.content.prompt || '';
    case 'mindfulness':
      return block.content.instruction || '';
    default:
      return '';
  }
};

export const validateRabbitHoles = (
  question: string,
  originalQuery: string,
  existingQuestions: string[]
): boolean => {
  // Check if question is too similar to original query
  if (similarity(question.toLowerCase(), originalQuery.toLowerCase()) > 0.9) {
    return false;
  }
  
  // Check if question is too similar to existing questions
  return !existingQuestions.some(
    existing => similarity(question.toLowerCase(), existing.toLowerCase()) > 0.8
  );
};

