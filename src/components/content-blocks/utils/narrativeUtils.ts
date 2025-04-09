
/**
 * Determines the narrative position of a block in the sequence
 */
export const getSequencePosition = (
  position: number, 
  total: number
): 'beginning' | 'middle' | 'end' => {
  if (position === 0 || position === 1) {
    return 'beginning';
  }
  
  if (position >= total - 1) {
    return 'end';
  }
  
  return 'middle';
};

/**
 * Determines if a wonder prompt should be shown for this block
 * based on narrative position, block type, and specialist
 */
export const shouldShowWonderPrompt = (
  blockType: string,
  narrativePosition: 'beginning' | 'middle' | 'end',
  specialistId: string,
  position: number
): boolean => {
  // Show wonder prompts at strategic points
  
  // Always show after fact blocks - they're perfect for sparking curiosity
  if (blockType === 'fact' || blockType === 'funFact') {
    return true;
  }
  
  // Show after quiz blocks only in the middle of the journey
  if (blockType === 'quiz' && narrativePosition === 'middle') {
    return true;
  }
  
  // Show after creative blocks to encourage further exploration
  if (blockType === 'creative') {
    return true;
  }
  
  // Show after mindfulness blocks at the end to encourage deeper thinking
  if (blockType === 'mindfulness' && narrativePosition === 'end') {
    return true;
  }
  
  // Special case: show for specific specialists at specific positions
  if (specialistId === 'nova' && position % 3 === 0) {
    return true;
  }
  
  if (specialistId === 'atlas' && narrativePosition === 'beginning') {
    return true;
  }
  
  // Default: don't show wonder prompt
  return false;
};

/**
 * Determines the narrative theme of a content sequence
 */
export const getNarrativeTheme = (blocks: any[]): string => {
  if (!blocks || blocks.length === 0) {
    return 'exploration';
  }
  
  // Count specialists to determine theme emphasis
  const specialistCounts = blocks.reduce((counts: Record<string, number>, block) => {
    const specialist = block.specialist_id;
    counts[specialist] = (counts[specialist] || 0) + 1;
    return counts;
  }, {});
  
  // Find dominant specialist
  const dominantSpecialist = Object.entries(specialistCounts).reduce(
    (max, [specialist, count]) => count > max[1] ? [specialist, count] : max,
    ['', 0]
  )[0];
  
  // Determine theme based on dominant specialist
  switch (dominantSpecialist) {
    case 'nova': return 'cosmic-discovery';
    case 'prism': return 'scientific-inquiry';
    case 'atlas': return 'historical-journey';
    case 'spark': return 'creative-exploration';
    case 'pixel': return 'technological-adventure';
    case 'lotus': return 'natural-connection';
    default: return 'exploration';
  }
};

/**
 * Gets transitional phrases to connect blocks in the narrative
 */
export const getTransitionPhrase = (
  fromBlockType: string,
  toBlockType: string,
  narrativeTheme: string
): string => {
  const transitions: Record<string, string[]> = {
    'fact-to-quiz': [
      'Now, let\'s test your understanding...',
      'Time to challenge what you just learned!',
      'Let\'s see if you can apply this knowledge...'
    ],
    'fact-to-creative': [
      'Let\'s get creative with what we just learned!',
      'This fact inspires us to imagine...',
      'Now, express your understanding through creation!'
    ],
    'quiz-to-fact': [
      'Building on what you know, here\'s something fascinating...',
      'Great thinking! Here\'s another amazing discovery...',
      'Your knowledge is growing! Now consider this...'
    ],
    'creative-to-mindfulness': [
      'Take a moment to reflect on your creative journey...',
      'Let\'s pause and connect more deeply with this topic...',
      'After creating, let\'s take time to observe and reflect...'
    ],
    'default': [
      'Let\'s continue our exploration...',
      'The journey of discovery continues!',
      'What other wonders await us?'
    ]
  };
  
  // Create key for specific transition
  const transitionKey = `${fromBlockType}-to-${toBlockType}`;
  
  // Get relevant transitions or fallback to default
  const relevantTransitions = transitions[transitionKey] || transitions.default;
  
  // Return random transition phrase
  const randomIndex = Math.floor(Math.random() * relevantTransitions.length);
  return relevantTransitions[randomIndex];
};

/**
 * Determines if a plot twist (surprise element) should be shown
 */
export const shouldShowPlotTwist = (
  blockSequence: number,
  totalBlocks: number,
  blockType: string
): boolean => {
  // Show plot twists at strategic points
  
  // Good point for a twist is about 2/3 through the sequence
  const idealTwistPoint = Math.floor(totalBlocks * 0.6);
  
  // Facts and quizzes are good for twists
  const isTwistableBlock = blockType === 'fact' || blockType === 'quiz' || blockType === 'funFact';
  
  // Only show twist at the ideal point and for twistable blocks
  return blockSequence === idealTwistPoint && isTwistableBlock;
};
