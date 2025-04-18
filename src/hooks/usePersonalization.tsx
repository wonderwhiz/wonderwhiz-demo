
import { useState, useEffect, useCallback } from 'react';
import { useAppPerformance } from './useAppPerformance';

interface UserPreferences {
  colorTheme: 'auto' | 'light' | 'dark' | 'colorful';
  contentDensity: 'compact' | 'balanced' | 'spacious';
  animationLevel: 'minimal' | 'moderate' | 'full';
  textSize: 'small' | 'medium' | 'large';
  interactionStyle: 'tap' | 'gesture' | 'voice';
  contentStyle: 'visual' | 'text' | 'balanced';
  audioFeedback: boolean;
  favoriteTopics: string[];
}

type ContentStyle = UserPreferences['contentStyle'];
type InteractionStyle = UserPreferences['interactionStyle'];
type ColorTheme = UserPreferences['colorTheme'];

export function usePersonalization(childId: string) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    colorTheme: 'auto',
    contentDensity: 'balanced',
    animationLevel: 'moderate',
    textSize: 'medium',
    interactionStyle: 'gesture',
    contentStyle: 'balanced',
    audioFeedback: true,
    favoriteTopics: []
  });
  
  const { storeOfflineData, getOfflineData } = useAppPerformance();
  
  // Load saved preferences
  useEffect(() => {
    const savedPreferences = getOfflineData(`${childId}_preferences`);
    
    if (savedPreferences) {
      setUserPreferences(savedPreferences);
    } else {
      // Initialize with defaults based on device detection or other criteria
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setUserPreferences({
        colorTheme: prefersDarkMode ? 'dark' : 'auto',
        contentDensity: 'balanced',
        animationLevel: prefersReducedMotion ? 'minimal' : 'moderate',
        textSize: 'medium',
        interactionStyle: isTouchDevice ? 'gesture' : 'tap',
        contentStyle: 'balanced',
        audioFeedback: true,
        favoriteTopics: []
      });
    }
  }, [childId, getOfflineData]);
  
  // Save preferences when they change
  useEffect(() => {
    storeOfflineData(`${childId}_preferences`, userPreferences);
  }, [childId, userPreferences, storeOfflineData]);
  
  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  }, []);
  
  // Get personalized content based on user preferences
  const getPersonalizedContent = useCallback((options: {
    contentType: 'card' | 'text' | 'visualization';
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) => {
    // This is a simple implementation - in a real app, this would call
    // an API to get personalized content based on user preferences
    
    const { contentType, topic, difficulty = 'medium' } = options;
    const { contentStyle, textSize } = userPreferences;
    
    // Adjust content based on preferences
    const visualRatio = contentStyle === 'visual' ? 0.8 : 
                        contentStyle === 'text' ? 0.3 : 0.5;
    
    const textSizeModifier = textSize === 'small' ? 0.8 : 
                            textSize === 'large' ? 1.2 : 1;
    
    // Return personalized content template
    return {
      visualRatio,
      textSizeModifier,
      difficulty,
      contentType,
      topic,
      // These would be determined by an API in a real app
      recommendedFormat: contentStyle === 'visual' ? 'interactive' : 'article',
      readingLevel: difficulty,
      elements: {
        includeImages: contentStyle !== 'text',
        includeVideos: contentStyle === 'visual',
        includeInteractives: contentStyle === 'visual',
        textLength: contentStyle === 'text' ? 'long' : 'medium'
      }
    };
  }, [userPreferences]);
  
  // Extract specific preferences for easier access
  const { contentStyle, interactionStyle, colorTheme } = userPreferences;
  
  return {
    userPreferences,
    updatePreferences,
    getPersonalizedContent,
    // Convenience accessors for common preferences
    contentStyle,
    interactionStyle,
    colorTheme,
  };
}
