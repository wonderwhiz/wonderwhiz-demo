
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

// CORS headers for the response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { childId } = await req.json();

    if (!childId) {
      return new Response(
        JSON.stringify({ error: "Child ID is required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get child profile to check age/preferences for personalization
    const { data: childProfile, error: profileError } = await supabaseAdmin
      .from("child_profiles")
      .select("*")
      .eq("id", childId)
      .single();
      
    if (profileError) {
      console.error("Error fetching child profile:", profileError);
    }

    // Get all curios for this child
    const { data: curioData, error: curioError } = await supabaseAdmin
      .from("curios")
      .select("*")
      .eq("child_id", childId);

    if (curioError) {
      throw curioError;
    }

    if (!curioData || curioData.length === 0) {
      return new Response(
        JSON.stringify({ message: "No curios found for this child" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get content blocks for these curios
    const curioIds = curioData.map(curio => curio.id);
    const { data: blockData, error: blockError } = await supabaseAdmin
      .from("content_blocks")
      .select("*")
      .in("curio_id", curioIds);

    if (blockError) {
      throw blockError;
    }

    // Process data with age-appropriate difficulty
    const childAge = childProfile?.age || 8;
    
    // Adjust processing based on age
    const processedData = processCuriosAndBlocks(curioData, blockData || [], childAge);
    
    // Generate learning history entries
    const historyEntries = generateLearningHistory(processedData, childId);
    
    // Generate topic connections with age-appropriate difficulty
    const topicConnections = generateTopicConnections(processedData, childId, childAge);
    
    // Save learning history to database 
    if (historyEntries.length > 0) {
      // First, delete existing entries for these curios to avoid duplicates
      await supabaseAdmin
        .from("learning_history")
        .delete()
        .in("curio_id", curioIds);
        
      // Insert new entries
      const { error: historyError } = await supabaseAdmin
        .from("learning_history")
        .upsert(historyEntries);
        
      if (historyError) {
        console.error("Error saving learning history:", historyError);
      }
    }
    
    // Save topic connections to database
    if (topicConnections.length > 0) {
      // Handle individual inserts to manage conflicts
      for (const connection of topicConnections) {
        // Check if this connection already exists
        const { data: existingConn } = await supabaseAdmin
          .from("topic_connections")
          .select("*")
          .eq("child_id", childId)
          .eq("from_topic", connection.from_topic)
          .eq("to_topic", connection.to_topic)
          .single();
          
        if (existingConn) {
          // Update strength if it exists
          await supabaseAdmin
            .from("topic_connections")
            .update({ 
              strength: Math.min(10, existingConn.strength + connection.strength),
              updated_at: new Date().toISOString()
            })
            .eq("id", existingConn.id);
        } else {
          // Insert new connection
          await supabaseAdmin
            .from("topic_connections")
            .insert(connection);
        }
      }
    }

    // Calculate and update memory strengths for this child
    try {
      const { data: refreshResult } = await supabaseAdmin.rpc(
        "refresh_memory_strengths",
        { child_id_param: childId }
      );
      
      console.log("Updated memory strengths for items:", refreshResult);
    } catch (refreshError) {
      console.error("Error refreshing memory strengths:", refreshError);
    }

    // Generate personalized insights and recommendations
    const personalizedData = await generatePersonalizedInsights(
      supabaseAdmin, 
      childId, 
      processedData, 
      childProfile
    );

    return new Response(
      JSON.stringify({
        success: true,
        processedCurios: processedData.length,
        historyEntriesCreated: historyEntries.length,
        connectionsCreated: topicConnections.length,
        ...personalizedData
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in analyze-learning-patterns function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Process curios and their blocks to extract topics
function processCuriosAndBlocks(curios, blocks, childAge) {
  // Adjust difficulty based on child age
  const ageAppropriateExtraction = childAge <= 8 ? 'simple' : childAge <= 12 ? 'moderate' : 'advanced';
  
  return curios.map(curio => {
    const curioBlocks = blocks.filter(block => block.curio_id === curio.id);
    
    // Extract topics from blocks
    const extractedTopics = new Set();
    const extractedSubtopics = new Set();
    
    curioBlocks.forEach(block => {
      // Extract text from content
      let text = "";
      
      if (block.type === "fact" && block.content.fact) {
        text = typeof block.content.fact === "string" 
          ? block.content.fact 
          : JSON.stringify(block.content.fact);
      } else if (block.content && typeof block.content === "object") {
        text = JSON.stringify(block.content);
      }
      
      // Adjust keyword extraction based on age
      let minTopicLength = 4;
      let minSubtopicLength = 3;
      
      if (ageAppropriateExtraction === 'simple') {
        // For younger children (6-8), use simpler, more concrete topics
        minTopicLength = 3;
        
        // Simple extraction for young children - focus on concrete nouns
        const simpleWords = text.split(/\W+/).filter(word => 
          word.length >= minTopicLength && !isCommonWord(word.toLowerCase())
        );
        
        simpleWords.forEach(word => {
          if (word.length >= 5) {
            extractedTopics.add(word.toLowerCase());
          } else if (word.length >= minSubtopicLength) {
            extractedSubtopics.add(word.toLowerCase());
          }
        });
      } else {
        // More nuanced extraction for older children
        const words = text.split(/\W+/).filter(word => 
          word.length > minTopicLength && !isCommonWord(word.toLowerCase())
        );
        
        words.forEach(word => {
          if (word.length > 6) {
            extractedTopics.add(word.toLowerCase());
          } else if (word.length > minSubtopicLength) {
            extractedSubtopics.add(word.toLowerCase());
          }
        });
      }
    });
    
    // Calculate engagement
    const likedBlocks = curioBlocks.filter(block => block.liked);
    const engagementLevel = curioBlocks.length > 0 
      ? (likedBlocks.length / curioBlocks.length) * 10 
      : 0;
    
    return {
      curio,
      blocks: curioBlocks,
      extractedTopics: Array.from(extractedTopics),
      extractedSubtopics: Array.from(extractedSubtopics),
      engagementLevel,
      bookmarkedCount: curioBlocks.filter(block => block.bookmarked).length
    };
  });
}

// Generate learning history entries from processed data
function generateLearningHistory(processedData, childId) {
  return processedData.map(item => ({
    child_id: childId,
    topic: item.curio.title,
    subtopics: item.extractedSubtopics,
    interaction_date: item.curio.created_at,
    engagement_level: item.engagementLevel,
    content_block_ids: item.blocks.map(block => block.id),
    curio_id: item.curio.id,
    revisit_count: item.curio.revisit_count || 0,
    last_revisited: item.curio.last_revisited,
    comprehension_level: determineComprehensionLevel(item),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

// Generate topic connections between related curios
function generateTopicConnections(processedData, childId, childAge) {
  const connections = [];
  
  // Adjust connection complexity based on age
  const maxConnections = childAge <= 8 ? 10 : childAge <= 10 ? 15 : 25;
  
  // For younger children, focus more on temporal connections (things learned around same time)
  // For older children, focus more on semantic connections (related concepts)
  const useSemanticFocus = childAge >= 9;
  
  // Look for connections
  for (let i = 0; i < processedData.length - 1; i++) {
    for (let j = i + 1; j < processedData.length; j++) {
      const itemA = processedData[i];
      const itemB = processedData[j];
      
      let strength = 0;
      let connectionType = "temporal";
      
      // Temporal proximity (curios explored close in time)
      const dateA = new Date(itemA.curio.created_at);
      const dateB = new Date(itemB.curio.created_at);
      const daysDiff = Math.abs((dateA.getTime() - dateB.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff < 1) {
        strength += useSemanticFocus ? 2 : 3;
      } else if (daysDiff < 7) {
        strength += useSemanticFocus ? 1 : 2;
      } else if (daysDiff < 30) {
        strength += useSemanticFocus ? 0 : 1;
      }
      
      // Topic similarity (common extracted topics)
      const commonTopics = itemA.extractedTopics.filter(topic => 
        itemB.extractedTopics.includes(topic)
      );
      
      if (commonTopics.length > 0) {
        strength += useSemanticFocus ? commonTopics.length * 2 : commonTopics.length;
        connectionType = "semantic";
      }
      
      // If significant connection, add it
      if (strength > 1) {
        connections.push({
          child_id: childId,
          from_topic: itemA.curio.title,
          to_topic: itemB.curio.title,
          strength: Math.min(10, strength), // Cap at 10
          connection_type: connectionType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Don't exceed max connections limit based on age
      if (connections.length >= maxConnections) {
        return connections;
      }
    }
  }
  
  return connections;
}

// Determine comprehension level based on engagement
function determineComprehensionLevel(item) {
  const { engagementLevel, bookmarkedCount, blocks } = item;
  
  // Basic heuristic: Higher engagement and bookmarks suggest better comprehension
  if (engagementLevel > 7 || bookmarkedCount > 2) {
    return "advanced";
  } else if (engagementLevel > 4 || bookmarkedCount > 0) {
    return "intermediate";
  } else {
    return "basic";
  }
}

// Helper to filter common words
function isCommonWord(word) {
  const commonWords = [
    "the", "and", "that", "have", "for", "not", "with", "you", "this", "but",
    "his", "from", "they", "she", "will", "would", "there", "their", "what",
    "about", "which", "when", "make", "like", "time", "just", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "than",
    "then", "now", "look", "only", "come", "over", "think", "also", "back",
    "after", "use", "two", "how", "work", "first", "well", "even", "want",
    "because", "these", "give", "most"
  ];
  
  return commonWords.includes(word);
}

// Generate personalized insights and recommendations
async function generatePersonalizedInsights(supabaseAdmin, childId, processedData, childProfile) {
  const insights = [];
  const patterns = {
    favoriteTopics: [],
    averageEngagement: 0,
    learningFrequency: 'moderate',
    preferredDifficulty: 'medium'
  };

  // Get learning history for deeper analysis
  const { data: learningHistory } = await supabaseAdmin
    .from('learning_history')
    .select('*')
    .eq('child_id', childId)
    .order('interaction_date', { ascending: false })
    .limit(50);

  // Get recent learning topics
  const { data: learningTopics } = await supabaseAdmin
    .from('learning_topics')
    .select('*')
    .eq('child_id', childId)
    .order('updated_at', { ascending: false })
    .limit(10);

  // Analyze patterns from processed data
  if (processedData && processedData.length > 0) {
    const topicCounts = {};
    let totalEngagement = 0;

    processedData.forEach(item => {
      // Count topic frequency
      topicCounts[item.curio.title] = (topicCounts[item.curio.title] || 0) + 1;
      totalEngagement += item.engagementLevel || 0;
      
      // Analyze extracted topics
      item.extractedTopics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 0.5;
      });
    });

    patterns.favoriteTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    patterns.averageEngagement = totalEngagement / processedData.length;
  }

  // Add learning history analysis
  if (learningHistory && learningHistory.length > 0) {
    const historyTopicCounts = {};
    let historyEngagement = 0;

    learningHistory.forEach(entry => {
      historyTopicCounts[entry.topic] = (historyTopicCounts[entry.topic] || 0) + 1;
      historyEngagement += entry.engagement_level || 0.5;
    });

    // Merge with existing patterns
    Object.entries(historyTopicCounts).forEach(([topic, count]) => {
      const existingIndex = patterns.favoriteTopics.indexOf(topic);
      if (existingIndex === -1 && patterns.favoriteTopics.length < 5) {
        patterns.favoriteTopics.push(topic);
      }
    });

    // Update average engagement with history data
    const totalEntries = processedData.length + learningHistory.length;
    if (totalEntries > 0) {
      patterns.averageEngagement = (patterns.averageEngagement * processedData.length + historyEngagement) / totalEntries;
    }
  }

  // Generate insights based on patterns
  const childAge = childProfile?.age || 10;
  const isYoungChild = childAge <= 8;

  if (patterns.favoriteTopics.length > 0) {
    insights.push({
      id: 'favorite-topics',
      title: isYoungChild ? 'Your Favorite Things to Learn!' : 'Your Learning Strengths',
      description: isYoungChild 
        ? `You love learning about ${patterns.favoriteTopics[0]}! You're becoming an expert! 🌟`
        : `You've shown strong interest in ${patterns.favoriteTopics[0]}, demonstrating focused learning in this area.`,
      type: 'strength',
      confidence: 0.9,
      icon: '🌟'
    });
  }

  if (patterns.averageEngagement > 0.7) {
    insights.push({
      id: 'high-engagement',
      title: isYoungChild ? 'Super Focused Learner!' : 'Excellent Focus',
      description: isYoungChild
        ? 'You stay super focused when learning new things! That helps you remember everything better! 🎯'
        : 'Your engagement levels show excellent focus and attention during learning sessions.',
      type: 'strength',
      confidence: 0.85,
      icon: '🎯'
    });
  }

  if (processedData.length > 5) {
    insights.push({
      id: 'curiosity-explorer',
      title: isYoungChild ? 'Curiosity Champion!' : 'Knowledge Explorer',
      description: isYoungChild
        ? `Wow! You've explored ${processedData.length} different topics! You're so curious! 🔍`
        : `You've actively explored ${processedData.length} different topics, showing strong intellectual curiosity.`,
      type: 'achievement',
      confidence: 0.95,
      icon: '🔍'
    });
  }

  // Generate personalized content suggestions
  const personalizedContent = {
    suggestedTopics: [],
    continueWhere: [],
    achievements: []
  };

  // Age-appropriate topic suggestions
  const ageSuitableSuggestions = isYoungChild ? [
    { 
      title: "How do butterflies get their colors?", 
      reason: "Perfect for curious minds like yours!",
      difficulty: "Easy",
      estimatedTime: "5 min",
      icon: "🦋"
    },
    { 
      title: "Why do we have different seasons?", 
      reason: "Nature mysteries you'll love discovering!",
      difficulty: "Easy", 
      estimatedTime: "7 min",
      icon: "🌍"
    },
    { 
      title: "How do birds learn to fly?", 
      reason: "Amazing animal facts await!",
      difficulty: "Easy",
      estimatedTime: "6 min", 
      icon: "🐦"
    },
    { 
      title: "What makes thunder so loud?", 
      reason: "Cool weather science for you!",
      difficulty: "Easy",
      estimatedTime: "5 min", 
      icon: "⛈️"
    }
  ] : [
    { 
      title: "The Science Behind Lightning Formation", 
      reason: "Complex weather phenomena you'll find fascinating",
      difficulty: "Medium",
      estimatedTime: "10 min",
      icon: "⚡"
    },
    { 
      title: "How Ancient Civilizations Built Pyramids", 
      reason: "Engineering marvels and historical mysteries",
      difficulty: "Medium",
      estimatedTime: "12 min",
      icon: "🏛️"
    },
    { 
      title: "The Future of Space Exploration", 
      reason: "Cutting-edge science and technology",
      difficulty: "Medium",
      estimatedTime: "15 min",
      icon: "🚀"
    },
    { 
      title: "How Quantum Computing Works", 
      reason: "Advanced technology that's changing our world",
      difficulty: "Hard",
      estimatedTime: "18 min",
      icon: "🔬"
    }
  ];

  personalizedContent.suggestedTopics = ageSuitableSuggestions;

  // Continue where you left off - from processed curios
  if (processedData && processedData.length > 0) {
    personalizedContent.continueWhere = processedData
      .slice(0, 3)
      .map(item => ({
        title: item.curio.title,
        progress: Math.min(90, Math.max(30, item.engagementLevel * 10)), // Convert engagement to progress
        lastAccessed: item.curio.last_updated_at || item.curio.created_at,
        type: 'curio'
      }));
  }

  // Add learning topics to continue section
  if (learningTopics && learningTopics.length > 0) {
    personalizedContent.continueWhere.push(
      ...learningTopics
        .slice(0, 2)
        .map(topic => ({
          title: topic.title,
          progress: Math.round(((topic.current_section || 1) / (topic.total_sections || 5)) * 100),
          lastAccessed: topic.updated_at,
          type: 'encyclopedia'
        }))
    );
  }

  // Generate achievements
  const totalExplorations = processedData.length + (learningTopics?.length || 0);
  if (totalExplorations > 0) {
    personalizedContent.achievements = [
      {
        title: isYoungChild ? "Explorer Badge! 🎒" : "Knowledge Explorer",
        description: isYoungChild
          ? `Amazing! You've started ${totalExplorations} learning adventures! Keep exploring! 🚀`
          : `You've completed ${totalExplorations} learning sessions, showing dedication to knowledge acquisition.`,
        earnedAt: new Date().toISOString(),
        icon: "🎒",
        rarity: totalExplorations > 15 ? 'legendary' : totalExplorations > 8 ? 'rare' : 'common'
      }
    ];

    // Add engagement-based achievement
    if (patterns.averageEngagement > 0.8) {
      personalizedContent.achievements.push({
        title: isYoungChild ? "Focus Master! 🎯" : "Engagement Champion",
        description: isYoungChild
          ? "You're amazing at paying attention and learning! Your focus is super strong! ⭐"
          : "Your consistently high engagement levels demonstrate exceptional learning focus.",
        earnedAt: new Date().toISOString(),
        icon: "🎯",
        rarity: 'rare'
      });
    }
  }

  return {
    insights,
    patterns,
    personalizedContent
  };
}
