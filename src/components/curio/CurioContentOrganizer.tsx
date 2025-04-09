
import React, { useMemo } from 'react';
import { ContentBlock as ContentBlockType } from '@/types/curio';

interface CurioContentOrganizerProps {
  blocks: ContentBlockType[];
  childAge?: number; // Optional: age for age-appropriate sequencing
  timeOfDay?: 'morning' | 'afternoon' | 'evening'; // Optional: time context
  children?: (organizedBlocks: ContentBlockType[]) => React.ReactNode;
}

const CurioContentOrganizer: React.FC<CurioContentOrganizerProps> = ({ 
  blocks,
  childAge = 8, // Default to middle of range
  timeOfDay = 'afternoon', // Default
  children
}) => {
  // Organize blocks into an optimal learning sequence
  const organizedBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) return [];
    
    // Create a copy we can manipulate
    let sequencedBlocks = [...blocks];
    
    // Start with a fact/funFact to directly answer the question (June Sobel's recommendation)
    const firstFactIndex = sequencedBlocks.findIndex(block => 
      block.type === 'fact' || block.type === 'funFact'
    );
    
    if (firstFactIndex > 0) {
      const firstFact = sequencedBlocks[firstFactIndex];
      sequencedBlocks.splice(firstFactIndex, 1);
      sequencedBlocks.unshift(firstFact);
    }
    
    // Time of day optimizations (Dr. Qing Hua's recommendation)
    // - Morning: Start with energizing content (facts, quizzes)
    // - Afternoon: Mix of interactive and passive content
    // - Evening: More reflective, creative content, less intensive quizzes
    
    if (timeOfDay === 'morning') {
      // Prioritize quizzes and facts early in the sequence when attention is high
      const quizBlocks = sequencedBlocks.filter(block => block.type === 'quiz');
      const nonQuizBlocks = sequencedBlocks.filter(block => block.type !== 'quiz');
      
      if (quizBlocks.length > 0) {
        // Place a quiz as the second or third item
        const preferredPosition = Math.min(2, nonQuizBlocks.length);
        nonQuizBlocks.splice(preferredPosition, 0, quizBlocks[0]);
        
        // Distribute remaining quizzes
        for (let i = 1; i < quizBlocks.length; i++) {
          const position = Math.min(preferredPosition + (i * 2), nonQuizBlocks.length);
          nonQuizBlocks.splice(position, 0, quizBlocks[i]);
        }
        
        sequencedBlocks = nonQuizBlocks;
      }
    } else if (timeOfDay === 'evening') {
      // Move creative and mindfulness blocks earlier, quizzes later
      const creativeBlocks = sequencedBlocks.filter(
        block => block.type === 'creative' || block.type === 'mindfulness'
      );
      const quizBlocks = sequencedBlocks.filter(block => block.type === 'quiz');
      const otherBlocks = sequencedBlocks.filter(
        block => block.type !== 'creative' && block.type !== 'mindfulness' && block.type !== 'quiz'
      );
      
      // Start with essential facts
      const sequence = [sequencedBlocks[0]];
      
      // Add creative/mindfulness early
      creativeBlocks.forEach(block => sequence.push(block));
      
      // Add other content
      otherBlocks.forEach(block => {
        if (block !== sequencedBlocks[0]) sequence.push(block);
      });
      
      // Add quizzes at the end when fewer remain
      quizBlocks.forEach(block => sequence.push(block));
      
      sequencedBlocks = sequence;
    }
    
    // Age-appropriate sequencing (Dr. Susana Zhang's recommendation)
    if (childAge <= 7) {
      // Younger children: concrete before abstract, shorter sequence
      // Move visual/concrete blocks earlier
      const concreteBlocks = sequencedBlocks.filter(
        block => block.type === 'fact' || block.type === 'activity'
      );
      const abstractBlocks = sequencedBlocks.filter(
        block => block.type !== 'fact' && block.type !== 'activity'
      );
      
      // Start with a clear fact
      const startingFact = sequencedBlocks[0];
      const remainingConcreteBlocks = concreteBlocks.filter(block => block !== startingFact);
      
      // Build sequence: fact → concrete → abstract
      sequencedBlocks = [startingFact, ...remainingConcreteBlocks, ...abstractBlocks];
      
      // Limit total blocks to prevent cognitive overload
      sequencedBlocks = sequencedBlocks.slice(0, Math.min(6, sequencedBlocks.length));
    }
    
    // Avoid consecutive blocks of same type for better engagement (Chris Bennett's recommendation)
    for (let i = 1; i < sequencedBlocks.length; i++) {
      if (i > 0 && sequencedBlocks[i].type === sequencedBlocks[i-1].type) {
        // Find next different block type
        for (let j = i+1; j < sequencedBlocks.length; j++) {
          if (sequencedBlocks[j].type !== sequencedBlocks[i].type) {
            // Swap to avoid consecutive same types
            const temp = sequencedBlocks[i];
            sequencedBlocks[i] = sequencedBlocks[j];
            sequencedBlocks[j] = temp;
            break;
          }
        }
      }
    }
    
    // Ensure we have a reflective block near the end to consolidate learning (Sada Stipe Perry's recommendation)
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
  
  // Render the organized blocks through the children function prop
  return (
    <>{children ? children(organizedBlocks) : null}</>
  );
};

// Also export the hook version for cases where we just need the logic
export const useContentOrganizer = (
  blocks: ContentBlockType[],
  childAge = 8,
  timeOfDay: 'morning' | 'afternoon' | 'evening' = 'afternoon'
) => {
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

export default CurioContentOrganizer;
