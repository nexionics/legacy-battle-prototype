import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Action = 'accept' | 'decline' | 'cancel'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await anonClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { request_id, action } = await req.json() as { request_id: string; action: Action }

    if (!request_id || !action) {
      return new Response(
        JSON.stringify({ error: 'request_id and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['accept', 'decline', 'cancel'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'action must be accept, decline, or cancel' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

    const { data: request, error: fetchError } = await serviceClient
      .from('crew_requests')
      .select('*')
      .eq('id', request_id)
      .single()

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (request.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: `Request is already ${request.status}` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'cancel' && request.requester_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Only the requester can cancel' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if ((action === 'accept' || action === 'decline') && request.requested_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Only the recipient can accept or decline' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const newStatus = action === 'accept' ? 'accepted'
      : action === 'decline' ? 'declined'
      : 'canceled'

    const { error: updateError } = await serviceClient
      .from('crew_requests')
      .update({ status: newStatus, responded_at: new Date().toISOString() })
      .eq('id', request_id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update request', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'accept') {
      const rows = [
        { user_id: request.requester_id, crew_user_id: request.requested_id },
        { user_id: request.requested_id, crew_user_id: request.requester_id },
      ]

      const { error: memberError } = await serviceClient
        .from('crew_members')
        .insert(rows)

      if (memberError) {
        console.error('Failed to insert crew_members:', memberError)
        return new Response(
          JSON.stringify({ error: 'Request accepted but crew_members insert failed', details: memberError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        action,
        status: newStatus,
        request_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in crew-respond:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
