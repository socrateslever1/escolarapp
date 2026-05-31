import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, Edit3, Shield, 
  Building2, Mail, CheckCircle2, XCircle, ChevronRight,
  RefreshCw, AlertCircle, UserPlus, Key, UserX, ArrowLeftRight
} from 'lucide-react';
import { masterService } from '../../servicos/masterService';
import { supabase } from '../../supabaseClient';
import { UsuarioEscola, UnidadeEscolar, PapelUsuario } from '../../tipos';
import ModalEditarUsuario from '../../componentes/master/ModalEditarUsuario';
import ModalResetSenha from '../../componentes/master/ModalResetSenha';
import ModalExonerarUsuario from '../../componentes/master/ModalExonerarUsuario';

const GestaoUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<(UsuarioEscola & { unidade?: { nome: string } })[]>([]);
  const [unidades, setUnidades] = useState<UnidadeEscolar[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroPapel, setFiltroPapel] = useState<string>('');
  const [filtroUnidade, setFiltroUnidade] = useState<string>('');

  // Modais
  const [usuarioEditando, setUsuarioEditando] = useState<(UsuarioEscola & { unidade?: { nome: string } }) | null>(null);
  const [usuarioResetSenha, setUsuarioResetSenha] = useState<(UsuarioEscola) | null>(null);
  const [usuarioExonerar, setUsuarioExonerar] = useState<(UsuarioEscola) | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [users, schools] = await Promise.all([
        masterService.listarUsuariosPlataforma({
          nome: busca,
          papel: filtroPapel,
          unidade_id: filtroUnidade
        }),
        masterService.listarUnidades()
      ]);
      setUsuarios(users as any);
      setUnidades(schools);
    } catch (err: any) {
      setErro('Falha ao carregar dados da plataforma.');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtroPapel, filtroUnidade]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    carregarDados();
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[1.25rem] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Usuários</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Controle de Acesso e Identidade Global</p>
          </div>
        </div>

        <button className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10">
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4">
        <form onSubmit={handleBusca} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
          />
        </form>

        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <select 
              value={filtroPapel}
              onChange={e => setFiltroPapel(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none min-w-[180px]"
            >
              <option value="">Todos os Papéis</option>
              <option value="admin_plataforma">Master</option>
              <option value="gestor">Gestor</option>
              <option value="supervisor">Supervisor</option>
              <option value="pedagogia">Pedagogia</option>
              <option value="secretaria">Secretaria</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <select 
              value={filtroUnidade}
              onChange={e => setFiltroUnidade(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none min-w-[220px]"
            >
              <option value="">Todas as Unidades</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={carregarDados}
            className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-all"
          >
            <RefreshCw size={20} className={carregando ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {carregando && usuarios.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Base de Dados...</p>
          </div>
        ) : erro ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4 text-rose-500">
            <AlertCircle size={48} />
            <p className="text-sm font-bold">{erro}</p>
            <button onClick={carregarDados} className="text-[10px] font-black uppercase tracking-widest underline">Tentar Novamente</button>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
            <Users size={48} strokeWidth={1} />
            <p className="text-sm font-bold">Nenhum usuário encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel / Nível</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {usuarios.map(user => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs">
                          {user.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-700 dark:text-slate-200 leading-none">{user.nome}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Mail size={12} className="text-slate-300" />
                            <p className="text-[11px] font-bold text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          user.papel === 'admin_plataforma' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                          user.papel === 'gestor' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {user.papel.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Shield size={12} />
                          <span className="text-[10px] font-black">{user.nivel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Building2 size={14} className="text-slate-300" />
                        <span className="text-[11px] font-bold">{user.unidade?.nome || 'Global / Master'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {user.ativo ? (
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Ativo</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-400">
                          <XCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Inativo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setUsuarioResetSenha(user)}
                          title="Resetar Senha"
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => setUsuarioEditando(user)}
                          title="Transferir / Editar"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                        >
                          <ArrowLeftRight size={16} />
                        </button>
                        <button 
                          onClick={() => setUsuarioExonerar(user)}
                          title="Arquivar Usuário"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                        >
                          <UserX size={16} />
                        </button>
                        <button 
                          onClick={() => setUsuarioEditando(user)}
                          title="Editar Perfil"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {usuarioEditando && (
        <ModalEditarUsuario 
          usuario={usuarioEditando}
          unidades={unidades}
          onClose={() => setUsuarioEditando(null)}
          onSuccess={carregarDados}
        />
      )}
      {/* Modais de Ação Rápida */}
      {usuarioResetSenha && (
        <ModalResetSenha 
          authUserId={usuarioResetSenha.auth_user_id}
          nomeUsuario={usuarioResetSenha.nome}
          onClose={() => setUsuarioResetSenha(null)}
        />
      )}

      {usuarioExonerar && (
        <ModalExonerarUsuario 
          usuarioId={usuarioExonerar.id}
          nomeUsuario={usuarioExonerar.nome}
          onClose={() => setUsuarioExonerar(null)}
          onSuccess={carregarDados}
        />
      )}

      <button
        onClick={async () => {
          const { data, error } = await supabase.functions.invoke(
            "admin-reset-senha",
            {
              body: {
                user_id: "33f7db9c-9807-49d8-82b2-dafd7be193c9",
                nova_senha: "87654321"
              }
            }
          );

          alert(JSON.stringify({ data, error }));
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        TESTAR RESET SENHA
      </button>
    </div>
  );
};

export default GestaoUsuarios;
