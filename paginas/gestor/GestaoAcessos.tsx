
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../servicos/contexto/AuthContext';
import { gestorService } from '../../servicos/gestorService';
import { UsuarioEscola } from '../../tipos';
import ModalCriarAcesso from '../../componentes/gestor/ModalCriarAcesso';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Shield, 
  CheckCircle2, 
  Clock,
  XCircle,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

const GestaoAcessos: React.FC = () => {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioEscola[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  
  const carregarUsuarios = useCallback(async () => {
    if (!usuario?.unidade_id) return;
    
    setLoading(true);
    setErro(null);
    try {
      const data = await gestorService.listarUsuariosDaUnidade(usuario.unidade_id);
      setUsuarios(data);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [usuario?.unidade_id]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Gestão de Acessos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Controle quem acessa o sistema da sua unidade.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <UserPlus size={18} />
          Criar Novo Acesso
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl border border-slate-100 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Carregando usuários...</p>
            </div>
          ) : erro ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-rose-500">
              <AlertCircle size={40} />
              <p className="font-bold uppercase tracking-widest text-xs">{erro}</p>
              <button 
                onClick={carregarUsuarios}
                className="mt-2 px-6 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                Tentar Novamente
              </button>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Shield size={40} className="opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Papel / Cargo</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${u.nome}&background=f1f5f9&color=64748b`} 
                          className="w-10 h-10 rounded-xl dark:opacity-80" 
                          alt="Avatar"
                        />
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-slate-100">{u.nome}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg w-fit">
                        <Shield size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.papel.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg w-fit ${
                        u.ativo ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        {u.ativo ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.ativo ? 'Ativo' : 'Desativado'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ModalCriarAcesso 
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={carregarUsuarios}
        unidadeId={usuario?.unidade_id || ''}
      />
    </div>
  );
};

export default GestaoAcessos;
