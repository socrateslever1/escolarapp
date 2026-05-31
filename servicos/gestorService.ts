import { supabase } from '../supabaseClient';
import { UsuarioEscola } from '../tipos';

export const gestorService = {
  async listarUsuariosDaUnidade(unidadeId: string): Promise<UsuarioEscola[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('unidade_id', unidadeId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar usuários da unidade:', error);
      throw new Error(error.message);
    }

    return (data || []) as UsuarioEscola[];
  },

  async criarUsuarioDaUnidade(payload: {
    nome: string;
    email: string;
    senha?: string;
    papel: string;
    nivel: number;
    unidade_id: string;
    observacoes?: string;
  }) {
    const { data, error } = await supabase.functions.invoke('criar-usuario-escola', {
      body: payload,
    });

    if (error) {
      console.error('Erro ao invocar function criar-usuario-escola:', error);
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    return data;
  }
};
