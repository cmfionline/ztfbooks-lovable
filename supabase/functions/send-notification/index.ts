import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  title: string
  message: string
  image_url?: string
  post_type?: string
  external_link?: string
  target_audience?: Record<string, any>
  schedule_type?: 'immediate' | 'scheduled' | 'recurring'
  scheduled_for?: string
  recurring_schedule?: {
    type: 'daily' | 'weekly' | 'monthly'
    time: string
  }
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

    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .maybeSingle()

    if (settingsError || !settings) {
      console.error('Error fetching OneSignal settings:', settingsError)
      return new Response(
        JSON.stringify({ error: 'OneSignal settings not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const payload: NotificationPayload = await req.json()
    
    // Store notification in database with scheduling information
    const notificationData = {
      ...payload,
      status: payload.schedule_type === 'immediate' ? 'pending' : 'scheduled',
      scheduled_for: payload.scheduled_for || null,
      recurring_schedule: payload.recurring_schedule || null,
    }

    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single()

    if (notificationError) {
      console.error('Error storing notification:', notificationError)
      return new Response(
        JSON.stringify({ error: 'Failed to store notification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Only send immediately if it's not scheduled
    if (payload.schedule_type === 'immediate') {
      const oneSignalPayload = {
        app_id: settings.app_id,
        contents: { en: payload.message },
        headings: { en: payload.title },
        included_segments: ['All'],
        ...(payload.image_url && { big_picture: payload.image_url }),
        ...(payload.external_link && { url: payload.external_link }),
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
        return new Response(
          JSON.stringify({ error: 'Failed to send notification' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Update notification status
      await supabase
        .from('notifications')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', notification.id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification,
        message: payload.schedule_type === 'immediate' ? 'Notification sent' : 'Notification scheduled'
      }),
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