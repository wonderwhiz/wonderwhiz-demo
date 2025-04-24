import React, { useMemo } from 'react';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import { isContentDuplicate } from '@/utils/contentValidation';

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
    
    let uniqueBlocks = blocks.filter((block, index, self) => {
      // Check for duplicates using content similarity
      const previousBlocks = self.slice(0, index);
      return !isContentDuplicate(block, previousBlocks);
    });
    
    // Ensure we start with a direct answer (fact block)
    const firstFactIndex = uniqueBlocks.findIndex(block => 
      block.type === 'fact' || block.type === 'funFact'
    );
    
    if (firstFactIndex > 0) {
      const firstFact = uniqueBlocks[firstFactIndex];
      uniqueBlocks.splice(firstFactIndex, 1);
      uniqueBlocks.unshift(firstFact);
    }
    
    // Space out similar block types
    uniqueBlocks = distributeBlockTypes(uniqueBlocks);
    
    // Age-appropriate sequencing
    if (childAge <= 7) {
      uniqueBlocks = limitBlocksForYoungChildren(uniqueBlocks);
    }
    
    // Add spacing between similar content
    uniqueBlocks = addSpacingBetweenSimilarContent(uniqueBlocks);
    
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
  
  // Distribute blocks evenly
  while (Object.values(typeGroups).some(group => group.length > 0)) {
    for (const type of Object.keys(typeGroups)) {
      if (typeGroups[type].length > 0) {
        result.push(typeGroups[type].shift()!);
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
    ['creative', 'activity'].includes(block.type)
  );
  
  const otherBlocks = remainingBlocks.filter(block => 
    !['creative', 'activity'].includes(block.type)
  );
  
  return [firstBlock, ...visualBlocks, ...otherBlocks].slice(0, 6);
}

function addSpacingBetweenSimilarContent(blocks: ContentBlockType[]): ContentBlockType[] {
  const result: ContentBlockType[] = [];
  let lastType: string | null = null;
  
  blocks.forEach(block => {
    if (block.type === lastType) {
      // Find a different block type to insert between similar blocks
      const spacer = blocks.find(b => 
        b.type !== lastType && !result.includes(b)
      );
      
      if (spacer) {
        result.push(spacer);
      }
    }
    
    result.push(block);
    lastType = block.type;
  });
  
  return result;
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
    
    // Create a copy we can manipulate
    let sequencedBlocks = [...blocks];
    
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
      const quizBlocks = sequencedBlocks.filter(block => block.type === 'quiz');
      const nonQuizBlocks = sequencedBlocks.filter(block => block.type !== 'quiz');
      
      if (quizBlocks.length > 0) {
        const preferredPosition = Math.min(2, nonQuizBlocks.length);
        nonQuizBlocks.splice(preferredPosition, 0, quizBlocks[0]);
        
        for (let i = 1; i < quizBlocks.length; i++) {
          const position = Math.min(preferredPosition + (i * 2), nonQuizBlocks.length);
          nonQuizBlocks.splice(position, 0, quizBlocks[i]);
        }
        
        sequencedBlocks = nonQuizBlocks;
      }
    } else if (timeOfDay === 'evening') {
      const creativeBlocks = sequencedBlocks.filter(
        block => block.type === 'creative' || block.type === 'mindfulness'
      );
      const quizBlocks = sequencedBlocks.filter(block => block.type === 'quiz');
      const otherBlocks = sequencedBlocks.filter(
        block => block.type !== 'creative' && block.type !== 'mindfulness' && block.type !== 'quiz'
      );
      
      const sequence = [sequencedBlocks[0]];
      creativeBlocks.forEach(block => sequence.push(block));
      otherBlocks.forEach(block => {
        if (block !== sequencedBlocks[0]) sequence.push(block);
      });
      quizBlocks.forEach(block => sequence.push(block));
      
      sequencedBlocks = sequence;
    }
    
    // Apply age-appropriate sequencing
    if (childAge <= 7) {
      const concreteBlocks = sequencedBlocks.filter(
        block => block.type === 'fact' || block.type === 'activity'
      );
      const abstractBlocks = sequencedBlocks.filter(
        block => block.type !== 'fact' && block.type !== 'activity'
      );
      
      const startingFact = sequencedBlocks[0];
      const remainingConcreteBlocks = concreteBlocks.filter(block => block !== startingFact);
      
      sequencedBlocks = [startingFact, ...remainingConcreteBlocks, ...abstractBlocks];
      sequencedBlocks = sequencedBlocks.slice(0, Math.min(6, sequencedBlocks.length));
    }
    
    // Avoid consecutive blocks of same type
    for (let i = 1; i < sequencedBlocks.length; i++) {
      if (i > 0 && sequencedBlocks[i].type === sequencedBlocks[i-1].type) {
        for (let j = i+1; j < sequencedBlocks.length; j++) {
          if (sequencedBlocks[j].type !== sequencedBlocks[i].type) {
            const temp = sequencedBlocks[i];
            sequencedBlocks[i] = sequencedBlocks[j];
            sequencedBlocks[j] = temp;
            break;
          }
        }
      }
    }
    
    // Ensure reflective block near the end
    const reflectiveBlockIndex = sequencedBlocks.findIndex(
      block => block.type === 'mindfulness' || block.type === 'creative'
    );
    
    if (reflectiveBlockIndex !== -1 && reflectiveBlockIndex < sequencedBlocks.length - 3) {
      const reflectiveBlock = sequencedBlocks[reflectiveBlockIndex];
      sequencedBlocks.splice(reflectiveBlockIndex, 1);
      sequencedBlocks.splice(sequencedBlocks.length - 1, 0, reflectiveBlock);
    }
    
    return sequencedBlocks;
  }, [blocks, childAge, timeOfDay]);
  
  return { organizedBlocks };
};
