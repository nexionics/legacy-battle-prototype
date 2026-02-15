import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const XP_VERIFIED_RESOLUTION = 100

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: activeBattles, error: battlesError } = await supabase
      .from('battles')
      .select('id, event_id, status')
      .eq('status', 'active')
      .not('event_id', 'is', null)

    if (battlesError) {
      throw battlesError
    }

    if (!activeBattles || activeBattles.length === 0) {
      return new Response(
        JSON.stringify({ resolved: 0, message: 'No active battles to resolve' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const eventIds = [...new Set(activeBattles.map(b => b.event_id).filter(Boolean))]

    const { data: finalEvents, error: eventsError } = await supabase
      .from('sports_events')
      .select('id, home_team, away_team, home_score, away_score, status')
      .in('id', eventIds)
      .eq('status', 'final')

    if (eventsError) {
      throw eventsError
    }

    if (!finalEvents || finalEvents.length === 0) {
      return new Response(
        JSON.stringify({ resolved: 0, message: 'No linked events are final yet' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const finalEventMap = new Map(
      finalEvents.map(e => [e.id, e])
    )

    const battlesToResolve = activeBattles.filter(b => finalEventMap.has(b.event_id))

    const results: Array<{ battleId: string; winnerId: string | null; error?: string }> = []

    for (const battle of battlesToResolve) {
      try {
        const event = finalEventMap.get(battle.event_id)!

        const { data: participants, error: partError } = await supabase
          .from('battle_participants')
          .select('id, user_id, pick')
          .eq('battle_id', battle.id)

        if (partError || !participants) {
          results.push({ battleId: battle.id, winnerId: null, error: 'Failed to load participants' })
          continue
        }

        const homeScore = Number(event.home_score || 0)
        const awayScore = Number(event.away_score || 0)
        const winnerTeam =
          homeScore > awayScore ? event.home_team :
          awayScore > homeScore ? event.away_team :
          'TIE'

        let winnerId: string | null = null
        if (winnerTeam !== 'TIE') {
          const winningParticipant = participants.find(p => p.pick === winnerTeam)
          if (winningParticipant) {
            winnerId = winningParticipant.user_id
          }
        }

        const { error: updateError } = await supabase
          .from('battles')
          .update({
            status: 'completed',
            winner_id: winnerId,
            final_outcome: {
              home_team: event.home_team,
              away_team: event.away_team,
              home_score: homeScore,
              away_score: awayScore,
            },
            resolved_at: new Date().toISOString(),
          })
          .eq('id', battle.id)
          .eq('status', 'active')

        if (updateError) {
          results.push({ battleId: battle.id, winnerId: null, error: updateError.message })
          continue
        }

        for (const participant of participants) {
          await supabase
            .from('xp_events')
            .insert({
              user_id: participant.user_id,
              event_type: 'verified_resolution',
              source_type: 'battle',
              source_id: battle.id,
              points: XP_VERIFIED_RESOLUTION,
            })

          await supabase.rpc('recompute_profile_xp', {
            p_user_id: participant.user_id,
          })

          const { data: profile } = await supabase
            .from('profiles')
            .select('level')
            .eq('id', participant.user_id)
            .single()

          if (profile?.level && profile.level !== 'Challenger') {
            const rankAchievementMap: Record<string, string> = {
              Contender: 'rank_contender',
              Rival: 'rank_rival',
              Warrior: 'rank_warrior',
              Champion: 'rank_champion',
              Legend: 'rank_legend',
            }
            const achievementId = rankAchievementMap[profile.level]
            if (achievementId) {
              await supabase
                .from('user_achievements')
                .insert({
                  user_id: participant.user_id,
                  achievement_id: achievementId,
                })
            }
          }
        }

        results.push({ battleId: battle.id, winnerId })
      } catch (err) {
        results.push({ battleId: battle.id, winnerId: null, error: String(err) })
      }
    }

    const resolvedCount = results.filter(r => !r.error).length

    return new Response(
      JSON.stringify({
        resolved: resolvedCount,
        total: battlesToResolve.length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in resolve-battles:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
