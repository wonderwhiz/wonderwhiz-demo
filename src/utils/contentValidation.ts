
import { ContentBlock } from '@/types/curio';

/**
 * Checks if content is similar to previously generated content
 */
export function isContentDuplicate(block: ContentBlock, previousBlocks: ContentBlock[]): boolean {
  if (!block?.content || !previousBlocks?.length) {
    return false;
  }

  const mainContent = getBlockMainContent(block);
  if (!mainContent) return false;

  return previousBlocks.some(prevBlock => {
    const prevContent = getBlockMainContent(prevBlock);
    if (!prevContent) return false;
    
    // Check for exact matches first
    if (mainContent === prevContent) return true;
    
    // Then check for high similarity (more than 80% match)
    return calculateSimilarity(mainContent, prevContent) > 0.8;
  });
}

/**
 * Gets the main text content from a content block, regardless of block type
 */
export function getBlockMainContent(block: ContentBlock): string | null {
  if (!block?.content) return null;

  // Extract content based on block type
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return block.content.fact || block.content.text || null;
    case 'quiz':
      return block.content.question || null;
    case 'flashcard':
      return `${block.content.front} ${block.content.back}` || null;
    case 'creative':
      return block.content.prompt || block.content.description || null;
    case 'task':
      return block.content.task || null;
    case 'riddle':
      return block.content.riddle || null;
    case 'activity':
      return block.content.activity || block.content.instructions || null;
    case 'mindfulness':
      return block.content.exercise || block.content.instruction || null;
    case 'news':
      return block.content.headline || block.content.body || block.content.summary || null;
    default:
      // For other types, try to find any text content
      const content = block.content;
      return (
        content.text ||
        content.fact ||
        content.description ||
        content.question ||
        content.body ||
        content.headline ||
        content.prompt ||
        content.task ||
        content.instruction ||
        null
      );
  }
}

/**
 * Calculate string similarity using Levenshtein distance
 * Returns a value between 0 (completely different) and 1 (identical)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  // Calculate Levenshtein distance
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  
  // Convert to similarity percentage
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // Initialize matrix of size (m+1) x (n+1)
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Base cases: empty string to string transformations
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
}
