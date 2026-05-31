
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../servicos/contexto/AuthContext';
import { User, Lock, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const PerfilUsuario: React.FC = () => {
  const { usuario } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
    }
  }, [usuario]);

  const atualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    
    setLoading(true);
    setMensagem(null);

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ nome })
        .eq('auth_user_id', usuario.auth_user_id);

      if (error) throw error;
      
      setMensagem({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao atualizar perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const atualizarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    setLoadingSenha(true);
    setMensagem(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;
      
      setSenha('');
      setConfirmarSenha('');
      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao alterar senha.' });
    } finally {
      setLoadingSenha(false);
    }
  };

  return (
    <div className="p-4 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Meu Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie suas informações pessoais e segurança da conta.</p>
      </div>

      {mensagem && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          mensagem.tipo === 'sucesso' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
        }`}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-bold">{mensagem.texto}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dados Pessoais */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <User size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Dados Pessoais</h2>
          </div>

          <form onSubmit={atualizarPerfil} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="space-y-1.5 opacity-60">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail (Não alterável)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 cursor-not-allowed font-bold text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Salvar Alterações
            </button>
          </form>
        </div>

        {/* Segurança */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Lock size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Segurança</h2>
          </div>

          <form onSubmit={atualizarSenha} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nova Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingSenha}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {loadingSenha ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
              Alterar Senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
