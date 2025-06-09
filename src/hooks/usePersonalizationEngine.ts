import { useState, useEffect, useCallback } from 'react';

interface LearningPreference {
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  preferredContentTypes: string[];
  optimalSessionLength: number; // in minutes
  bestTimeOfDay: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  interestTopics: string[];
  strengths: string[];
  challenges: string[];
}

interface PersonalizationData {
  preferences: LearningPreference;
  adaptiveSettings: {
    contentComplexity: number; // 0-1 scale
    interactionFrequency: number; // 0-1 scale
    gamificationLevel: number; // 0-1 scale
    explanationDepth: number; // 0-1 scale
  };
  recommendations: {
    nextTopics: string[];
    suggestedActivities: string[];
    optimalBreakTime: number;
    challengeLevel: number;
  };
}

interface InteractionData {
  topicId?: string;
  contentType: string;
  timeSpent: number;
  completionRate: number;
  difficulty: string;
  engagement: number;
  needsHelp: boolean;
  timestamp: string;
}

export const usePersonalizationEngine = (childId: string) => {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track learning behavior - simplified to just store in localStorage for now
  const trackInteraction = useCallback(async (data: InteractionData) => {
    try {
      // Store interaction data in localStorage for now
      const interactions = JSON.parse(localStorage.getItem(`interactions-${childId}`) || '[]');
      interactions.push({
        ...data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`interactions-${childId}`, JSON.stringify(interactions));
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [childId]);

  // Analyze learning patterns and update preferences
  const updatePersonalization = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get interactions from localStorage
      const interactions = JSON.parse(localStorage.getItem(`interactions-${childId}`) || '[]');
      
      // Analyze patterns
      const analysis = analyzeInteractions(interactions);
      
      // Store personalization data in localStorage
      localStorage.setItem(`personalization-${childId}`, JSON.stringify(analysis));
      
      setPersonalizationData(analysis);
    } catch (error) {
      console.error('Error updating personalization:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  // Load existing personalization data
  useEffect(() => {
    const loadPersonalizationData = async () => {
      try {
        // Try to load from localStorage first
        const stored = localStorage.getItem(`personalization-${childId}`);
        
        if (stored) {
          setPersonalizationData(JSON.parse(stored));
        } else {
          // Initialize with defaults
          const defaultPersonalization: PersonalizationData = {
            preferences: {
              preferredDifficulty: 'medium',
              preferredContentTypes: ['interactive', 'visual'],
              optimalSessionLength: 15,
              bestTimeOfDay: 'afternoon',
              learningStyle: 'mixed',
              interestTopics: [],
              strengths: [],
              challenges: []
            },
            adaptiveSettings: {
              contentComplexity: 0.5,
              interactionFrequency: 0.7,
              gamificationLevel: 0.8,
              explanationDepth: 0.6
            },
            recommendations: {
              nextTopics: [],
              suggestedActivities: [],
              optimalBreakTime: 5,
              challengeLevel: 0.5
            }
          };
          setPersonalizationData(defaultPersonalization);
        }
      } catch (error) {
        console.error('Error loading personalization data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      loadPersonalizationData();
    }
  }, [childId]);

  // Analyze interactions to determine learning patterns
  const analyzeInteractions = (interactions: InteractionData[]): PersonalizationData => {
    if (interactions.length === 0) {
      // Return default values
      return {
        preferences: {
          preferredDifficulty: 'medium',
          preferredContentTypes: ['interactive'],
          optimalSessionLength: 15,
          bestTimeOfDay: 'afternoon',
          learningStyle: 'mixed',
          interestTopics: [],
          strengths: [],
          challenges: []
        },
        adaptiveSettings: {
          contentComplexity: 0.5,
          interactionFrequency: 0.7,
          gamificationLevel: 0.8,
          explanationDepth: 0.6
        },
        recommendations: {
          nextTopics: [],
          suggestedActivities: [],
          optimalBreakTime: 5,
          challengeLevel: 0.5
        }
      };
    }

    // Analyze completion rates by difficulty
    const difficultyPerformance = interactions.reduce((acc, interaction) => {
      const diff = interaction.difficulty;
      if (!acc[diff]) acc[diff] = { total: 0, completions: 0, engagement: 0 };
      acc[diff].total++;
      acc[diff].completions += interaction.completionRate;
      acc[diff].engagement += interaction.engagement;
      return acc;
    }, {} as Record<string, { total: number; completions: number; engagement: number }>);

    // Determine preferred difficulty
    let preferredDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
    let bestPerformance = 0;
    Object.entries(difficultyPerformance).forEach(([diff, stats]) => {
      const avgPerformance = (stats.completions + stats.engagement) / (stats.total * 2);
      if (avgPerformance > bestPerformance) {
        bestPerformance = avgPerformance;
        preferredDifficulty = diff as 'easy' | 'medium' | 'hard';
      }
    });

    // Analyze content type preferences
    const contentTypePerformance = interactions.reduce((acc, interaction) => {
      const type = interaction.contentType;
      if (!acc[type]) acc[type] = { engagement: 0, count: 0 };
      acc[type].engagement += interaction.engagement;
      acc[type].count++;
      return acc;
    }, {} as Record<string, { engagement: number; count: number }>);

    const preferredContentTypes = Object.entries(contentTypePerformance)
      .sort(([,a], [,b]) => (b.engagement / b.count) - (a.engagement / a.count))
      .slice(0, 3)
      .map(([type]) => type);

    // Calculate optimal session length
    const avgTimeSpent = interactions.reduce((sum, i) => sum + i.timeSpent, 0) / interactions.length;
    const optimalSessionLength = Math.max(5, Math.min(30, Math.round(avgTimeSpent)));

    // Determine time of day preference (simplified)
    const timePreferences = interactions.reduce((acc, interaction) => {
      const hour = new Date(interaction.timestamp).getHours();
      let timeOfDay: string;
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';
      else timeOfDay = 'evening';

      if (!acc[timeOfDay]) acc[timeOfDay] = { engagement: 0, count: 0 };
      acc[timeOfDay].engagement += interaction.engagement;
      acc[timeOfDay].count++;
      return acc;
    }, {} as Record<string, { engagement: number; count: number }>);

    const bestTimeOfDay = Object.entries(timePreferences)
      .sort(([,a], [,b]) => (b.engagement / b.count) - (a.engagement / a.count))[0]?.[0] || 'afternoon';

    // Calculate adaptive settings
    const avgEngagement = interactions.reduce((sum, i) => sum + i.engagement, 0) / interactions.length;
    const avgCompletion = interactions.reduce((sum, i) => sum + i.completionRate, 0) / interactions.length;
    const helpRequests = interactions.filter(i => i.needsHelp).length / interactions.length;

    return {
      preferences: {
        preferredDifficulty,
        preferredContentTypes,
        optimalSessionLength,
        bestTimeOfDay,
        learningStyle: 'mixed', // Would need more sophisticated analysis
        interestTopics: [], // Would be extracted from topic interactions
        strengths: [],
        challenges: []
      },
      adaptiveSettings: {
        contentComplexity: Math.max(0.1, Math.min(0.9, avgCompletion)),
        interactionFrequency: Math.max(0.3, Math.min(1.0, 1 - avgEngagement)),
        gamificationLevel: Math.max(0.5, Math.min(1.0, avgEngagement + 0.2)),
        explanationDepth: Math.max(0.1, Math.min(1.0, helpRequests + 0.3))
      },
      recommendations: {
        nextTopics: [], // Would be generated based on interests and performance
        suggestedActivities: preferredContentTypes,
        optimalBreakTime: Math.max(2, Math.min(10, Math.round(avgTimeSpent / 3))),
        challengeLevel: Math.max(0.1, Math.min(0.9, avgCompletion - 0.1))
      }
    };
  };

  return {
    personalizationData,
    isLoading,
    error,
    trackInteraction,
    updatePersonalization,
    refetch: updatePersonalization
  };
};
