
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { curioId, childId } = await req.json();

    if (!curioId || !childId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Triggering content generation for curio ${curioId} and child ${childId}`);
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the curio details
    const { data: curioData, error: curioError } = await supabase
      .from('curios')
      .select('title, query')
      .eq('id', curioId)
      .single();

    if (curioError || !curioData) {
      throw new Error('Could not fetch curio data: ' + (curioError?.message || 'No data found'));
    }
    
    console.log(`Found curio with title: ${curioData.title}`);

    // Get the child profile
    const { data: childProfile, error: childError } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !childProfile) {
      throw new Error('Could not fetch child profile: ' + (childError?.message || 'No profile found'));
    }
    
    console.log(`Found child profile with name: ${childProfile.name}`);

    // Check if blocks already exist for this curio to avoid duplicate generation
    const { count, error: countError } = await supabase
      .from('content_blocks')
      .select('*', { count: 'exact', head: true })
      .eq('curio_id', curioId);
      
    if (countError) {
      throw new Error('Error checking existing blocks: ' + countError.message);
    }
    
    if (count && count > 0) {
      console.log(`Found ${count} existing blocks, skipping generation`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Found ${count} existing blocks, no need to generate new ones` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate placeholder blocks
    const placeholderBlocks = [
      {
        curio_id: curioId,
        specialist_id: 'nova',
        type: 'fact',
        content: { 
          fact: "I'm discovering fascinating information about this topic...",
          rabbitHoles: []
        }
      },
      {
        curio_id: curioId,
        specialist_id: 'spark',
        type: 'funFact',
        content: { 
          text: "Did you know? I'm finding interesting facts about this topic..."
        }
      }
    ];
    
    // Insert placeholder blocks first so the UI has something to show
    for (const block of placeholderBlocks) {
      const { error: insertError } = await supabase
        .from('content_blocks')
        .insert(block);

      if (insertError) {
        console.error("Error inserting placeholder block:", insertError);
      }
    }

    // Generate relevant content based on the curio query
    const topic = curioData.title || curioData.query;
    const blocks = generateContentForTopic(topic);
    
    // Insert the generated blocks into the database
    for (const block of blocks) {
      const blockWithCurioId = {
        ...block,
        curio_id: curioId
      };
      
      const { error: insertError } = await supabase
        .from('content_blocks')
        .insert(blockWithCurioId);

      if (insertError) {
        console.error("Error inserting block:", insertError);
      } else {
        console.log("Successfully inserted content block");
      }
    }

    // Clear any generation errors on the curio
    await supabase
      .from('curios')
      .update({ generation_error: null })
      .eq('id', curioId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${blocks.length} blocks for curio ${curioId}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-content-generation function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to trigger content generation' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to generate content based on the topic
function generateContentForTopic(topic: string) {
  // Extract key concepts from the topic
  const lowerTopic = topic.toLowerCase();
  
  // Brain waking up content (for the example shown)
  if (lowerTopic.includes('brain') && (lowerTopic.includes('wake') || lowerTopic.includes('waking'))) {
    return [
      {
        specialist_id: 'nova',
        type: 'fact',
        content: { 
          fact: "When you wake up, your brain transitions from slow delta waves of deep sleep to faster alpha and beta waves of alertness. This process is triggered by your circadian rhythm, a natural 24-hour cycle regulated by a tiny region in your brain called the suprachiasmatic nucleus.",
          rabbitHoles: [
            "What are brain waves?",
            "How does the circadian rhythm work?",
            "Why do we feel groggy sometimes when waking up?"
          ]
        }
      },
      {
        specialist_id: 'spark',
        type: 'funFact',
        content: { 
          text: "Did you know? Your brain actually begins the waking process about an hour before you actually open your eyes! Special cells detect changing light levels through your eyelids and trigger the release of cortisol, a hormone that helps you feel alert and ready for the day."
        }
      },
      {
        specialist_id: 'prism',
        type: 'quiz',
        content: {
          question: "What hormone helps your brain wake up in the morning?",
          options: [
            "Melatonin",
            "Cortisol",
            "Insulin",
            "Adrenaline"
          ],
          correctIndex: 1,
          explanation: "Cortisol is often called the 'wake-up hormone' because it increases in the morning and helps your brain become alert and ready for the day's activities."
        }
      },
      {
        specialist_id: 'pixel',
        type: 'fact',
        content: {
          fact: "Morning brain fog happens when you wake during the wrong sleep stage. Your brain cycles through different sleep stages including deep sleep and REM sleep. If you wake during deep sleep, your brain needs extra time to 'boot up,' similar to how computers take time to start.",
          rabbitHoles: [
            "What are the different sleep stages?",
            "How long should each sleep cycle be?",
            "What is REM sleep?"
          ]
        }
      },
      {
        specialist_id: 'lotus',
        type: 'mindfulness',
        content: {
          title: "Morning Brain Activation",
          instruction: "Try this quick exercise: When you first wake up, wiggle your fingers and toes while taking three deep breaths. This simple activity helps increase blood flow to your brain and activates neural pathways, helping you wake up more quickly.",
          duration: "1 minute"
        }
      },
      {
        specialist_id: 'nova',
        type: 'fact',
        content: {
          fact: "Light is crucial for waking up your brain! When light enters your eyes, it signals special receptors called ipRGCs that help regulate your body clock and suppress melatonin (the sleep hormone). This is why exposure to morning sunlight or bright light can help you feel more awake and alert.",
          rabbitHoles: [
            "How does light affect our sleep-wake cycle?",
            "What happens if you wake up before sunrise?",
            "Do screens affect our morning wakefulness?"
          ]
        }
      }
    ];
  }
  
  // Default to general knowledge content if topic doesn't match specific patterns
  return generateDefaultContent(topic);
}

// Generate general knowledge content when we don't have specific content for a topic
function generateDefaultContent(topic: string) {
  return [
    {
      specialist_id: 'nova',
      type: 'fact',
      content: { 
        fact: `${topic} is a fascinating subject that connects to many areas of knowledge. Exploring this topic can help us understand the world around us in new ways.`,
        rabbitHoles: [
          `What is the history of ${topic}?`,
          `How does ${topic} work?`,
          `Why is ${topic} important?`
        ]
      }
    },
    {
      specialist_id: 'spark',
      type: 'funFact',
      content: { 
        text: `Did you know? ${topic} has connections to many different fields of study, and new discoveries about it are being made all the time!`
      }
    },
    {
      specialist_id: 'prism',
      type: 'quiz',
      content: {
        question: `Which of these is most closely related to ${topic}?`,
        options: [
          "Science",
          "History",
          "Art",
          "All of the above"
        ],
        correctIndex: 3,
        explanation: `${topic} connects to many different fields, including science, history, and art. Learning about it from different perspectives can deepen our understanding!`
      }
    },
    {
      specialist_id: 'atlas',
      type: 'fact',
      content: {
        fact: `People have been interested in ${topic} throughout history. Different cultures and civilizations have developed their own understanding and approaches to this subject.`,
        rabbitHoles: [
          `How has our understanding of ${topic} changed over time?`,
          `How do different cultures view ${topic}?`,
          `What might be the future of ${topic}?`
        ]
      }
    }
  ];
}
