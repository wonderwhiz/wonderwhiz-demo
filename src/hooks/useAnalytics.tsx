
import { useState, useEffect, useCallback } from 'react';
import { useAppPerformance } from './useAppPerformance';

interface LearningInteraction {
  type: string;
  timestamp: number;
  data?: any;
}

interface TopicAffinity {
  topic: string;
  affinity: number; // 0-1 scale
  lastInteracted: number;
  interactionCount: number;
}

interface LearningProgressItem {
  date: string;
  timeSpent: number; // in minutes
  topicsExplored: string[];
  questionsAsked: number;
  tasksCompleted: number;
}

export function useAnalytics(childId: string) {
  const [interactions, setInteractions] = useState<LearningInteraction[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [topicAffinities, setTopicAffinities] = useState<TopicAffinity[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgressItem[]>([]);
  const { storeOfflineData, getOfflineData } = useAppPerformance();
  
  // Load saved data when the hook initializes
  useEffect(() => {
    const loadSavedData = () => {
      const savedTopicAffinities = getOfflineData(`${childId}_topic_affinities`);
      const savedLearningProgress = getOfflineData(`${childId}_learning_progress`);
      
      if (savedTopicAffinities) {
        setTopicAffinities(savedTopicAffinities);
      }
      
      if (savedLearningProgress) {
        setLearningProgress(savedLearningProgress);
      }
      
      // Initialize with some default topics if none exist
      if (!savedTopicAffinities || savedTopicAffinities.length === 0) {
        setTopicAffinities([
          { topic: 'Space', affinity: 0.7, lastInteracted: Date.now(), interactionCount: 5 },
          { topic: 'Animals', affinity: 0.6, lastInteracted: Date.now() - 86400000, interactionCount: 3 },
          { topic: 'Dinosaurs', affinity: 0.8, lastInteracted: Date.now() - 172800000, interactionCount: 7 },
          { topic: 'Oceans', affinity: 0.5, lastInteracted: Date.now() - 259200000, interactionCount: 2 },
          { topic: 'Science', affinity: 0.65, lastInteracted: Date.now() - 345600000, interactionCount: 4 }
        ]);
      }
      
      // Initialize with some learning progress if none exists
      if (!savedLearningProgress || savedLearningProgress.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
        
        setLearningProgress([
          { 
            date: twoDaysAgo, 
            timeSpent: 25, 
            topicsExplored: ['Space', 'Science'], 
            questionsAsked: 4, 
            tasksCompleted: 2 
          },
          { 
            date: yesterday, 
            timeSpent: 35, 
            topicsExplored: ['Dinosaurs', 'Animals', 'Science'], 
            questionsAsked: 6, 
            tasksCompleted: 3 
          },
          { 
            date: today, 
            timeSpent: 10, 
            topicsExplored: ['Oceans'], 
            questionsAsked: 2, 
            tasksCompleted: 1 
          }
        ]);
      }
      
      setSessionStartTime(Date.now());
    };
    
    loadSavedData();
  }, [childId, getOfflineData]);
  
  // Save analytics data periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (topicAffinities.length > 0) {
        storeOfflineData(`${childId}_topic_affinities`, topicAffinities);
      }
      
      if (learningProgress.length > 0) {
        storeOfflineData(`${childId}_learning_progress`, learningProgress);
      }
      
      const currentSessionTime = Math.floor((Date.now() - sessionStartTime) / 60000); // in minutes
      
      // Update today's learning progress
      const today = new Date().toISOString().split('T')[0];
      setLearningProgress(prev => {
        const todayProgressIndex = prev.findIndex(p => p.date === today);
        
        if (todayProgressIndex >= 0) {
          const updatedProgress = [...prev];
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            timeSpent: currentSessionTime
          };
          return updatedProgress;
        }
        
        // If no entry for today, create one
        return [...prev, {
          date: today,
          timeSpent: currentSessionTime,
          topicsExplored: [],
          questionsAsked: 0,
          tasksCompleted: 0
        }];
      });
    }, 60000); // Save every minute
    
    return () => clearInterval(saveInterval);
  }, [childId, sessionStartTime, topicAffinities, learningProgress, storeOfflineData]);
  
  // Record a new interaction
  const recordInteraction = useCallback((type: string, data?: any) => {
    const interaction: LearningInteraction = {
      type,
      timestamp: Date.now(),
      data
    };
    
    setInteractions(prev => [...prev, interaction]);
    
    // Update topic affinities if the interaction is topic-related
    if (data?.topic) {
      updateTopicAffinity(data.topic);
    } else if (type === 'search' && data?.query) {
      // Analyze query for potential topics
      const query = data.query.toLowerCase();
      const potentialTopics = ['space', 'animals', 'dinosaurs', 'oceans', 'science', 'history', 'geography'];
      
      potentialTopics.forEach(topic => {
        if (query.includes(topic)) {
          updateTopicAffinity(topic);
        }
      });
    }
    
    // Update today's stats for specific interaction types
    const today = new Date().toISOString().split('T')[0];
    
    if (type === 'search' || type === 'voice_input') {
      setLearningProgress(prev => {
        const todayProgressIndex = prev.findIndex(p => p.date === today);
        
        if (todayProgressIndex >= 0) {
          const updatedProgress = [...prev];
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            questionsAsked: updatedProgress[todayProgressIndex].questionsAsked + 1
          };
          return updatedProgress;
        }
        
        return prev;
      });
    } else if (type === 'task_complete') {
      setLearningProgress(prev => {
        const todayProgressIndex = prev.findIndex(p => p.date === today);
        
        if (todayProgressIndex >= 0) {
          const updatedProgress = [...prev];
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            tasksCompleted: updatedProgress[todayProgressIndex].tasksCompleted + 1
          };
          return updatedProgress;
        }
        
        return prev;
      });
    }
  }, []);
  
  // Update affinity for a topic
  const updateTopicAffinity = useCallback((topic: string) => {
    setTopicAffinities(prev => {
      const now = Date.now();
      const topicIndex = prev.findIndex(t => t.topic.toLowerCase() === topic.toLowerCase());
      
      if (topicIndex >= 0) {
        // Update existing topic
        const updatedAffinities = [...prev];
        updatedAffinities[topicIndex] = {
          ...updatedAffinities[topicIndex],
          affinity: Math.min(1, updatedAffinities[topicIndex].affinity + 0.05),
          lastInteracted: now,
          interactionCount: updatedAffinities[topicIndex].interactionCount + 1
        };
        return updatedAffinities;
      }
      
      // Add new topic
      return [...prev, {
        topic,
        affinity: 0.5, // Start at middle affinity
        lastInteracted: now,
        interactionCount: 1
      }];
    });
    
    // Update the list of explored topics for today
    const today = new Date().toISOString().split('T')[0];
    setLearningProgress(prev => {
      const todayProgressIndex = prev.findIndex(p => p.date === today);
      
      if (todayProgressIndex >= 0) {
        const updatedProgress = [...prev];
        const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
        
        if (!updatedProgress[todayProgressIndex].topicsExplored.includes(capitalizedTopic)) {
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            topicsExplored: [...updatedProgress[todayProgressIndex].topicsExplored, capitalizedTopic]
          };
        }
        return updatedProgress;
      }
      
      return prev;
    });
  }, []);
  
  // Get the current session time in minutes
  const sessionTime = useCallback(() => {
    return Math.floor((Date.now() - sessionStartTime) / 60000);
  }, [sessionStartTime]);
  
  // Get recommended topics based on user affinities and time decay
  const getRecommendedTopics = useCallback((count: number = 5) => {
    // Apply time decay to affinities (older interactions are less relevant)
    const now = Date.now();
    const withRecency = topicAffinities.map(topic => {
      const daysSinceInteraction = (now - topic.lastInteracted) / (1000 * 60 * 60 * 24);
      const recencyFactor = Math.max(0, 1 - (daysSinceInteraction * 0.1)); // 10% decay per day
      
      return {
        ...topic,
        adjustedAffinity: topic.affinity * recencyFactor
      };
    });
    
    // Sort by adjusted affinity and return top N
    return withRecency
      .sort((a, b) => b.adjustedAffinity - a.adjustedAffinity)
      .slice(0, count)
      .map(t => t.topic);
  }, [topicAffinities]);
  
  return {
    recordInteraction,
    interactions,
    topicAffinities,
    learningProgress,
    sessionTime,
    getRecommendedTopics
  };
}
