import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { voucherId, userId } = await req.json()

    // Validate request
    if (!voucherId || !userId) {
      throw new Error('Missing required fields')
    }

    // Get voucher details
    const { data: voucher, error: voucherError } = await supabaseClient
      .from('vouchers')
      .select('*, voucher_books(book_id), voucher_series(series_id)')
      .eq('id', voucherId)
      .single()

    if (voucherError) throw voucherError
    if (!voucher) throw new Error('Voucher not found')

    // Check if voucher is already redeemed
    if (voucher.redeemed) {
      throw new Error('Voucher already redeemed')
    }

    // Start transaction
    const { error: updateError } = await supabaseClient
      .from('vouchers')
      .update({
        redeemed: true,
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', voucherId)

    if (updateError) throw updateError

    // Calculate and update sales agent commission
    if (voucher.created_by) {
      const { data: agent } = await supabaseClient
        .from('sales_agents')
        .select('commission_rate')
        .eq('user_id', voucher.created_by)
        .single()

      if (agent) {
        const commission = (voucher.total_amount * agent.commission_rate) / 100
        await supabaseClient
          .from('sales_agents')
          .update({
            total_sales: supabaseClient.sql`total_sales + ${voucher.total_amount}`,
            total_commission: supabaseClient.sql`total_commission + ${commission}`,
          })
          .eq('user_id', voucher.created_by)
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Voucher redeemed successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})