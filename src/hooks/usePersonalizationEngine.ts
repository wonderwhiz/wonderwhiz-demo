
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const usePersonalizationEngine = (childId: string) => {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track learning behavior
  const trackInteraction = useCallback(async (data: {
    topicId?: string;
    contentType: string;
    timeSpent: number;
    completionRate: number;
    difficulty: string;
    engagement: number; // 0-1 scale
    needsHelp: boolean;
  }) => {
    try {
      await supabase.from('learning_interactions').insert({
        child_id: childId,
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [childId]);

  // Analyze learning patterns and update preferences
  const updatePersonalization = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch recent learning interactions
      const { data: interactions, error: interactionsError } = await supabase
        .from('learning_interactions')
        .select('*')
        .eq('child_id', childId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (interactionsError) throw interactionsError;

      // Analyze patterns
      const analysis = analyzeInteractions(interactions || []);
      
      // Update or create personalization data
      const { error: upsertError } = await supabase
        .from('child_personalization')
        .upsert({
          child_id: childId,
          preferences: analysis.preferences,
          adaptive_settings: analysis.adaptiveSettings,
          recommendations: analysis.recommendations,
          updated_at: new Date().toISOString()
        });

      if (upsertError) throw upsertError;

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
        const { data, error } = await supabase
          .from('child_personalization')
          .select('*')
          .eq('child_id', childId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPersonalizationData({
            preferences: data.preferences,
            adaptiveSettings: data.adaptive_settings,
            recommendations: data.recommendations
          });
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
  const analyzeInteractions = (interactions: any[]): PersonalizationData => {
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
      acc[diff].completions += interaction.completion_rate;
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
      const type = interaction.content_type;
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
    const avgTimeSpent = interactions.reduce((sum, i) => sum + i.time_spent, 0) / interactions.length;
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
    const avgCompletion = interactions.reduce((sum, i) => sum + i.completion_rate, 0) / interactions.length;
    const helpRequests = interactions.filter(i => i.needs_help).length / interactions.length;

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
