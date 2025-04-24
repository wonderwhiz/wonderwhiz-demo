
import { ContentBlock } from '@/types/curio';
import { similarity } from './textSimilarity';

// Increased from 0.8 to provide more sensitivity to catch subtle duplicates
const SIMILARITY_THRESHOLD = 0.7;

// Specialized thresholds for specific content types
const TYPE_SPECIFIC_THRESHOLDS = {
  fact: 0.65,
  funFact: 0.65,
  quiz: 0.7,
  flashcard: 0.75,
  creative: 0.8,
  mindfulness: 0.8
};

// Get more comprehensive content from a block for better comparisons
export const getBlockMainContent = (block: ContentBlock): string => {
  if (!block.content) return '';
  
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return `${block.content.title || ''} ${block.content.fact || ''} ${block.content.text || ''}`.trim();
    case 'quiz':
      return `${block.content.question || ''} ${(block.content.options || []).join(' ')} ${block.content.explanation || ''}`.trim();
    case 'flashcard':
      return `${block.content.front || ''} ${block.content.back || ''}`.trim();
    case 'creative':
      return `${block.content.prompt || ''} ${block.content.description || ''}`.trim();
    case 'mindfulness':
      return `${block.content.title || ''} ${block.content.instruction || ''}`.trim();
    case 'activity':
      return `${block.content.title || ''} ${block.content.instruction || ''}`.trim();
    case 'riddle':
      return `${block.content.question || ''} ${block.content.answer || ''}`.trim();
    default:
      // Extract any text or textual properties from the content
      const contentObj = block.content || {};
      return Object.values(contentObj)
        .filter(value => typeof value === 'string')
        .join(' ');
  }
};

export const isContentDuplicate = (
  newBlock: ContentBlock,
  existingBlocks: ContentBlock[]
): boolean => {
  // Skip similarity check for interactive blocks if needed
  if (['creative', 'mindfulness'].includes(newBlock.type) && Math.random() > 0.5) {
    return false; // Allow more variety in these types
  }

  // Get the appropriate threshold for this content type
  const threshold = TYPE_SPECIFIC_THRESHOLDS[newBlock.type as keyof typeof TYPE_SPECIFIC_THRESHOLDS] || SIMILARITY_THRESHOLD;
  
  for (const block of existingBlocks) {
    // First quick check - if types are different, they're not duplicates
    if (block.type !== newBlock.type) continue;
    
    // Avoid checking against self (if block has same ID)
    if (block.id === newBlock.id) continue;

    // Extract main content from both blocks for comparison
    const existingContent = getBlockMainContent(block);
    const newContent = getBlockMainContent(newBlock);
    
    // Skip if either content is too short for meaningful comparison
    if (existingContent.length < 10 || newContent.length < 10) continue;
    
    // Check similarity score against threshold
    const similarityScore = similarity(existingContent, newContent);
    if (similarityScore > threshold) {
      console.log(`Duplicate content detected (${similarityScore.toFixed(2)}): ${newBlock.type}`);
      return true;
    }
  }
  
  return false;
};

// Improved validation for rabbit hole questions to ensure they're relevant and unique
export const validateRabbitHoles = (
  question: string,
  originalQuery: string,
  existingQuestions: string[]
): boolean => {
  // Normalize strings for comparison
  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedQuery = originalQuery.toLowerCase().trim();
  
  // Reject if question is too similar to original query
  if (similarity(normalizedQuestion, normalizedQuery) > 0.85) {
    return false;
  }
  
  // Reject if question is too short
  if (normalizedQuestion.split(' ').length < 4) {
    return false;
  }
  
  // Reject if it's a duplicate of existing questions
  return !existingQuestions.some(
    existing => similarity(normalizedQuestion, existing.toLowerCase().trim()) > 0.75
  );
};

// New function to generate diverse follow-up questions based on a topic
export const generateDiverseRabbitHoles = (
  topic: string,
  existingQuestions: string[] = []
): string[] => {
  const questionTemplates = [
    `How does ${topic} impact our daily lives?`,
    `What's the history behind ${topic}?`,
    `Why is ${topic} important to understand?`,
    `How do scientists study ${topic}?`,
    `What are some surprising facts about ${topic}?`,
    `How might ${topic} change in the future?`,
    `How does ${topic} connect to other subjects?`,
    `What would happen if ${topic} didn't exist?`
  ];
  
  // Filter out questions that are too similar to existing ones
  const diverseQuestions = questionTemplates.filter(question => 
    !existingQuestions.some(existing => 
      similarity(question.toLowerCase(), existing.toLowerCase()) > 0.75
    )
  );
  
  // Shuffle and return a subset
  return diverseQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
};
