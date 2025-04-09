
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LearningHistoryItem {
  id: string;
  child_id: string;
  topic: string;
  subtopics: string[];
  interaction_date: string;
  engagement_level: number;
  content_block_ids: string[];
  curio_id: string;
  curio_title: string;
  last_revisited?: string;
  revisit_count: number;
  comprehension_level: 'basic' | 'intermediate' | 'advanced';
}

export interface TopicConnection {
  from_topic: string;
  to_topic: string;
  strength: number;
  child_id: string;
}

export const useChildLearningHistory = (childId?: string) => {
  const [learningHistory, setLearningHistory] = useState<LearningHistoryItem[]>([]);
  const [topicConnections, setTopicConnections] = useState<TopicConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyViewedTopics, setRecentlyViewedTopics] = useState<string[]>([]);
  const [strongestTopics, setStrongestTopics] = useState<{topic: string, level: number}[]>([]);
  
  // Fetch learning history for a child
  const fetchLearningHistory = useCallback(async () => {
    if (!childId) return;
    
    setIsLoading(true);
    
    try {
      // First, fetch all curios the child has interacted with
      const { data: curioData, error: curioError } = await supabase
        .from('curios')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });
      
      if (curioError) throw curioError;
      
      // Then, fetch content blocks for these curios to analyze engagement
      if (curioData && curioData.length > 0) {
        const curioIds = curioData.map(curio => curio.id);
        
        const { data: blockData, error: blockError } = await supabase
          .from('content_blocks')
          .select('*')
          .in('curio_id', curioIds);
          
        if (blockError) throw blockError;
        
        // Process this data into learning history items
        if (blockData) {
          // Group blocks by curio_id
          const blocksByCurio = blockData.reduce((acc, block) => {
            if (!acc[block.curio_id]) {
              acc[block.curio_id] = [];
            }
            acc[block.curio_id].push(block);
            return acc;
          }, {} as Record<string, any[]>);
          
          // Create learning history items from curios and their blocks
          const historyItems: LearningHistoryItem[] = curioData.map(curio => {
            const curioBlocks = blocksByCurio[curio.id] || [];
            
            // Extract topics from the content
            const topics = new Set<string>();
            const subtopics = new Set<string>();
            
            curioBlocks.forEach(block => {
              // Extract topics from block content (simplified)
              if (block.type === 'fact' && block.content.fact) {
                const factText = typeof block.content.fact === 'string' 
                  ? block.content.fact 
                  : JSON.stringify(block.content.fact);
                
                // Extract keywords as potential topics
                const words = factText.split(/\s+/);
                words.forEach(word => {
                  if (word.length > 4 && !commonWords.includes(word.toLowerCase())) {
                    if (word.length > 6) {
                      topics.add(word.toLowerCase());
                    } else {
                      subtopics.add(word.toLowerCase());
                    }
                  }
                });
              }
            });
            
            // Calculate engagement level based on liked blocks
            const likedBlocksCount = curioBlocks.filter(block => block.liked).length;
            const engagementLevel = curioBlocks.length > 0 
              ? (likedBlocksCount / curioBlocks.length) * 10 
              : 0;
            
            return {
              id: `history-${curio.id}`,
              child_id: childId,
              topic: curio.title,
              subtopics: Array.from(subtopics),
              interaction_date: curio.created_at,
              engagement_level: engagementLevel,
              content_block_ids: curioBlocks.map(block => block.id),
              curio_id: curio.id,
              curio_title: curio.title,
              revisit_count: 0,
              comprehension_level: 'basic' as const
            };
          });
          
          setLearningHistory(historyItems);
          
          // Extract recently viewed topics (last 5)
          const recent = historyItems.slice(0, 5).map(item => item.topic);
          setRecentlyViewedTopics(recent);
          
          // Find strongest topics (highest engagement)
          const strongest = historyItems
            .sort((a, b) => b.engagement_level - a.engagement_level)
            .slice(0, 5)
            .map(item => ({ topic: item.topic, level: item.engagement_level }));
          setStrongestTopics(strongest);
          
          // Generate topic connections based on temporal proximity and content similarity
          generateTopicConnections(historyItems);
        }
      }
    } catch (error) {
      console.error('Error fetching learning history:', error);
      toast.error('Could not load learning history');
    } finally {
      setIsLoading(false);
    }
  }, [childId]);
  
  // Generate connections between topics based on learning patterns
  const generateTopicConnections = (items: LearningHistoryItem[]) => {
    if (items.length < 2) return;
    
    const connections: TopicConnection[] = [];
    
    // Look for connections based on temporal proximity (topics explored close in time)
    for (let i = 0; i < items.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 4, items.length); j++) {
        const itemA = items[i];
        const itemB = items[j];
        
        // Calculate a similarity/connection strength (simplified)
        // Future: use more sophisticated NLP techniques
        let strength = 0;
        
        // Topics explored close in time (within a day) get a connection
        const dateA = new Date(itemA.interaction_date);
        const dateB = new Date(itemB.interaction_date);
        const daysDiff = Math.abs((dateA.getTime() - dateB.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff < 1) strength += 5;
        else if (daysDiff < 7) strength += 3;
        else if (daysDiff < 30) strength += 1;
        
        // Add connection if strength is significant
        if (strength > 0) {
          connections.push({
            from_topic: itemA.topic,
            to_topic: itemB.topic,
            strength,
            child_id: childId || ''
          });
        }
      }
    }
    
    setTopicConnections(connections);
  };
  
  // Find related topics to a given topic
  const findRelatedTopics = useCallback((topic: string): string[] => {
    // Find direct connections
    const directConnections = topicConnections
      .filter(conn => conn.from_topic === topic || conn.to_topic === topic)
      .map(conn => conn.from_topic === topic ? conn.to_topic : conn.from_topic)
      .sort((a, b) => {
        const strengthA = topicConnections.find(
          conn => (conn.from_topic === topic && conn.to_topic === a) || 
                  (conn.to_topic === topic && conn.from_topic === a)
        )?.strength || 0;
        
        const strengthB = topicConnections.find(
          conn => (conn.from_topic === topic && conn.to_topic === b) || 
                  (conn.to_topic === topic && conn.from_topic === b)
        )?.strength || 0;
        
        return strengthB - strengthA;
      });
    
    return directConnections.slice(0, 5); // Return top 5 related topics
  }, [topicConnections]);
  
  // Track when a topic is revisited
  const trackTopicRevisit = useCallback(async (curioId: string) => {
    if (!childId) return;
    
    // Find the history item for this curio
    const item = learningHistory.find(h => h.curio_id === curioId);
    if (!item) return;
    
    // Update the revisit count and date
    const updatedItem = {
      ...item,
      revisit_count: item.revisit_count + 1,
      last_revisited: new Date().toISOString()
    };
    
    // Update local state
    setLearningHistory(prev => 
      prev.map(h => h.curio_id === curioId ? updatedItem : h)
    );
    
    // In a real implementation, you'd also update this in the database
    try {
      // This is a placeholder for database update logic
      console.log('Tracked topic revisit:', updatedItem);
    } catch (error) {
      console.error('Error tracking topic revisit:', error);
    }
  }, [childId, learningHistory]);
  
  // Get personalized topic suggestions based on learning history
  const getPersonalizedSuggestions = useCallback((): string[] => {
    if (learningHistory.length === 0) return [];
    
    // Strategy 1: Find topics to revisit (spaced repetition)
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const topicsToRevisit = learningHistory
      .filter(item => {
        const interactionDate = new Date(item.interaction_date);
        // Topics from 1-6 months ago that haven't been revisited much
        return interactionDate > oneMonthAgo && 
               interactionDate < now && 
               item.revisit_count < 2;
      })
      .map(item => `Learn more about ${item.topic}`);
    
    // Strategy 2: Find connections between topics they've explored
    const connectionSuggestions = topicConnections
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 3)
      .map(conn => `How are ${conn.from_topic} and ${conn.to_topic} connected?`);
    
    // Strategy 3: Suggest deeper exploration of high-engagement topics
    const deeperSuggestions = strongestTopics
      .slice(0, 2)
      .map(item => `Tell me something amazing about ${item.topic}`);
    
    // Combine suggestions
    return [...topicsToRevisit.slice(0, 2), ...connectionSuggestions.slice(0, 2), ...deeperSuggestions]
      .slice(0, 5); // Return top 5 suggestions
  }, [learningHistory, topicConnections, strongestTopics]);
  
  // Helper: Common words to filter out when extracting topics
  const commonWords = [
    'the', 'and', 'that', 'have', 'for', 'not', 'this', 'but', 'with',
    'you', 'from', 'they', 'will', 'what', 'when', 'how', 'where', 'why',
    'about', 'their', 'there', 'would', 'could', 'should', 'which'
  ];
  
  // Load learning history when component mounts
  useEffect(() => {
    if (childId) {
      fetchLearningHistory();
    }
  }, [childId, fetchLearningHistory]);
  
  return {
    learningHistory,
    topicConnections,
    isLoading,
    recentlyViewedTopics,
    strongestTopics,
    findRelatedTopics,
    trackTopicRevisit,
    getPersonalizedSuggestions,
    refreshHistory: fetchLearningHistory
  };
};
