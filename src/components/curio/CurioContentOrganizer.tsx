
import React, { useMemo } from 'react';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { isContentDuplicate, getBlockMainContent } from '@/utils/contentValidation';

interface CurioContentOrganizerProps {
  blocks: ContentBlockType[];
  childAge?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  children?: (organizedBlocks: ContentBlockType[]) => React.ReactNode;
}

const CurioContentOrganizer: React.FC<CurioContentOrganizerProps> = ({ 
  blocks,
  childAge = 8,
  timeOfDay = 'afternoon',
  children
}) => {
  const organizedBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) return [];
    
    // Step 1: Deep clone the blocks to avoid mutation issues
    const blocksCopy = JSON.parse(JSON.stringify(blocks)) as ContentBlockType[];
    
    // Step 2: Filter out duplicates using our enhanced similarity detection
    let uniqueBlocks = blocksCopy.filter((block, index, self) => {
      // Check for duplicates using content similarity with blocks that came before
      const previousBlocks = self.slice(0, index);
      return !isContentDuplicate(block, previousBlocks);
    });
    
    // Step 3: Ensure we start with a direct answer (fact block) to address the question
    const firstFactIndex = uniqueBlocks.findIndex(block => 
      block.type === 'fact' || block.type === 'funFact'
    );
    
    if (firstFactIndex > 0) {
      const firstFact = uniqueBlocks[firstFactIndex];
      uniqueBlocks.splice(firstFactIndex, 1);
      uniqueBlocks.unshift(firstFact);
    }
    
    // Step 4: Distribute block types for better content flow
    uniqueBlocks = distributeBlockTypes(uniqueBlocks);
    
    // Step 5: Apply age-appropriate sequencing
    if (childAge <= 7) {
      uniqueBlocks = limitBlocksForYoungChildren(uniqueBlocks);
    }
    
    // Step 6: Add spacing between similar content
    uniqueBlocks = addSpacingBetweenSimilarContent(uniqueBlocks);
    
    // Step 7: Apply time-of-day optimizations
    uniqueBlocks = applyTimeOfDayOptimizations(uniqueBlocks, timeOfDay);
    
    return uniqueBlocks;
  }, [blocks, childAge, timeOfDay]);
  
  return children ? children(organizedBlocks) : null;
};

function distributeBlockTypes(blocks: ContentBlockType[]): ContentBlockType[] {
  const result: ContentBlockType[] = [];
  const typeGroups: Record<string, ContentBlockType[]> = {};
  
  // Group blocks by type
  blocks.forEach(block => {
    if (!typeGroups[block.type]) {
      typeGroups[block.type] = [];
    }
    typeGroups[block.type].push(block);
  });
  
  // Create a type sequence that ensures good distribution
  // Start with a fact/funFact, then alternate between interactive and informative blocks
  const preferredSequence = [
    'fact', 'quiz', 'funFact', 'flashcard', 'creative', 'mindfulness', 'activity'
  ];
  
  // First ensure we have a fact block to start with if available
  if (typeGroups['fact'] && typeGroups['fact'].length > 0) {
    result.push(typeGroups['fact'].shift()!);
  } else if (typeGroups['funFact'] && typeGroups['funFact'].length > 0) {
    result.push(typeGroups['funFact'].shift()!);
  }
  
  // Then distribute blocks according to preferred sequence until all are assigned
  while (Object.values(typeGroups).some(group => group.length > 0)) {
    for (const type of preferredSequence) {
      if (typeGroups[type] && typeGroups[type].length > 0) {
        result.push(typeGroups[type].shift()!);
        break; // Move to the next iteration after adding one block
      }
    }
    
    // If we couldn't add a block from the preferred sequence,
    // add one from any available type
    if (result.length === blocks.length - Object.values(typeGroups).flat().length) {
      for (const type of Object.keys(typeGroups)) {
        if (typeGroups[type].length > 0) {
          result.push(typeGroups[type].shift()!);
          break;
        }
      }
    }
  }
  
  return result;
}

function limitBlocksForYoungChildren(blocks: ContentBlockType[]): ContentBlockType[] {
  // Keep first fact block and limit total blocks
  const firstBlock = blocks[0];
  const remainingBlocks = blocks.slice(1);
  
  // Prioritize visual and interactive content for young children
  const visualBlocks = remainingBlocks.filter(block => 
    ['creative', 'activity', 'flashcard'].includes(block.type)
  );
  
  const otherBlocks = remainingBlocks.filter(block => 
    !['creative', 'activity', 'flashcard'].includes(block.type)
  );
  
  // For young children, use this sequence: fact → visual → quiz → other
  // And limit to 6 total blocks maximum
  return [
    firstBlock, 
    ...visualBlocks,
    ...otherBlocks.filter(block => block.type === 'quiz'),
    ...otherBlocks.filter(block => block.type !== 'quiz')
  ].slice(0, 6);
}

