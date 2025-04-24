
import { useMemo } from 'react';

// Enhanced age groups with more granular ranges
export type AgeGroup = 'preschool' | 'early-elementary' | 'late-elementary' | 'middle-school' | 'high-school';
export type InteractionStyle = 'playful' | 'guided' | 'balanced' | 'independent' | 'advanced';
export type InteractionSize = 'xl' | 'large' | 'default' | 'small' | 'xs';

interface AgeAdaptation {
  textSize: string;
  headingSize: string;
  spacing: string;
  interactionStyle: InteractionStyle;
  interactionSize: InteractionSize;
  autoRead: boolean;
  animationLevel: 'high' | 'medium' | 'low';
  messageStyle: 'playful' | 'casual' | 'balanced' | 'formal' | 'academic';
  ageGroup: AgeGroup;
  visualAids: 'extensive' | 'moderate' | 'minimal';
  colorIntensity: 'vibrant' | 'moderate' | 'subtle';
  simplifiedLanguage: boolean;
  vocabularyLevel: 1 | 2 | 3 | 4 | 5; // 1 = simplest, 5 = advanced
}

export const useAgeAdaptation = (age: number): AgeAdaptation => {
  return useMemo(() => {
    // Preschool: Ages 3-5
    if (age <= 5) {
      return {
        textSize: 'text-xl',
        headingSize: 'text-2xl',
        spacing: 'space-y-6',
        interactionStyle: 'playful',
        interactionSize: 'xl',
        autoRead: true,
        animationLevel: 'high',
        messageStyle: 'playful',
        ageGroup: 'preschool',
        visualAids: 'extensive',
        colorIntensity: 'vibrant',
        simplifiedLanguage: true,
        vocabularyLevel: 1
      };
    }
    // Early Elementary: Ages 6-8
    else if (age <= 8) {
      return {
        textSize: 'text-lg',
        headingSize: 'text-xl',
        spacing: 'space-y-5',
        interactionStyle: 'guided',
        interactionSize: 'large',
        autoRead: true,
        animationLevel: 'high',
        messageStyle: 'playful',
        ageGroup: 'early-elementary',
        visualAids: 'extensive',
        colorIntensity: 'vibrant',
        simplifiedLanguage: true,
        vocabularyLevel: 2
      };
    }
    // Late Elementary: Ages 9-11
    else if (age <= 11) {
      return {
        textSize: 'text-base',
        headingSize: 'text-lg',
        spacing: 'space-y-4',
        interactionStyle: 'balanced',
        interactionSize: 'default',
        autoRead: false,
        animationLevel: 'medium',
        messageStyle: 'casual',
        ageGroup: 'late-elementary',
        visualAids: 'moderate',
        colorIntensity: 'moderate',
        simplifiedLanguage: false,
        vocabularyLevel: 3
      };
    }
    // Middle School: Ages 12-14
    else if (age <= 14) {
      return {
        textSize: 'text-sm',
        headingSize: 'text-base',
        spacing: 'space-y-4',
        interactionStyle: 'independent',
        interactionSize: 'small',
        autoRead: false,
        animationLevel: 'medium',
        messageStyle: 'balanced',
        ageGroup: 'middle-school',
        visualAids: 'moderate',
        colorIntensity: 'moderate',
        simplifiedLanguage: false,
        vocabularyLevel: 4
      };
    }
    // High School: Ages 15+
    else {
      return {
        textSize: 'text-sm',
        headingSize: 'text-base',
        spacing: 'space-y-3',
        interactionStyle: 'advanced',
        interactionSize: 'xs',
        autoRead: false,
        animationLevel: 'low',
        messageStyle: 'academic',
        ageGroup: 'high-school',
        visualAids: 'minimal',
        colorIntensity: 'subtle',
        simplifiedLanguage: false,
        vocabularyLevel: 5
      };
    }
  }, [age]);
};

// Utility function to get age-appropriate vocabulary
export const getAgeAppropriateText = (
  simpleText: string, 
  mediumText: string, 
  advancedText: string, 
  age: number
): string => {
  if (age <= 8) return simpleText;
  if (age <= 13) return mediumText;
  return advancedText;
};

// Utility function to get age-appropriate animation settings
export const getAnimationSettings = (age: number) => {
  if (age <= 8) {
    return {
      duration: 0.5,
      scale: 1.05,
      bounce: 0.3
    };
  } else if (age <= 13) {
    return {
      duration: 0.4,
      scale: 1.02,
      bounce: 0.2
    };
  } else {
    return {
      duration: 0.3,
      scale: 1.01,
      bounce: 0.1
    };
  }
};
