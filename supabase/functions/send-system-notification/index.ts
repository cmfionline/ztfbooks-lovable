import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  type: 'new_book' | 'new_promotion' | 'new_discount' | 'new_feature' | 'system_update';
  variables: Record<string, string>;
  target_audience?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
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
      throw new Error('OneSignal settings not configured')
    }

    const payload: NotificationRequest = await req.json()
    
    // Get notification template
    const { data: template, error: templateError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('type', payload.type)
      .single()

    if (templateError) {
      console.error('Error fetching template:', templateError)
      throw new Error('Template not found')
    }

    // Replace variables in template
    let title = template.title_template
    let message = template.message_template
    
    Object.entries(payload.variables).forEach(([key, value]) => {
      title = title.replace(`{{${key}}}`, value)
      message = message.replace(`{{${key}}}`, value)
    })

    // Get subscribed users
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('notification_subscriptions')
      .select('user_id')
      .eq('notification_type', payload.type)
      .eq('enabled', true)

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError)
      throw new Error('Failed to fetch subscriptions')
    }

    // Store notification in database
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([{
        title,
        message,
        status: 'pending',
        target_audience: {
          subscribed_users: subscriptions.map(sub => sub.user_id),
          ...payload.target_audience
        }
      }])
      .select()
      .single()

    if (notificationError) {
      console.error('Error storing notification:', notificationError)
      throw new Error('Failed to store notification')
    }

    // Send via OneSignal
    const oneSignalPayload = {
      app_id: settings.app_id,
      contents: { en: message },
      headings: { en: title },
      include_player_ids: subscriptions.map(sub => sub.user_id),
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
      throw new Error('Failed to send notification')
    }

    // Update notification status
    await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', notification.id)

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})