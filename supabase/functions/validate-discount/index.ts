import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateDiscountRequest {
  discountId: string;
  userId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { discountId, userId } = await req.json() as ValidateDiscountRequest

    // Get discount details
    const { data: discount, error: discountError } = await supabaseClient
      .from('discounts')
      .select('*')
      .eq('id', discountId)
      .single()

    if (discountError || !discount) {
      return new Response(
        JSON.stringify({ error: 'Discount not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Check if discount has reached total usage limit
    if (discount.max_total_uses && discount.current_total_uses >= discount.max_total_uses) {
      return new Response(
        JSON.stringify({ error: 'Discount has reached maximum total uses' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check user's usage of this discount
    if (discount.max_uses_per_user) {
      const { count, error: usageError } = await supabaseClient
        .from('discount_usage')
        .select('*', { count: 'exact', head: true })
        .eq('discount_id', discountId)
        .eq('user_id', userId)

      if (usageError) {
        console.error('Error checking usage:', usageError)
        return new Response(
          JSON.stringify({ error: 'Error checking discount usage' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (count && count >= discount.max_uses_per_user) {
        return new Response(
          JSON.stringify({ error: 'You have reached the maximum uses for this discount' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }

    // Record usage and update total count
    const { error: insertError } = await supabaseClient
      .from('discount_usage')
      .insert([
        { discount_id: discountId, user_id: userId }
      ])

    if (insertError) {
      if (insertError.code === '23505') { // Unique violation
        return new Response(
          JSON.stringify({ error: 'You have already used this discount' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      console.error('Error recording usage:', insertError)
      return new Response(
        JSON.stringify({ error: 'Error recording discount usage' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Update total usage count
    const { error: updateError } = await supabaseClient
      .from('discounts')
      .update({ current_total_uses: discount.current_total_uses + 1 })
      .eq('id', discountId)

    if (updateError) {
      console.error('Error updating usage count:', updateError)
      // Don't return error since usage was already recorded
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})