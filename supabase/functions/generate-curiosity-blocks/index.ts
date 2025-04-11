
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API key from environment variable
const groqApiKey = Deno.env.get('GROQ_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, childProfile, blockCount = 5, specialistTypes = [], quickGeneration = false } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'No query provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a system prompt for generating curio blocks
    const systemPrompt = `You are an educational assistant creating engaging learning content blocks for children.
    Each block should be educational, age-appropriate, and engaging.
    Create a variety of content types to maintain interest.
    Focus on accuracy, engagement, and inspiration.
    IMPORTANT: Make sure ALL the block content is complete and thorough - never leave any content field empty.
    Each content block MUST have complete information appropriate for its type.`;

    // Create a user prompt with the query and child profile
    const userPrompt = `Generate ${blockCount} diverse educational content blocks about "${query}" for a child age ${childProfile.age || 10}.
    Use these content block types:
    - fact: Educational facts with a title and explanation
    - funFact: Interesting, memorable trivia
    - quiz: Multiple-choice questions with options and explanation
    - creative: Creative activities with clear instructions
    - mindfulness: Reflection exercises related to the topic
    
    Each block should be associated with a specialist from: ${specialistTypes.join(', ') || "nova (science), spark (creativity), prism (curiosity)"}
    
    Format your response as a JSON array:
    [
      {
        "type": "fact",
        "specialist_id": "nova",
        "content": {
          "fact": "The educational content goes here...",
          "title": "Interesting Title",
          "rabbitHoles": ["Related question 1?", "Related question 2?"]
        }
      },
      ...more blocks with different types
    ]
    
    IMPORTANT REQUIREMENTS:
    1. Each block MUST have a complete, non-empty content field with all necessary information.
    2. For quiz blocks, include a question, an array of options, correctIndex, and explanation.
    3. For fact blocks, include both fact text and title.
    4. Include at least 2 "rabbitHoles" for each block - these are related questions to explore further.
    5. DO NOT leave any required content fields empty.
    
    Keep explanations concise but engaging. Use simple language for younger children.`;

    // Call the Groq API to generate content blocks
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Groq API:', errorData);
      throw new Error('Failed to generate content blocks from Groq API');
    }

    const data = await response.json();
    
    let contentBlocks;
    try {
      // Try to parse the content as JSON
      contentBlocks = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing Groq response as JSON:', parseError);
      
      // Try to extract JSON with regex
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          contentBlocks = JSON.parse(jsonMatch[0]);
        } catch (nestedParseError) {
          console.error('Error parsing extracted JSON:', nestedParseError);
          throw new Error('Could not parse content block data');
        }
      } else {
        throw new Error('Invalid response format from AI model');
      }
    }

    // Validate blocks to ensure none have empty content fields
    const validatedBlocks = contentBlocks.map((block: any) => {
      // Check for quiz blocks with incomplete data
      if (block.type === 'quiz') {
        // Ensure each quiz has question, options, and correctIndex
        if (!block.content) block.content = {};
        if (!block.content.question || block.content.question === '') {
          block.content.question = `What do you know about ${query}?`;
        }
        if (!block.content.options || !Array.isArray(block.content.options) || block.content.options.length < 2) {
          block.content.options = ["Option A", "Option B", "Option C", "Option D"];
        }
        if (block.content.correctIndex === undefined || block.content.correctIndex === null) {
          block.content.correctIndex = 0;
        }
        if (!block.content.explanation || block.content.explanation === '') {
          block.content.explanation = `This is important to understand about ${query}.`;
        }
      }
      
      // Check for fact blocks with incomplete data
      if (block.type === 'fact') {
        if (!block.content) block.content = {};
        if (!block.content.fact || block.content.fact === '') {
          block.content.fact = `${query} is an interesting topic with many fascinating aspects to learn about.`;
        }
        if (!block.content.title || block.content.title === '') {
          block.content.title = `Fact About ${query}`;
        }
      }
      
      // Check for funFact blocks with incomplete data
      if (block.type === 'funFact') {
        if (!block.content) block.content = {};
        if (!block.content.text && !block.content.fact) {
          block.content.text = `Did you know that ${query} has some amazing properties that scientists are still studying?`;
        }
      }
      
      // Check for rabbitHoles
      if (!block.content.rabbitHoles || !Array.isArray(block.content.rabbitHoles) || block.content.rabbitHoles.length < 2) {
        block.content.rabbitHoles = [
          `What else can we learn about ${query}?`,
          `How does ${query} affect our daily life?`
        ];
      }
      
      return block;
    });

    // Generate IDs for each block
    const blocksWithIds = validatedBlocks.map((block: any, index: number) => ({
      ...block,
      id: `generated-${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      liked: false,
      bookmarked: false
    }));

    return new Response(
      JSON.stringify(blocksWithIds),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-curiosity-blocks function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error generating content blocks' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
