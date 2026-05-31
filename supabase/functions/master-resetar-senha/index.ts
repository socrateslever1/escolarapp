import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('URL_SUPABASE') ?? '',
      Deno.env.get('CHAVE_SERVICE_ROLE') ?? '',
      { auth: { persistSession: false } }
    )

    const { auth_user_id, nova_senha } = await req.json()

    // 1. Validar se quem chama é Master
    const authHeader = req.headers.get('Authorization')!
    const userClient = createClient(
      Deno.env.get('URL_SUPABASE') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) throw new Error('Não autorizado')

    const { data: perfil, error: perfilError } = await supabaseClient
      .from('usuarios')
      .select('papel')
      .eq('auth_user_id', user.id)
      .single()

    if (perfilError || perfil?.papel !== 'admin_plataforma') {
      throw new Error('Acesso restrito a administradores da plataforma')
    }

    // 2. Atualizar senha no Auth
    const { error: authError } = await supabaseClient.auth.admin.updateUserById(
      auth_user_id,
      { password: nova_senha }
    )

    if (authError) throw authError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
