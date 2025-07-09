import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizationProfile {
  contentDifficulty: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  interests: string[];
  strengths: string[];
  challenges: string[];
  optimalSessionLength: number;
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
}

interface LearningPattern {
  engagementScore: number;
  completionRate: number;
  retentionRate: number;
  strugglingTopics: string[];
  masteredTopics: string[];
}

export const usePersonalizationEngine = (childId: string | undefined) => {
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [patterns, setPatterns] = useState<LearningPattern | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      loadPersonalizationData();
    }
  }, [childId]);

  const loadPersonalizationData = async () => {
    if (!childId) return;

    try {
      setIsLoading(true);

      // Load child profile and learning preferences
      const { data: childProfile } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', childId)
        .single();

      // Load learning history for pattern analysis
      const { data: learningHistory } = await supabase
        .from('learning_history')
        .select('*')
        .eq('child_id', childId)
        .order('interaction_date', { ascending: false })
        .limit(50);

      // Load recent curios for content analysis
      const { data: recentCurios } = await supabase
        .from('curios')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (childProfile) {
        // Build personalization profile
        const personalizationProfile: PersonalizationProfile = {
          contentDifficulty: childProfile.content_difficulty_preference || 5,
          learningStyle: determineLearningStyle(learningHistory),
          interests: childProfile.interests || [],
          strengths: extractStrengths(learningHistory),
          challenges: extractChallenges(learningHistory),
          optimalSessionLength: calculateOptimalSessionLength(learningHistory),
          preferredTimeOfDay: determinePreferredTime(learningHistory)
        };

        // Analyze learning patterns
        const learningPatterns: LearningPattern = {
          engagementScore: calculateEngagementScore(learningHistory),
          completionRate: calculateCompletionRate(recentCurios),
          retentionRate: calculateRetentionRate(learningHistory),
          strugglingTopics: identifyStrugglingTopics(learningHistory),
          masteredTopics: identifyMasteredTopics(learningHistory)
        };

        // Generate personalized recommendations
        const personalizedRecommendations = generateRecommendations(
          personalizationProfile,
          learningPatterns
        );

        setProfile(personalizationProfile);
        setPatterns(learningPatterns);
        setRecommendations(personalizedRecommendations);
      }
    } catch (error) {
      console.error('Error loading personalization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineLearningStyle = (history: any[]): 'visual' | 'auditory' | 'kinesthetic' | 'reading' => {
    // Analyze interaction patterns to determine preferred learning style
    const styleScores = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0
    };

    history?.forEach(entry => {
      if (entry.engagement_level > 7) {
        // High engagement indicates preferred style
        styleScores.visual += 1; // Default for now
      }
    });

    return Object.entries(styleScores).reduce((a, b) => 
      styleScores[a[0] as keyof typeof styleScores] > styleScores[b[0] as keyof typeof styleScores] ? a : b
    )[0] as 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  };

  const extractStrengths = (history: any[]): string[] => {
    const topicPerformance: Record<string, number> = {};
    
    history?.forEach(entry => {
      if (entry.engagement_level >= 8) {
        topicPerformance[entry.topic] = (topicPerformance[entry.topic] || 0) + 1;
      }
    });

    return Object.entries(topicPerformance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  };

  const extractChallenges = (history: any[]): string[] => {
    const topicDifficulty: Record<string, number> = {};
    
    history?.forEach(entry => {
      if (entry.engagement_level <= 4) {
        topicDifficulty[entry.topic] = (topicDifficulty[entry.topic] || 0) + 1;
      }
    });

    return Object.entries(topicDifficulty)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([topic]) => topic);
  };

  const calculateOptimalSessionLength = (history: any[]): number => {
    // Analyze session duration vs engagement
    const avgEngagement = history?.reduce((sum, entry) => sum + (entry.engagement_level || 0), 0) / (history?.length || 1);
    
    // Return optimal session length in minutes based on engagement patterns
    if (avgEngagement >= 8) return 25;
    if (avgEngagement >= 6) return 20;
    return 15;
  };

  const determinePreferredTime = (history: any[]): 'morning' | 'afternoon' | 'evening' => {
    const timeScores = { morning: 0, afternoon: 0, evening: 0 };
    
    history?.forEach(entry => {
      const hour = new Date(entry.interaction_date).getHours();
      if (hour < 12) timeScores.morning += entry.engagement_level || 0;
      else if (hour < 18) timeScores.afternoon += entry.engagement_level || 0;
      else timeScores.evening += entry.engagement_level || 0;
    });

    return Object.entries(timeScores).reduce((a, b) => 
      timeScores[a[0] as keyof typeof timeScores] > timeScores[b[0] as keyof typeof timeScores] ? a : b
    )[0] as 'morning' | 'afternoon' | 'evening';
  };

  const calculateEngagementScore = (history: any[]): number => {
    if (!history?.length) return 0;
    return history.reduce((sum, entry) => sum + (entry.engagement_level || 0), 0) / history.length;
  };

  const calculateCompletionRate = (curios: any[]): number => {
    if (!curios?.length) return 0;
    const completed = curios.filter(c => !c.generation_error).length;
    return (completed / curios.length) * 100;
  };

  const calculateRetentionRate = (history: any[]): number => {
    const revisited = history?.filter(h => h.revisit_count > 0).length || 0;
    return history?.length ? (revisited / history.length) * 100 : 0;
  };

  const identifyStrugglingTopics = (history: any[]): string[] => {
    const topicDifficulty: Record<string, { total: number, low: number }> = {};
    
    history?.forEach(entry => {
      if (!topicDifficulty[entry.topic]) {
        topicDifficulty[entry.topic] = { total: 0, low: 0 };
      }
      topicDifficulty[entry.topic].total++;
      if (entry.engagement_level <= 4) {
        topicDifficulty[entry.topic].low++;
      }
    });

    return Object.entries(topicDifficulty)
      .filter(([, data]) => data.low / data.total > 0.6) // 60% low engagement
      .map(([topic]) => topic)
      .slice(0, 3);
  };

  const identifyMasteredTopics = (history: any[]): string[] => {
    const topicMastery: Record<string, { total: number, high: number }> = {};
    
    history?.forEach(entry => {
      if (!topicMastery[entry.topic]) {
        topicMastery[entry.topic] = { total: 0, high: 0 };
      }
      topicMastery[entry.topic].total++;
      if (entry.engagement_level >= 8) {
        topicMastery[entry.topic].high++;
      }
    });

    return Object.entries(topicMastery)
      .filter(([, data]) => data.high / data.total > 0.8) // 80% high engagement
      .map(([topic]) => topic)
      .slice(0, 5);
  };

  const generateRecommendations = (
    profile: PersonalizationProfile,
    patterns: LearningPattern
  ): string[] => {
    const recommendations: string[] = [];

    // Content difficulty recommendations
    if (patterns.completionRate < 60) {
      recommendations.push("Try easier topics to build confidence");
    } else if (patterns.completionRate > 90) {
      recommendations.push("Challenge yourself with more advanced topics");
    }

    // Learning style recommendations
    if (profile.learningStyle === 'visual') {
      recommendations.push("Explore topics with rich images and diagrams");
    } else if (profile.learningStyle === 'auditory') {
      recommendations.push("Use read-aloud features for better learning");
    }

    // Interest-based recommendations
    profile.interests.forEach(interest => {
      recommendations.push(`Discover more about ${interest}`);
    });

    // Time-based recommendations
    if (profile.preferredTimeOfDay === 'morning') {
      recommendations.push("Morning learning sessions work best for you");
    }

    return recommendations.slice(0, 5);
  };

  const updateLearningPreferences = async (updates: Partial<PersonalizationProfile>) => {
    if (!childId) return;

    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({
          content_difficulty_preference: updates.contentDifficulty,
          learning_preferences: {
            ...profile,
            ...updates
          }
        })
        .eq('id', childId);

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating learning preferences:', error);
    }
  };

  return {
    profile,
    patterns,
    recommendations,
    isLoading,
    updateLearningPreferences,
    refreshData: loadPersonalizationData
  };
};