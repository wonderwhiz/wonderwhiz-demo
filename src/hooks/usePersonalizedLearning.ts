import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  type: 'strength' | 'interest' | 'recommendation' | 'achievement';
  confidence: number;
  icon: string;
}

interface LearningPattern {
  favoriteTopics: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening';
  learningStyle: 'visual' | 'reading' | 'interactive' | 'mixed';
  difficulty: 'easy' | 'medium' | 'challenging';
  streakPattern: number[];
  totalSessions: number;
  averageEngagement: number;
}

interface PersonalizedContent {
  suggestedTopics: Array<{
    title: string;
    reason: string;
    difficulty: string;
    estimatedTime: string;
    icon: string;
  }>;
  continueWhere: Array<{
    title: string;
    progress: number;
    lastAccessed: string;
    type: 'encyclopedia' | 'curio';
  }>;
  achievements: Array<{
    title: string;
    description: string;
    earnedAt: string;
    icon: string;
    rarity: 'common' | 'rare' | 'legendary';
  }>;
}

export const usePersonalizedLearning = (childId: string | undefined) => {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [patterns, setPatterns] = useState<LearningPattern | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (childId) {
      analyzeLearningData();
    }
  }, [childId]);

  const analyzeLearningData = async () => {
    if (!childId) return;
    
    setIsAnalyzing(true);
    
    try {
      // Get learning history
      const { data: learningHistory } = await supabase
        .from('learning_history')
        .select('*')
        .eq('child_id', childId)
        .order('interaction_date', { ascending: false })
        .limit(50);

      // Get curios history
      const { data: curios } = await supabase
        .from('curios')
        .select('*')
        .eq('child_id', childId)
        .order('last_updated_at', { ascending: false })
        .limit(20);

      // Get learning topics
      const { data: topics } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('child_id', childId)
        .order('updated_at', { ascending: false });

      // Get child profile for interests
      const { data: profile } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('id', childId)
        .single();

      // Analyze patterns
      const analyzedPatterns = analyzePatterns(learningHistory || [], curios || [], topics || []);
      const generatedInsights = generateInsights(analyzedPatterns, profile);
      const personalizedSuggestions = generatePersonalizedContent(analyzedPatterns, profile, topics || []);

      setPatterns(analyzedPatterns);
      setInsights(generatedInsights);
      setPersonalizedContent(personalizedSuggestions);
      
    } catch (error) {
      console.error('Error analyzing learning data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzePatterns = (history: any[], curios: any[], topics: any[]): LearningPattern => {
    // Extract favorite topics from history
    const topicCounts: Record<string, number> = {};
    history.forEach(item => {
      if (item.topic) {
        topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
      }
    });
    
    const favoriteTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    // Determine preferred learning time
    const hourCounts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0 };
    history.forEach(item => {
      const hour = new Date(item.interaction_date).getHours();
      if (hour < 12) hourCounts.morning++;
      else if (hour < 17) hourCounts.afternoon++;
      else hourCounts.evening++;
    });
    
    const preferredTime = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as 'morning' | 'afternoon' | 'evening' || 'afternoon';

    // Calculate average engagement
    const totalEngagement = history.reduce((sum, item) => sum + (item.engagement_level || 0), 0);
    const averageEngagement = history.length > 0 ? totalEngagement / history.length : 0;

    return {
      favoriteTopics,
      preferredTime,
      learningStyle: 'mixed', // Can be enhanced with more analysis
      difficulty: averageEngagement > 7 ? 'challenging' : averageEngagement > 4 ? 'medium' : 'easy',
      streakPattern: [1, 1, 0, 1, 1, 1, 0], // Simplified pattern
      totalSessions: history.length,
      averageEngagement
    };
  };

  const generateInsights = (patterns: LearningPattern, profile: any): LearningInsight[] => {
    const insights: LearningInsight[] = [];
    const age = profile?.age || 10;
    const isYoungChild = age <= 8;

    // Learning strength insight
    if (patterns.favoriteTopics.length > 0) {
      insights.push({
        id: '1',
        title: isYoungChild ? 'You love learning about!' : 'Your Learning Strength',
        description: isYoungChild 
          ? `You're super curious about ${patterns.favoriteTopics[0]}! 🌟`
          : `You show exceptional curiosity in ${patterns.favoriteTopics[0]}`,
        type: 'strength',
        confidence: 0.9,
        icon: '💪'
      });
    }

    // Time preference insight
    const timeEmoji = patterns.preferredTime === 'morning' ? '🌅' : 
                     patterns.preferredTime === 'afternoon' ? '☀️' : '🌙';
    insights.push({
      id: '2',
      title: isYoungChild ? 'Best Learning Time!' : 'Optimal Learning Window',
      description: isYoungChild
        ? `You learn best in the ${patterns.preferredTime}! ${timeEmoji}`
        : `Your peak learning performance is in the ${patterns.preferredTime}`,
      type: 'interest',
      confidence: 0.8,
      icon: timeEmoji
    });

    // Engagement insight
    if (patterns.averageEngagement > 6) {
      insights.push({
        id: '3',
        title: isYoungChild ? 'Super Learner!' : 'High Engagement',
        description: isYoungChild
          ? 'You always stay super interested when learning! 🚀'
          : 'You maintain excellent focus and engagement during learning sessions',
        type: 'achievement',
        confidence: 0.95,
        icon: '🚀'
      });
    }

    // Recommendation based on patterns
    const nextTopic = getNextRecommendedTopic(patterns);
    if (nextTopic) {
      insights.push({
        id: '4',
        title: isYoungChild ? 'Try This Next!' : 'Recommended Exploration',
        description: isYoungChild
          ? `Based on what you love, you might really enjoy ${nextTopic}! ✨`
          : `Given your interests, exploring ${nextTopic} could be fascinating`,
        type: 'recommendation',
        confidence: 0.85,
        icon: '✨'
      });
    }

    return insights;
  };

  const getNextRecommendedTopic = (patterns: LearningPattern): string | null => {
    // Smart topic recommendations based on learning patterns
    const topicConnections: Record<string, string[]> = {
      'space': ['black holes', 'planets', 'astronauts', 'rockets'],
      'animals': ['ocean creatures', 'dinosaurs', 'wildlife'],
      'science': ['chemistry', 'physics', 'biology'],
      'history': ['ancient civilizations', 'inventions', 'explorers'],
      'technology': ['robots', 'artificial intelligence', 'computers'],
      'art': ['famous artists', 'music', 'creativity']
    };

    for (const favTopic of patterns.favoriteTopics) {
      const relatedTopics = topicConnections[favTopic.toLowerCase()];
      if (relatedTopics) {
        return relatedTopics[Math.floor(Math.random() * relatedTopics.length)];
      }
    }

    return null;
  };

  const generatePersonalizedContent = (patterns: LearningPattern, profile: any, topics: any[]): PersonalizedContent => {
    const age = profile?.age || 10;
    const interests = profile?.interests || [];
    
    // Generate topic suggestions based on interests and patterns
    const suggestedTopics = [
      ...generateInterestBasedSuggestions(interests, age),
      ...generatePatternBasedSuggestions(patterns, age)
    ].slice(0, 6);

    // Find incomplete topics to continue
    const continueWhere = topics
      .filter(topic => topic.status !== 'completed')
      .slice(0, 3)
      .map(topic => ({
        title: topic.title,
        progress: ((topic.current_section || 0) / (topic.total_sections || 1)) * 100,
        lastAccessed: topic.updated_at,
        type: 'encyclopedia' as const
      }));

    // Generate achievements based on learning activity
    const achievements = generateAchievements(patterns, age);

    return {
      suggestedTopics,
      continueWhere,
      achievements
    };
  };

  const generateInterestBasedSuggestions = (interests: string[], age: number) => {
    const interestMap: Record<string, Array<{title: string, reason: string, difficulty: string, estimatedTime: string, icon: string}>> = {
      'science': [
        { title: 'How Lightning Works', reason: 'Perfect for science lovers!', difficulty: 'Medium', estimatedTime: '8 min', icon: '⚡' },
        { title: 'Amazing Chemical Reactions', reason: 'Science experiments you can visualize', difficulty: 'Easy', estimatedTime: '6 min', icon: '🧪' }
      ],
      'space': [
        { title: 'Journey to Mars', reason: 'Space exploration adventure', difficulty: 'Medium', estimatedTime: '10 min', icon: '🚀' },
        { title: 'Black Holes Explained', reason: 'Mind-bending space mysteries', difficulty: 'Hard', estimatedTime: '12 min', icon: '🕳️' }
      ],
      'animals': [
        { title: 'Ocean Giants', reason: 'Amazing sea creatures', difficulty: 'Easy', estimatedTime: '7 min', icon: '🐋' },
        { title: 'Butterfly Life Cycle', reason: 'Beautiful transformation story', difficulty: 'Easy', estimatedTime: '5 min', icon: '🦋' }
      ]
    };

    const suggestions: Array<{title: string, reason: string, difficulty: string, estimatedTime: string, icon: string}> = [];
    interests.forEach(interest => {
      const related = interestMap[interest.toLowerCase()];
      if (related) {
        suggestions.push(...related);
      }
    });

    return suggestions.slice(0, 3);
  };

  const generatePatternBasedSuggestions = (patterns: LearningPattern, age: number) => {
    // Generate suggestions based on learning patterns
    const suggestions = [
      { title: 'Ancient Mysteries', reason: 'New adventure awaits!', difficulty: 'Medium', estimatedTime: '9 min', icon: '🏺' },
      { title: 'How Music Works', reason: 'Creative exploration', difficulty: 'Easy', estimatedTime: '6 min', icon: '🎵' },
      { title: 'Robot Friends', reason: 'Technology meets fun', difficulty: 'Medium', estimatedTime: '8 min', icon: '🤖' }
    ];

    return suggestions.slice(0, 3);
  };

  const generateAchievements = (patterns: LearningPattern, age: number) => {
    const achievements = [];
    
    if (patterns.totalSessions >= 5) {
      achievements.push({
        title: age <= 8 ? 'Learning Star!' : 'Curious Explorer',
        description: age <= 8 ? 'You\'ve explored 5 amazing topics!' : 'Completed 5+ learning sessions',
        earnedAt: new Date().toISOString(),
        icon: '⭐',
        rarity: 'common' as const
      });
    }

    if (patterns.averageEngagement > 7) {
      achievements.push({
        title: age <= 8 ? 'Super Focused!' : 'Deep Thinker',
        description: age <= 8 ? 'You always pay great attention!' : 'Exceptional engagement in learning',
        earnedAt: new Date().toISOString(),
        icon: '🧠',
        rarity: 'rare' as const
      });
    }

    return achievements;
  };

  return {
    insights,
    patterns,
    personalizedContent,
    isAnalyzing,
    refreshAnalysis: analyzeLearningData
  };
};