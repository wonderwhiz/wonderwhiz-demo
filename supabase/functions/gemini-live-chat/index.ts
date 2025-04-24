
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting and security configuration
const RATE_LIMIT_REQUESTS = 30;      // Max requests per window
const RATE_LIMIT_WINDOW = 3600;      // Time window in seconds (1 hour)
const MAX_TOKEN_LIMIT = 10000;       // Max tokens per day
const FORBIDDEN_PROMPT_PATTERNS = [
  /system:/i,
  /\bsystem prompt\b/i,
  /ignore previous instructions/i,
  /\bjailbreak\b/i,
  /\bhack\b/i,
  /\bbypass\b/i,
  /\bignore\b.{0,30}\b(rules|instructions|guidelines)/i,
];

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized: Invalid token' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Rate limiting: Check if user has exceeded the rate limit
    const userId = user.id;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const windowStart = now - RATE_LIMIT_WINDOW;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    // Get user's recent API calls for rate limiting
    const { data: usageLogs, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at')
      .eq('user_id', userId)
      .eq('api_name', 'gemini-chat')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      // Continue execution but log the error
    } else if (usageLogs && usageLogs.length >= RATE_LIMIT_REQUESTS) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          message: `You can only make ${RATE_LIMIT_REQUESTS} chat requests per hour`,
          retry_after: RATE_LIMIT_WINDOW - (now - Math.floor(new Date(usageLogs[0].created_at).getTime() / 1000))
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check token usage for the day
    const { data: tokenUsage, error: tokenUsageError } = await supabase
      .from('api_usage_logs')
      .select('request_data')
      .eq('user_id', userId)
      .eq('api_name', 'gemini-chat')
      .gte('created_at', todayStart.toISOString());
    
    if (tokenUsageError) {
      console.error('Error checking token usage:', tokenUsageError);
    } else {
      // Calculate total tokens used today
      let totalTokensUsed = 0;
      if (tokenUsage) {
        totalTokensUsed = tokenUsage.reduce((sum, log) => {
          return sum + (log.request_data?.estimated_tokens || 0);
        }, 0);
      }
      
      if (totalTokensUsed >= MAX_TOKEN_LIMIT) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Daily token limit exceeded',
            message: `You have reached your daily limit of ${MAX_TOKEN_LIMIT} tokens`
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 3. Parse the request
    const { message, childDetails, history = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // 4. Security check: Prevent prompt injection
    // Check for forbidden patterns in the message
    for (const pattern of FORBIDDEN_PROMPT_PATTERNS) {
      if (pattern.test(message)) {
        console.warn('Suspicious prompt detected:', message.substring(0, 100));
        return new Response(
          JSON.stringify({
            success: false,
            message: "I can't respond to that type of request. Please ask a regular question instead.",
            error: 'Prompt contains forbidden patterns'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    }

    // 5. Get the API key from environment (never expose to client)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      throw new Error('API configuration error');
    }

    // 6. Create system prompt based on child's details
    const childAge = childDetails?.age || 10;
    const ageGroup = childAge < 8 ? 'young child (5-7 years)' : childAge < 12 ? 'child (8-11 years)' : 'teenager (12-16 years)';
    const interests = childDetails?.interests?.join(', ') || 'general topics';
    
    // Build the conversation history
    const safeHistory = Array.isArray(history) ? history : [];
    
    // Estimate tokens in the request for rate limiting
    const estimatedTokens = message.length / 4 + 
      safeHistory.reduce((sum, item) => sum + (item.content?.length || 0) / 4, 0);
    
    // 7. Call Gemini API with safety measures and error handling
    try {
      // Call Gemini API
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
                  text: `You are Whizzy, a friendly and educational AI assistant for a ${ageGroup} who is interested in ${interests}. 
                  Answer their questions in a simple, engaging, age-appropriate way, focusing on being educational.
                  Keep answers concise (max 3-4 sentences for young children, 5-6 for older).
                  Use simple language for young children (age 5-7), slightly more advanced for children (8-11), 
                  and more sophisticated for teenagers (12-16).
                  If the question is inappropriate or too complex, gently redirect to a suitable educational topic.
                  Be friendly, supportive, and encouraging of curiosity.`
                }
              ]
            },
            ...safeHistory.map((item: any) => ({
              role: item.role,
              parts: [{ text: item.content }]
            })),
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${errorText}`);
      }

      const data = await geminiResponse.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini');
      }
      
      const responseText = data.candidates[0].content.parts[0].text;
      
      // 8. Log the API usage
      const { error: logError } = await supabase
        .from('api_usage_logs')
        .insert({
          user_id: userId,
          api_name: 'gemini-chat',
          request_data: { 
            prompt_length: message.length,
            history_length: safeHistory.length,
            estimated_tokens: estimatedTokens,
            output_tokens: responseText.length / 4
          },
          response_status: 'success',
          estimated_cost: (estimatedTokens + responseText.length / 4) * 0.000004, // $0.004 per 1000 tokens
        });
      
      if (logError) {
        console.error('Error logging API usage:', logError);
        // Continue execution but log the error
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: responseText,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Return a friendly fallback message
      return new Response(
        JSON.stringify({
          success: false,
          message: "I'm having trouble right now. Can you ask me again or try a different question?",
          error: apiError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Oops! Something went wrong. Let's try again with a different question.",
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