function addSpacingBetweenSimilarContent(blocks: ContentBlockType[]): ContentBlockType[] {
  const result: ContentBlockType[] = [];
  let lastBlockType: string | null = null;
  
  // Create a set of blocks we've already added
  const addedBlockIds = new Set<string>();
  
  for (const block of blocks) {
    // Skip if already added
    if (addedBlockIds.has(block.id)) continue;
    
    if (block.type === lastBlockType) {
      // Find a different block type to insert between similar blocks
      const spacerBlock = blocks.find(b => 
        b.type !== lastBlockType && !addedBlockIds.has(b.id)
      );
      
      if (spacerBlock) {
        result.push(spacerBlock);
        addedBlockIds.add(spacerBlock.id);
        lastBlockType = spacerBlock.type;
      }
    }
    
    result.push(block);
    addedBlockIds.add(block.id);
    lastBlockType = block.type;
  }
  
  return result;
}

function applyTimeOfDayOptimizations(
  blocks: ContentBlockType[], 
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): ContentBlockType[] {
  let optimizedBlocks = [...blocks];
  
  if (timeOfDay === 'morning') {
    // In the morning, start with facts and quizzes to engage the brain
    const quizBlocks = optimizedBlocks.filter(block => block.type === 'quiz');
    const nonQuizBlocks = optimizedBlocks.filter(block => block.type !== 'quiz');
    
    if (quizBlocks.length > 0) {
      // Place quiz blocks strategically throughout the sequence
      optimizedBlocks = [nonQuizBlocks[0]]; // Start with first block (usually a fact)
      
      // Distribute quiz blocks evenly
      for (let i = 0; i < quizBlocks.length; i++) {
        const targetPosition = Math.min(1 + i, nonQuizBlocks.length - 1);
        optimizedBlocks.push(quizBlocks[i]);
        
        if (targetPosition + 1 < nonQuizBlocks.length) {
          optimizedBlocks.push(nonQuizBlocks[targetPosition + 1]);
        }
      }
      
      // Add remaining non-quiz blocks
      for (let i = 1; i < nonQuizBlocks.length; i++) {
        if (!optimizedBlocks.includes(nonQuizBlocks[i])) {
          optimizedBlocks.push(nonQuizBlocks[i]);
        }
      }
    }
  } else if (timeOfDay === 'evening') {
    // In the evening, emphasize creative and mindfulness activities
    const creativeBlocks = optimizedBlocks.filter(
      block => block.type === 'creative' || block.type === 'mindfulness'
    );
    const quizBlocks = optimizedBlocks.filter(block => block.type === 'quiz');
    const otherBlocks = optimizedBlocks.filter(
      block => block.type !== 'creative' && block.type !== 'mindfulness' && block.type !== 'quiz'
    );
    
    // Create a sequence prioritizing calming content later in the sequence
    const sequence = [];
    if (otherBlocks.length > 0) sequence.push(otherBlocks[0]); // Start with a fact
    
    // Add other blocks
    for (let i = 1; i < otherBlocks.length; i++) {
      sequence.push(otherBlocks[i]);
    }
    
    // Add quiz blocks
    quizBlocks.forEach(block => sequence.push(block));
    
    // Add creative blocks at the end
    creativeBlocks.forEach(block => sequence.push(block));
    
    optimizedBlocks = sequence;
  }
  
  return optimizedBlocks;
}

export default CurioContentOrganizer;

export const useContentOrganizer = (
  blocks: ContentBlockType[],
  childAge = 8,
  timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon'
): { organizedBlocks: ContentBlockType[] } => {
  // Reuse the same organization logic
  const organizedBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) return [];
    
    // Deep clone to avoid mutation issues
    let sequencedBlocks = JSON.parse(JSON.stringify(blocks)) as ContentBlockType[];
    
    // Remove any duplicates using our enhanced similarity detection
    sequencedBlocks = sequencedBlocks.filter((block, index, self) => {
      // Check for duplicates using content similarity with blocks that came before
      const previousBlocks = self.slice(0, index);
      return !isContentDuplicate(block, previousBlocks);
    });
    
    // Start with a fact/funFact to directly answer the question
    const firstFactIndex = sequencedBlocks.findIndex(block => 
      block.type === 'fact' || block.type === 'funFact'
    );
    
    if (firstFactIndex > 0) {
      const firstFact = sequencedBlocks[firstFactIndex];
      sequencedBlocks.splice(firstFactIndex, 1);
      sequencedBlocks.unshift(firstFact);
    }
    
    // Apply time of day optimizations
    if (timeOfDay === 'morning') {
      sequencedBlocks = applyMorningOptimization(sequencedBlocks);
    } else if (timeOfDay === 'evening') {
      sequencedBlocks = applyEveningOptimization(sequencedBlocks);
    }
    
    // Apply age-appropriate sequencing
    if (childAge <= 7) {
      sequencedBlocks = applyYoungChildOptimization(sequencedBlocks);
    }
    
    // Avoid consecutive blocks of same type
    sequencedBlocks = avoidConsecutiveSameTypes(sequencedBlocks);
    
    // Ensure reflective block near the end
    sequencedBlocks = positionReflectiveBlockNearEnd(sequencedBlocks);
    
    return sequencedBlocks;
  }, [blocks, childAge, timeOfDay]);
  
  return { organizedBlocks };
};

