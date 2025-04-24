
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Received request to generate-curio-suggestions");

  try {
    // Parse request body
    const reqText = await req.text();
    let requestBody;
    
    try {
      requestBody = JSON.parse(reqText);
      console.log("Request body parsed successfully:", JSON.stringify(requestBody).substring(0, 200));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      console.log("Raw request body:", reqText);
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }
    
    const { topic, childAge = 10, count = 5, buildingBlockType = null } = requestBody;
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }

    console.log(`Generating curio suggestions for topic: "${topic}", childAge: ${childAge}, count: ${count}, buildingBlockType: ${buildingBlockType}`);

    // Create a specific prompt based on the building block type if provided
    let specificPrompt = '';
    if (buildingBlockType) {
      switch(buildingBlockType) {
        case 'foundational':
          specificPrompt = `Focus on basic, foundational knowledge about ${topic} that a ${childAge} year old should know. These should be clear, simple facts that form the basis of understanding the topic.`;
          break;
        case 'expansion':
          specificPrompt = `Build upon basic knowledge of ${topic} with more detailed information. Focus on "how" and "why" questions that expand understanding for a ${childAge} year old.`;
          break;
        case 'connection':
          specificPrompt = `Create questions that help a ${childAge} year old connect ${topic} to other related topics or to their daily life. Focus on relationships between concepts.`;
          break;
        case 'application':
          specificPrompt = `Generate questions that encourage a ${childAge} year old to apply what they've learned about ${topic} in practical ways or through creative thinking.`;
          break;
        case 'deeper_dive':
          specificPrompt = `Create more complex, thought-provoking questions about ${topic} that challenge a ${childAge} year old to think more deeply about the subject.`;
          break;
        default:
          specificPrompt = '';
      }
    }

    try {
      // Call Gemini API to generate suggestions
      const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an AI designed to generate interesting, educational, and age-appropriate questions for children aged ${childAge} that build upon a topic they're currently learning about.

Based on the topic "${topic}", generate ${count} engaging follow-up questions that would spark a child's curiosity and motivate them to learn more. 
${specificPrompt}

Format these as a JSON array of objects, each with a "question" field and a "learningStage" field that can be one of: "foundational", "expansion", "connection", "application", or "deeper_dive".

Do not include any other text in your response, just the JSON.

Example output format:
[
  {"question": "How do plants make their own food through photosynthesis?", "learningStage": "foundational"},
  {"question": "Why are some plants carnivorous and how do they catch insects?", "learningStage": "deeper_dive"}
]

Make sure questions are:
- Age appropriate for ${childAge} year olds
- Educational and fact-based
- Open-ended to encourage exploration
- Directly related to the original topic
- Clear and concise (under 100 characters if possible)
- Free of any harmful, inappropriate, or overly complex content
- Varied in focus to cover different aspects of the topic
- Distributed across different learning stages to build progressive understanding`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }

      const data = await geminiResponse.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini');
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Raw Gemini response:', responseText.substring(0, 200) + '...');
      
      // Parse the JSON response
      let suggestions = [];
      try {
        // Clean the response if it contains markdown code blocks
        const cleanedResponse = responseText.replace(/```json\s*|\s*```/g, '').trim();
        console.log('Cleaned JSON:', cleanedResponse.substring(0, 200) + '...');
        suggestions = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Raw response:', responseText);
        
        // Use a fallback approach to extract questions if JSON parsing fails
        const lines = responseText.split('\n');
        const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('['));
        const jsonEndIndex = lines.findIndex(line => line.trim().startsWith(']'));
        
        if (jsonStartIndex >= 0 && jsonEndIndex >= 0 && jsonEndIndex > jsonStartIndex) {
          const jsonSubset = lines.slice(jsonStartIndex, jsonEndIndex + 1).join('');
          try {
            console.log('Attempting to parse JSON subset:', jsonSubset);
            suggestions = JSON.parse(jsonSubset);
          } catch (subsetError) {
            console.error('Error parsing JSON subset:', subsetError);
            // If all parsing attempts fail, use a regex fallback
            const questionMatches = responseText.match(/"question":\s*"([^"]+)"/g);
            if (questionMatches) {
              suggestions = questionMatches.map(match => {
                const question = match.match(/"question":\s*"([^"]+)"/)[1];
                return { 
                  question,
                  learningStage: "foundational" // Default stage if parsing fails
                };
              });
            }
          }
        }
      }
      
      // If we still have no suggestions, provide fallbacks
      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        console.warn('Failed to parse suggestions, using fallbacks');
        suggestions = [
          { question: `What else can we learn about ${topic}?`, learningStage: "foundational" },
          { question: `Why is ${topic} important?`, learningStage: "expansion" },
          { question: `How does ${topic} affect our everyday lives?`, learningStage: "connection" },
          { question: `What are the most interesting facts about ${topic}?`, learningStage: "foundational" },
          { question: `How has ${topic} changed over time?`, learningStage: "deeper_dive" }
        ];
      }
      
      // Ensure suggestions are valid objects with question field
      const validSuggestions = suggestions
        .filter(s => s && typeof s === 'object' && typeof s.question === 'string')
        .map(s => ({ 
          question: s.question,
          learningStage: s.learningStage || "foundational" 
        }))
        .slice(0, count);
        
      console.log(`Generated ${validSuggestions.length} valid suggestions`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          suggestions: validSuggestions
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Error generating suggestions:', apiError);
      
      // Provide fallback suggestions
      const fallbackSuggestions = [
        { question: `What else can we learn about ${topic}?`, learningStage: "foundational" },
        { question: `Why is ${topic} important?`, learningStage: "expansion" },
        { question: `How does ${topic} affect our everyday lives?`, learningStage: "connection" },
        { question: `What are the most interesting facts about ${topic}?`, learningStage: "foundational" },
        { question: `How has ${topic} changed over time?`, learningStage: "deeper_dive" }
      ];
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          suggestions: fallbackSuggestions.slice(0, count),
          error: apiError.message,
          fallback: true 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in generate-curio-suggestions:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message, 
        suggestions: [
          { question: "What other topics are you interested in?", learningStage: "connection" },
          { question: "Would you like to learn about space instead?", learningStage: "connection" },
          { question: "Are you curious about animals?", learningStage: "connection" }
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even with errors to prevent crashing the frontend
      }
    );
  }
});
