
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
