import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Get database credentials from environment variables
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { type, blockId, childId, content } = await req.json()

    if (!childId) {
      return new Response(
        JSON.stringify({ error: 'Child ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if the child profile exists
    const { data: childData, error: childError } = await supabaseClient
      .from('child_profiles')
      .select('id')
      .eq('id', childId)
      .single()

    if (childError || !childData) {
      return new Response(
        JSON.stringify({ error: 'Child profile not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let result

    switch (type) {
      case 'like':
        if (!blockId) {
          return new Response(
            JSON.stringify({ error: 'Block ID is required for like action' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Toggle like status in content_blocks
        const { data: blockData, error: blockError } = await supabaseClient
          .from('content_blocks')
          .select('liked')
          .eq('id', blockId)
          .single()

        if (blockError) {
          throw blockError
        }

        result = await supabaseClient
          .from('content_blocks')
          .update({ liked: !blockData.liked })
          .eq('id', blockId)
        break

      case 'bookmark':
        if (!blockId) {
          return new Response(
            JSON.stringify({ error: 'Block ID is required for bookmark action' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Toggle bookmark status in content_blocks
        const { data: bookmarkData, error: bookmarkError } = await supabaseClient
          .from('content_blocks')
          .select('bookmarked')
          .eq('id', blockId)
          .single()

        if (bookmarkError) {
          throw bookmarkError
        }

        result = await supabaseClient
          .from('content_blocks')
          .update({ bookmarked: !bookmarkData.bookmarked })
          .eq('id', blockId)
        break

      case 'quiz':
        if (!blockId) {
          return new Response(
            JSON.stringify({ error: 'Block ID is required for quiz action' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Award sparks for quiz completion
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 5
        })

        // Record quiz completion
        await supabaseClient.from('child_daily_activity').upsert({
          child_profile_id: childId,
          activity_date: new Date().toISOString().split('T')[0],
          quizzes_completed: 1
        }, {
          onConflict: 'child_profile_id, activity_date',
          ignoreDuplicates: false
        })

        result = { success: true, message: 'Quiz completed' }
        break

      case 'task':
        // Award sparks for task completion
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 8
        })

        // Record task completion
        await supabaseClient.from('child_daily_activity').upsert({
          child_profile_id: childId,
          activity_date: new Date().toISOString().split('T')[0],
          tasks_completed: 1
        }, {
          onConflict: 'child_profile_id, activity_date',
          ignoreDuplicates: false
        })

        result = { success: true, message: 'Task completed' }
        break

      case 'activity':
        // Award sparks for activity completion
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 3
        })

        result = { success: true, message: 'Activity completed' }
        break

      case 'mindfulness':
        // Award sparks for mindfulness completion
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 5
        })

        result = { success: true, message: 'Mindfulness completed' }
        break

      case 'news':
        if (!blockId) {
          return new Response(
            JSON.stringify({ error: 'Block ID is required for news action' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Award sparks for reading news
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 3
        })

        result = { success: true, message: 'News read' }
        break

      case 'creative':
        if (!blockId) {
          return new Response(
            JSON.stringify({ error: 'Block ID is required for creative action' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Award sparks for creative upload
        await supabaseClient.rpc('increment_sparks_balance', {
          child_id: childId,
          amount: 10
        })

        result = { success: true, message: 'Creative upload processed' }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid interaction type' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error handling interaction:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
