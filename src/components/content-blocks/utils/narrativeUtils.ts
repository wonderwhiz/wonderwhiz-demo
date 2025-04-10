// Helper functions for narrative content

export const getRandomPrompt = (type: string, specialistId: string): string => {
  const generalPrompts = [
    "What do you think about this?",
    "How could you use this information?",
    "What questions does this raise for you?",
    "How would you explain this to a friend?",
    "What's the most interesting part about this for you?"
  ];
  
  const creativePrompts = [
    "Draw or sketch what this makes you think of.",
    "Write a short story inspired by this.",
    "Create a song or poem about this topic.",
    "Design a poster to explain this concept.",
    "Imagine you're teaching this to someone else. What would you say?"
  ];
  
  const sciencePrompts = [
    "Design an experiment to test this.",
    "What would happen if we changed one part of this?",
    "How could this be applied to solve a problem?",
    "Can you think of a real-world example of this?",
    "What other scientific concepts connect to this?"
  ];
  
  if (type === 'creative' || specialistId === 'spark') {
    return creativePrompts[Math.floor(Math.random() * creativePrompts.length)];
  } else if (type === 'fact' || specialistId === 'prism' || specialistId === 'nova') {
    return sciencePrompts[Math.floor(Math.random() * sciencePrompts.length)];
  } else {
    return generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
  }
};

export const getNarrativeTransition = (fromType: string, toType: string): string => {
  if (fromType === 'fact' && toType === 'quiz') {
    return "Now that we've learned some interesting facts, let's test our knowledge!";
  } else if (fromType === 'fact' && toType === 'creative') {
    return "Let's use what we've learned to create something amazing!";
  } else if (fromType === 'quiz' && toType === 'fact') {
    return "Great job with that quiz! Let's learn some more fascinating information.";
  } else if (toType === 'mindfulness') {
    return "Let's take a moment to reflect on what we've discovered.";
  } else {
    return "Let's continue our journey of discovery...";
  }
};

export const getPersonalizedMessage = (childName: string, interest: string): string => {
  const messages = [
    `${childName}, since you like ${interest}, you might find this especially interesting!`,
    `This reminds me of your interest in ${interest}, ${childName}!`,
    `${childName}, how does this connect to your love of ${interest}?`,
    `I thought of your interest in ${interest} when I found this, ${childName}!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Updated to use a specific type for the return value
export const getSequencePosition = (position: number, total: number): 'beginning' | 'middle' | 'end' => {
  if (position === 0 || position === 1) {
    return 'beginning';
  } else if (position >= total - 1) {
    return 'end';
  } else {
    return 'middle';
  }
};

export const shouldShowWonderPrompt = (
  blockType: string, 
  narrativePosition: 'beginning' | 'middle' | 'end', 
  specialistId: string, 
  sequencePosition: number
): boolean => {
  // Show wonder prompts based on different conditions
  if (narrativePosition === 'end') {
    return true; // Always show at the end of a sequence
  }
  
  if (['fact', 'funFact', 'quiz'].includes(blockType) && 
      ['prism', 'nova', 'atlas'].includes(specialistId)) {
    return true; // Show for fact-based blocks from knowledge specialists
  }
  
  if (blockType === 'creative' && specialistId === 'spark') {
    return true; // Show for creative blocks from the creativity specialist
  }
  
  // Show occasionally in the middle of the journey
  if (narrativePosition === 'middle' && sequencePosition % 3 === 0) {
    return true;
  }
  
  return false;
};
