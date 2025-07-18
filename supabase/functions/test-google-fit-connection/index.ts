import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    
    if (!googleClientId) {
      throw new Error('Google Client ID não configurado')
    }

    // Test basic Google OAuth configuration
    const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&response_type=code&scope=openid`
    
    const response = await fetch(testUrl, { method: 'HEAD' })
    
    if (response.status === 200 || response.status === 302) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Google OAuth configuration is valid',
          clientId: googleClientId.substring(0, 20) + '...'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      throw new Error('Invalid Google OAuth configuration')
    }
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