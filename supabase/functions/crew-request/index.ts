import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    const { username } = await req.json()
    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({ error: 'username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

    const { data: target, error: lookupError } = await serviceClient
      .rpc('find_user_by_username', { p_username: username })

    if (lookupError) {
      return new Response(
        JSON.stringify({ error: 'Lookup failed', details: lookupError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!target || target.length === 0) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const targetUser = target[0]

    if (targetUser.id === user.id) {
      return new Response(
        JSON.stringify({ error: 'Cannot send a crew request to yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: existing } = await serviceClient
      .from('crew_requests')
      .select('id, status')
      .or(
        `and(requester_id.eq.${user.id},requested_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},requested_id.eq.${user.id})`
      )
      .in('status', ['pending', 'accepted'])
      .limit(1)
      .maybeSingle()

    if (existing) {
      const msg = existing.status === 'accepted'
        ? 'You are already crew members'
        : 'A pending request already exists'
      return new Response(
        JSON.stringify({ error: msg, existingStatus: existing.status }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: request, error: insertError } = await serviceClient
      .from('crew_requests')
      .insert({
        requester_id: user.id,
        requested_id: targetUser.id,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create request', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        ok: true,
        request,
        target: {
          id: targetUser.id,
          username: targetUser.username,
          display_name: targetUser.display_name,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in crew-request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
