
import { ContentBlock } from '@/types/curio';

type NarrativeTheme = 'space' | 'nature' | 'science' | 'history' | 'arts' | 'technology' | 'general';

export const getNarrativeTheme = (blocks: ContentBlock[]): NarrativeTheme => {
  if (!blocks || blocks.length === 0) return 'general';
  
  // Count specialist occurrences to determine dominant theme
  const specialistCounts = blocks.reduce((acc, block) => {
    const specialistId = block.specialist_id || '';
    acc[specialistId] = (acc[specialistId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find most frequent specialist
  let maxCount = 0;
  let dominantSpecialist = '';
  
  Object.entries(specialistCounts).forEach(([specialist, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantSpecialist = specialist;
    }
  });
  
  // Map specialist to theme
  switch(dominantSpecialist) {
    case 'nova': return 'space';
    case 'lotus': return 'nature';
    case 'prism': return 'science';
    case 'atlas': return 'history';
    case 'spark': return 'arts';
    case 'pixel': return 'technology';
    default: return 'general';
  }
};

export const getThemeColor = (theme: NarrativeTheme): string => {
  switch(theme) {
    case 'space': return 'from-indigo-500 to-purple-600';
    case 'nature': return 'from-emerald-500 to-green-600';
    case 'science': return 'from-cyan-500 to-blue-600';
    case 'history': return 'from-amber-500 to-orange-600';
    case 'arts': return 'from-pink-500 to-rose-600';
    case 'technology': return 'from-blue-500 to-violet-600';
    default: return 'from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow';
  }
};

// Add the missing function exports

/**
 * Determine the position of a block in the narrative sequence
 */
export const getSequencePosition = (
  sequencePosition: number, 
  totalBlocks: number
): 'beginning' | 'middle' | 'end' => {
  if (sequencePosition === 0) return 'beginning';
  if (sequencePosition >= totalBlocks - 1) return 'end';
  return 'middle';
};

/**
 * Determine if a wonder prompt should be shown for a block
 */
export const shouldShowWonderPrompt = (
  blockType: string,
  narrativePosition: 'beginning' | 'middle' | 'end',
  specialistId: string,
  sequencePosition: number
): boolean => {
  // Show wonder prompts for fact blocks
  if (blockType === 'fact' || blockType === 'funFact') {
    // Show more wonder prompts at the end of sequences
    if (narrativePosition === 'end') return true;
    
    // Show some wonder prompts in the middle, but not for every block
    if (narrativePosition === 'middle') {
      // Show for blocks by certain specialists more often
      if (['nova', 'prism', 'atlas'].includes(specialistId)) {
        return sequencePosition % 2 === 0; // Every other block
      }
      return sequencePosition % 3 === 0; // Every third block for others
    }
    
    // Show fewer wonder prompts at the beginning to not overwhelm
    return false;
  }
  
  // For quizzes, occasionally show wonder prompts to encourage deeper thinking
  if (blockType === 'quiz') {
    return narrativePosition === 'end';
  }
  
  // For creative blocks, show wonder prompts to inspire more creativity
  if (blockType === 'creative') {
    return true;
  }
  
  // Default: don't show for other block types
  return false;
};

/**
 * Determine if a plot twist element should be shown
 */
export const shouldShowPlotTwist = (
  blockType: string,
  narrativePosition: 'beginning' | 'middle' | 'end',
  specialistId: string,
  hasSurpriseElement: boolean
): boolean => {
  // Only show if the block has surprise content
  if (!hasSurpriseElement) return false;
  
  // Always show surprise elements for fact blocks
  if (blockType === 'fact' || blockType === 'funFact') {
    return true;
  }
  
  // For certain specialists, show more plot twists
  if (['nova', 'atlas'].includes(specialistId)) {
    return narrativePosition !== 'beginning'; // Not at the very start
  }
  
  // Default: don't show for other block types
  return false;
};
