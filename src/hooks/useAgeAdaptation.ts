
import { useMemo } from 'react';

type AgeGroup = '5-7' | '8-11' | '12-16';

interface AgeAdaptation {
  textSize: string;
  spacing: string;
  interactionStyle: string;
  interactionSize: 'large' | 'default' | 'small';
  shouldAutoRead: boolean;
  messageStyle: 'playful' | 'casual' | 'formal';
  ageGroup: AgeGroup;
}

export const useAgeAdaptation = (age: number): AgeAdaptation => {
  return useMemo(() => {
    if (age <= 7) {
      return {
        textSize: 'text-lg',
        spacing: 'space-y-6',
        interactionStyle: 'interactive-young',
        interactionSize: 'large',
        shouldAutoRead: true,
        messageStyle: 'playful',
        ageGroup: '5-7'
      };
    } else if (age <= 11) {
      return {
        textSize: 'text-base',
        spacing: 'space-y-4',
        interactionStyle: 'interactive-middle',
        interactionSize: 'default',
        shouldAutoRead: false,
        messageStyle: 'casual',
        ageGroup: '8-11'
      };
    } else {
      return {
        textSize: 'text-sm',
        spacing: 'space-y-4',
        interactionStyle: 'interactive-older',
        interactionSize: 'small',
        shouldAutoRead: false,
        messageStyle: 'formal',
        ageGroup: '12-16'
      };
    }
  }, [age]);
};
