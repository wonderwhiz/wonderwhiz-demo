
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

  try {
    // Parse request body
    const { topic, childAge = 10, count = 5 } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }

    console.log(`Generating curio suggestions for topic: "${topic}", childAge: ${childAge}, count: ${count}`);

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

Format these as a JSON array of objects, each with a "question" field. Do not include any other text in your response, just the JSON.

Example output format:
[
  {"question": "How do plants make their own food through photosynthesis?"},
  {"question": "Why are some plants carnivorous and how do they catch insects?"}
]

Make sure questions are:
- Age appropriate for ${childAge} year olds
- Educational and fact-based
- Open-ended to encourage exploration
- Directly related to the original topic
- Clear and concise (under 100 characters if possible)
- Free of any harmful, inappropriate, or overly complex content
- Varied in focus to cover different aspects of the topic`
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
        const errorData = await geminiResponse.text();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${errorData}`);
      }

      const data = await geminiResponse.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini');
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      let suggestions = [];
      try {
        // Clean the response if it contains markdown code blocks
        const cleanedResponse = responseText.replace(/```json\s*|\s*```/g, '');
        suggestions = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Raw response:', responseText);
        
        // Use a fallback approach to extract questions if JSON parsing fails
        const lines = responseText.split('\n');
        const jsonStartIndex = lines.findIndex(line => line.trim().startsWith('['));
        const jsonEndIndex = lines.findIndex(line => line.trim().startsWith(']'));
        
        if (jsonStartIndex >= 0 && jsonEndIndex >= 0) {
          const jsonSubset = lines.slice(jsonStartIndex, jsonEndIndex + 1).join('');
          try {
            suggestions = JSON.parse(jsonSubset);
          } catch (subsetError) {
            console.error('Error parsing JSON subset:', subsetError);
            // If all parsing attempts fail, use a regex fallback
            const questionMatches = responseText.match(/"question":\s*"([^"]+)"/g);
            if (questionMatches) {
              suggestions = questionMatches.map(match => {
                const question = match.match(/"question":\s*"([^"]+)"/)[1];
                return { question };
              });
            }
          }
        }
      }
      
      // If we still have no suggestions, provide fallbacks
      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        console.warn('Failed to parse suggestions, using fallbacks');
        suggestions = [
          { question: `What else can we learn about ${topic}?` },
          { question: `Why is ${topic} important?` },
          { question: `How does ${topic} affect our everyday lives?` },
          { question: `What are the most interesting facts about ${topic}?` },
          { question: `How has ${topic} changed over time?` }
        ];
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          suggestions: suggestions.slice(0, count) 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Error generating suggestions:', apiError);
      
      // Provide fallback suggestions
      const fallbackSuggestions = [
        { question: `What else can we learn about ${topic}?` },
        { question: `Why is ${topic} important?` },
        { question: `How does ${topic} affect our everyday lives?` },
        { question: `What are the most interesting facts about ${topic}?` },
        { question: `How has ${topic} changed over time?` }
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
          { question: "What other topics are you interested in?" },
          { question: "Would you like to learn about space instead?" },
          { question: "Are you curious about animals?" }
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
