
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 20;     // Max requests
const RATE_LIMIT_WINDOW = 3600;     // Time window in seconds (1 hour)

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Rate limiting: Check if user has exceeded the rate limit
    const userId = user.id;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    // Get user's recent API calls
    const { data: usageLogs, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at')
      .eq('user_id', userId)
      .eq('api_name', 'quick-answer')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      // Continue execution but log the error
    } else if (usageLogs && usageLogs.length >= RATE_LIMIT_REQUESTS) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `You can only make ${RATE_LIMIT_REQUESTS} requests per hour`,
          retry_after: RATE_LIMIT_WINDOW - (now - Math.floor(new Date(usageLogs[0].created_at).getTime() / 1000))
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse the request
    const reqBody = await req.json();
    const { query, question, childAge, childProfile } = reqBody;
    
    // Support both "query" and "question" fields for backward compatibility
    const actualQuestion = query || question;

    if (!actualQuestion) {
      throw new Error('Query is required');
    }

    // 4. Security check: Limit question length
    if (actualQuestion.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Query is too long (max 500 characters)' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 5. Get API key from environment
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Adapt the prompt based on child's age
    let ageGuidance = '';
    // Get age from either childAge directly or from childProfile object
    const age = childAge || (childProfile?.age ? childProfile.age : 10);
    
    if (age <= 7) {
      ageGuidance = 'Explain in very simple terms suitable for a 5-7 year old. Use short sentences and simple words.';
    } else if (age <= 11) {
      ageGuidance = 'Explain in clear terms suitable for an 8-11 year old. Use accessible language but introduce some educational terms.';
    } else {
      ageGuidance = 'Explain in engaging terms suitable for a 12-16 year old. Use appropriate educational language and concepts.';
    }

    const curioContext = reqBody.curioContext || ''; 
    const contextPrompt = curioContext ? 
      `The child is learning about "${curioContext}". ` : 
      '';

    // Create system prompt
    const systemPrompt = `
      You are Whizzy, a friendly AI assistant for a children's educational platform called WonderWhiz.
      ${contextPrompt}
      ${ageGuidance}
      Keep your answer concise (maximum 4 sentences) but informative and engaging.
      Focus on making learning fun and memorable.
      Always be encouraging and positive.
    `;

    console.log(`Generating quick answer for question: "${actualQuestion}"`);

    // 6. Call Gemini API to generate the answer
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: actualQuestion }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 200,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the answer from Gemini response
    let answer = "I'm not sure about that. Would you like to explore something else?";
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      answer = data.candidates[0].content.parts[0].text || answer;
    }

    console.log(`Successfully generated answer: "${answer.substring(0, 50)}..."`);
    
    // 7. Log the API usage
    const estimatedTokens = actualQuestion.length / 4 + answer.length / 4;
    const { error: logError } = await supabase
      .from('api_usage_logs')
      .insert({
        user_id: userId,
        api_name: 'quick-answer',
        request_data: { 
          query_length: actualQuestion.length,
          response_length: answer.length,
          estimated_tokens: estimatedTokens
        },
        response_status: 'success',
        estimated_cost: estimatedTokens * 0.000004, // $0.004 per 1000 tokens
      });
    
    if (logError) {
      console.error('Error logging API usage:', logError);
      // Continue execution but log the error
    }
    
    return new Response(
      JSON.stringify({ answer, source: 'api' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-quick-answer function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
