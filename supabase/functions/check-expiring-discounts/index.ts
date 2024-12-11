import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { addDays, isWithinInterval } from 'https://esm.sh/date-fns'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  title: string
  message: string
  target_audience?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get ads with discounts expiring in the next 3 days
    const { data: expiringAds, error: adsError } = await supabase
      .from('ads')
      .select('*, ad_books(book_id)')
      .not('discount_end_date', 'is', null)
      .gte('discount_end_date', new Date().toISOString())
      .lte('discount_end_date', addDays(new Date(), 3).toISOString())

    if (adsError) {
      console.error('Error fetching expiring ads:', adsError)
      throw adsError
    }

    // Get notification settings
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .maybeSingle()

    if (settingsError || !settings) {
      console.error('Error fetching OneSignal settings:', settingsError)
      throw new Error('OneSignal settings not configured')
    }

    // Send notifications for each expiring discount
    for (const ad of expiringAds) {
      const daysUntilExpiry = Math.ceil(
        (new Date(ad.discount_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )

      const notificationPayload: NotificationPayload = {
        title: 'Discount Ending Soon!',
        message: `Only ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''} left for ${ad.name}. Don't miss out!`,
        target_audience: ad.target_audience,
      }

      // Store notification in database
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          ...notificationPayload,
          status: 'pending',
          schedule_type: 'immediate',
        }])

      if (notificationError) {
        console.error('Error storing notification:', notificationError)
        continue
      }

      // Send via OneSignal
      const oneSignalPayload = {
        app_id: settings.app_id,
        contents: { en: notificationPayload.message },
        headings: { en: notificationPayload.title },
        included_segments: ['All'],
      }

      const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${settings.rest_key}`,
        },
        body: JSON.stringify(oneSignalPayload),
      })

      if (!oneSignalResponse.ok) {
        console.error('OneSignal API error:', await oneSignalResponse.text())
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent for expiring discounts' }),
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