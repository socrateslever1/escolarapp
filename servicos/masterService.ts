import { supabase } from '../supabaseClient';
import { UsuarioEscola, UnidadeEscolar } from '../tipos';

export const masterService = {
  async listarUsuariosPlataforma(filtros?: { nome?: string; email?: string; papel?: string; unidade_id?: string }) {
    let query = supabase
      .from('usuarios')
      .select(`
        *,
        unidade:unidades_escolares(nome)
      `)
      .order('created_at', { ascending: false });

    if (filtros?.nome) query = query.ilike('nome', `%${filtros.nome}%`);
    if (filtros?.email) query = query.ilike('email', `%${filtros.email}%`);
    if (filtros?.papel) query = query.eq('papel', filtros.papel);
    if (filtros?.unidade_id) query = query.eq('unidade_id', filtros.unidade_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async listarUnidades() {
    const { data, error } = await supabase
      .from('unidades_escolares')
      .select('id, nome, codigo_inep, status')
      .order('nome');
    
    if (error) throw error;
    return data as UnidadeEscolar[];
  },

  async atualizarUsuarioTabela(id: string, payload: Partial<UsuarioEscola> & { observacoes?: string; motivo_inativacao?: string }) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        ...payload,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async atualizarAuthEmail(auth_user_id: string, novo_email: string) {
    const { data, error } = await supabase.functions.invoke('master-atualizar-auth-email', {
      body: { auth_user_id, novo_email }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    return data;
  },

  async resetarSenha(auth_user_id: string, nova_senha: string) {
    const { data, error } = await supabase.functions.invoke('master-resetar-senha', {
      body: { auth_user_id, nova_senha }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    return data;
  },

  async exonerarUsuario(id: string, motivo: string) {
    const { data, error } = await supabase.rpc('exonerar_usuario', {
      p_usuario_id: id,
      p_motivo: motivo
    });

    if (error) throw error;
    return data;
  },

  async transferirUsuario(id: string, unidade_id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        unidade_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
