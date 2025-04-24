
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting and security configuration
const RATE_LIMIT_REQUESTS = 30;      // Max requests per hour
const RATE_LIMIT_WINDOW = 3600;      // Time window in seconds
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract JWT token and verify
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token');
    }

    // 2. Rate limiting checks
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    // Check hourly rate limit
    const { data: recentRequests, error: usageError } = await supabase
      .from('api_usage_logs')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('api_name', 'gemini-chat')
      .gte('created_at', new Date(windowStart * 1000).toISOString());
    
    if (usageError) {
      console.error('Error checking rate limit:', usageError);
      throw new Error('Error checking rate limit');
    }

    if (recentRequests && recentRequests.length >= RATE_LIMIT_REQUESTS) {
      throw new Error(`Rate limit exceeded. Maximum ${RATE_LIMIT_REQUESTS} requests per hour.`);
    }

    // Check daily token usage
    const { data: tokenUsage } = await supabase
      .from('api_usage_logs')
      .select('request_data')
      .eq('user_id', user.id)
      .eq('api_name', 'gemini-chat')
      .gte('created_at', todayStart.toISOString());
    
    let totalTokensUsed = 0;
    if (tokenUsage) {
      totalTokensUsed = tokenUsage.reduce((sum, log) => {
        return sum + (log.request_data?.estimated_tokens || 0);
      }, 0);
    }
    
    if (totalTokensUsed >= MAX_TOKEN_LIMIT) {
      throw new Error(`Daily token limit of ${MAX_TOKEN_LIMIT} tokens exceeded`);
    }

    // 3. Parse and validate request
    const { message, childDetails, history = [] } = await req.json();
    if (!message) {
      throw new Error('Message is required');
    }

    // 4. Security check: Prevent prompt injection
    for (const pattern of FORBIDDEN_PROMPT_PATTERNS) {
      if (pattern.test(message)) {
        throw new Error('Prompt contains forbidden patterns');
      }
    }

    // 5. Call Gemini API
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Estimate tokens for rate limiting
    const estimatedTokens = message.length / 4 + 
      history.reduce((sum, item) => sum + (item.content?.length || 0) / 4, 0);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const answer = data.candidates[0].content.parts[0].text;

    // 6. Log API usage
    const outputTokens = answer.length / 4;
    await supabase
      .from('api_usage_logs')
      .insert({
        user_id: user.id,
        api_name: 'gemini-chat',
        request_data: { 
          prompt_length: message.length,
          history_length: history.length,
          estimated_tokens: estimatedTokens,
          output_tokens: outputTokens
        },
        response_status: 'success',
        estimated_cost: (estimatedTokens + outputTokens) * 0.000004 // $0.004 per 1000 tokens
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: answer,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        status: error.message?.includes('Unauthorized') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