// Helper functions for useContentOrganizer
function applyMorningOptimization(blocks: ContentBlockType[]): ContentBlockType[] {
  const quizBlocks = blocks.filter(block => block.type === 'quiz');
  const nonQuizBlocks = blocks.filter(block => block.type !== 'quiz');
  
  if (quizBlocks.length === 0) return blocks;
  
  const result = [nonQuizBlocks[0]]; // Start with first block (usually a fact)
  
  // Strategically place quiz blocks
  for (let i = 0; i < quizBlocks.length; i++) {
    const targetPosition = Math.min(1 + i * 2, nonQuizBlocks.length);
    
    // Add non-quiz blocks up to target position
    for (let j = result.length; j < targetPosition && j < nonQuizBlocks.length; j++) {
      result.push(nonQuizBlocks[j]);
    }
    
    // Add the quiz block
    result.push(quizBlocks[i]);
  }
  
  // Add any remaining non-quiz blocks
  for (let i = 1; i < nonQuizBlocks.length; i++) {
    if (!result.includes(nonQuizBlocks[i])) {
      result.push(nonQuizBlocks[i]);
    }
  }
  
  return result;
}

function applyEveningOptimization(blocks: ContentBlockType[]): ContentBlockType[] {
  const creativeBlocks = blocks.filter(
    block => block.type === 'creative' || block.type === 'mindfulness'
  );
  const otherBlocks = blocks.filter(
    block => block.type !== 'creative' && block.type !== 'mindfulness'
  );
  
  if (creativeBlocks.length === 0) return blocks;
  
  // In evening, start with a few informative blocks, then transition to creative/mindfulness
  const result = [];
  
  // Always start with the first block (usually a fact)
  if (otherBlocks.length > 0) {
    result.push(otherBlocks[0]);
  }
  
  // Add 1-2 more informative blocks
  for (let i = 1; i < Math.min(3, otherBlocks.length); i++) {
    result.push(otherBlocks[i]);
  }
  
  // Add creative/mindfulness blocks
  creativeBlocks.forEach(block => result.push(block));
  
  // Add remaining informative blocks
  for (let i = 3; i < otherBlocks.length; i++) {
    result.push(otherBlocks[i]);
  }
  
  return result;
}

function applyYoungChildOptimization(blocks: ContentBlockType[]): ContentBlockType[] {
  // For young children: concrete → visual → interactive → abstract
  const startingFact = blocks[0]; // Keep the first block (usually a fact)
  
  const concreteBlocks = blocks.filter(
    block => block.type === 'fact' || block.type === 'funFact' || block.type === 'activity'
  ).filter(block => block !== startingFact);
  
  const visualBlocks = blocks.filter(
    block => block.type === 'flashcard' || block.type === 'creative'
  );
  
  const abstractBlocks = blocks.filter(
    block => !concreteBlocks.includes(block) && 
             !visualBlocks.includes(block) &&
             block !== startingFact
  );
  
  // Create sequence and limit to 6 blocks for young attention spans
  return [
    startingFact,
    ...concreteBlocks,
    ...visualBlocks,
    ...abstractBlocks
  ].slice(0, 6);
}

function avoidConsecutiveSameTypes(blocks: ContentBlockType[]): ContentBlockType[] {
  const result = [blocks[0]]; // Start with first block
  
  for (let i = 1; i < blocks.length; i++) {
    // If this block has the same type as the previous one
    if (blocks[i].type === result[result.length - 1].type) {
      // Try to find a different block type to insert
      let inserted = false;
      for (let j = i + 1; j < blocks.length; j++) {
        if (blocks[j].type !== result[result.length - 1].type) {
          result.push(blocks[j]);
          
          // Remove the block we just inserted from its original position
          blocks = [...blocks.slice(0, j), ...blocks.slice(j + 1)];
          
          inserted = true;
          break;
        }
      }
      
      // If we couldn't find a different type, just add the current block
      if (!inserted) {
        result.push(blocks[i]);
      }
    } else {
      // Different type from previous, so just add it
      result.push(blocks[i]);
    }
  }
  
  return result;
}

function positionReflectiveBlockNearEnd(blocks: ContentBlockType[]): ContentBlockType[] {
  const reflectiveBlockIndex = blocks.findIndex(
    block => block.type === 'mindfulness' || block.type === 'creative'
  );
  
  // If there's a reflective block and it's not already near the end
  if (reflectiveBlockIndex !== -1 && reflectiveBlockIndex < blocks.length - 3) {
    const reflectiveBlock = blocks[reflectiveBlockIndex];
    const result = [
      ...blocks.slice(0, reflectiveBlockIndex),
      ...blocks.slice(reflectiveBlockIndex + 1)
    ];
    
    // Position it as the second-to-last block
    result.splice(result.length - 1, 0, reflectiveBlock);
    return result;
  }
  
  return blocks;
}
