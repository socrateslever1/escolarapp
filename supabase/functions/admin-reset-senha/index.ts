import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { user_id, nova_senha } = await req.json();

    if (!user_id || !nova_senha) {
      return new Response(
        JSON.stringify({ error: "Dados obrigatórios ausentes." }),
        { status: 400 }
      );
    }

    if (nova_senha.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres." }),
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    // VALIDAR SE QUEM CHAMOU É MASTER
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Não autenticado." }),
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userAuth } = await supabaseAdmin.auth.getUser(token);
    if (!userAuth?.user) {
      return new Response(
        JSON.stringify({ error: "Usuário inválido." }),
        { status: 401 }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from("usuarios")
      .select("papel, ativo")
      .eq("auth_user_id", userAuth.user.id)
      .single();

    if (!perfil || perfil.papel !== "admin_plataforma" || !perfil.ativo) {
      return new Response(
        JSON.stringify({ error: "Acesso negado. Apenas Master pode alterar senhas." }),
        { status: 403 }
      );
    }

    // ALTERAR SENHA
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user_id,
      { password: nova_senha }
    );

    if (error) throw error;

    return new Response(
      JSON.stringify({ sucesso: true }),
      { status: 200 }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});
