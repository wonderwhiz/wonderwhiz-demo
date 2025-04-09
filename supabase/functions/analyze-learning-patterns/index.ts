
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
    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get request body
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

    // Process data and extract topics
    const processedData = processCuriosAndBlocks(curioData, blockData || []);
    
    // Generate learning history entries
    const historyEntries = generateLearningHistory(processedData, childId);
    
    // Generate topic connections
    const topicConnections = generateTopicConnections(processedData, childId);
    
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

    return new Response(
      JSON.stringify({
        success: true,
        processedCurios: processedData.length,
        historyEntriesCreated: historyEntries.length,
        connectionsCreated: topicConnections.length
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
function processCuriosAndBlocks(curios, blocks) {
  return curios.map(curio => {
    const curioBlocks = blocks.filter(block => block.curio_id === curio.id);
    
    // Extract topics from blocks (simple version - in a real implementation this would use NLP)
    const extractedTopics = new Set();
    const extractedSubtopics = new Set();
    
    curioBlocks.forEach(block => {
      // Extract text from content based on block type
      let text = "";
      
      if (block.type === "fact" && block.content.fact) {
        text = typeof block.content.fact === "string" 
          ? block.content.fact 
          : JSON.stringify(block.content.fact);
      } else if (block.content && typeof block.content === "object") {
        text = JSON.stringify(block.content);
      }
      
      // Simple keyword extraction (very basic - would use NLP in production)
      const words = text.split(/\W+/).filter(word => 
        word.length > 4 && !isCommonWord(word.toLowerCase())
      );
      
      // Add significant words as topics
      words.forEach(word => {
        if (word.length > 6) {
          extractedTopics.add(word.toLowerCase());
        } else if (word.length > 4) {
          extractedSubtopics.add(word.toLowerCase());
        }
      });
    });
    
    // Calculate engagement (based on liked blocks)
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
function generateTopicConnections(processedData, childId) {
  const connections = [];
  
  // Look for connections based on various factors
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
        strength += 3;
      } else if (daysDiff < 7) {
        strength += 2;
      } else if (daysDiff < 30) {
        strength += 1;
      }
      
      // Topic similarity (common extracted topics)
      const commonTopics = itemA.extractedTopics.filter(topic => 
        itemB.extractedTopics.includes(topic)
      );
      
      if (commonTopics.length > 0) {
        strength += commonTopics.length;
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
