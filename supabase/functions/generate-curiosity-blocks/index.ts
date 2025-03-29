
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, childProfile } = await req.json();
    const language = childProfile.language || 'English';

    // Construct prompt for Claude to generate content blocks in a specific format and language
    const systemPrompt = `You are an AI assistant creating educational content for children aged ${childProfile.age}. 
    Generate 10 diverse, engaging content blocks about the topic: "${query}". 

    Each block should be appropriate for the age group and aligned with these interests: ${childProfile.interests.join(', ')}.

    VERY IMPORTANT: All content must be in ${language} language.

    Return your response as a JSON array with 10 objects, each having this structure:
    {
      "type": "one of: fact, quiz, flashcard, creative, task, riddle, funFact, activity, news, mindfulness",
      "specialist_id": "one of: nova, spark, prism, pixel, atlas, lotus",
      "content": {
        // Different fields based on block type
      }
    }

    For each block type, include these specific fields:
    - fact: { "fact": "text", "rabbitHoles": ["question1", "question2"] }
    - quiz: { "question": "text", "options": ["option1", "option2", "option3", "option4"], "correctIndex": 0-3 }
    - flashcard: { "front": "question", "back": "answer" }
    - creative: { "prompt": "text", "type": "drawing or writing" }
    - task: { "task": "text", "reward": 5-10 }
    - riddle: { "riddle": "text", "answer": "text" }
    - funFact: { "fact": "text", "rabbitHoles": ["question1", "question2"] }
    - activity: { "activity": "text" }
    - news: { "headline": "text", "summary": "text", "source": "WonderWhiz News" }
    - mindfulness: { "exercise": "text", "duration": 30-60 }

    Specialist assignments:
    - nova: exploration and discovery topics
    - spark: science and experiments
    - prism: arts and creativity
    - pixel: technology and coding
    - atlas: geography and history
    - lotus: wellbeing and mindfulness

    Make the content educational, engaging, and fun in ${language} language!`;

    console.log("Sending request to Claude API");
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CLAUDE_API_KEY,
        'Anthropic-Version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          { role: 'user', content: systemPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Claude response received:", data);
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Claude API");
    }
    
    // Extract the JSON content from Claude's response
    const text = data.content[0].text;
    
    // Find and parse the JSON array in Claude's response
    let contentBlocksJSON;
    try {
      // Try to extract a JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        contentBlocksJSON = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try parsing the whole text as JSON
        contentBlocksJSON = JSON.parse(text);
      }
    } catch (error) {
      console.error("Error parsing Claude's response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse content blocks from Claude's response");
    }
    
    // Assign unique IDs to each block
    const contentBlocks = contentBlocksJSON.map((block: any) => ({
      ...block,
      id: crypto.randomUUID(),
      liked: false,
      bookmarked: false
    }));

    console.log("Processed content blocks:", contentBlocks);

    return new Response(JSON.stringify(contentBlocks), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating curiosity blocks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
