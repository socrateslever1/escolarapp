import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, Key, Mail, Building2, UserCircle, CheckCircle2, AlertTriangle, UserX, ArrowLeftRight } from 'lucide-react';
import { masterService } from '../../servicos/masterService';
import { UsuarioEscola, UnidadeEscolar, PapelUsuario } from '../../tipos';
import ModalResetSenha from './ModalResetSenha';
import ModalExonerarUsuario from './ModalExonerarUsuario';

interface Props {
  usuario: UsuarioEscola & { unidade?: { nome: string } };
  unidades: UnidadeEscolar[];
  onClose: () => void;
  onSuccess: () => void;
}

const PAPEIS: PapelUsuario[] = [
  'admin_plataforma', 'gestor', 'pedagogia', 'secretaria', 'professor', 'familia', 'portaria', 'servicos_gerais', 'supervisor'
];

const ModalEditarUsuario: React.FC<Props> = ({ usuario, unidades, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
    nivel: usuario.nivel,
    unidade_id: usuario.unidade_id,
    ativo: usuario.ativo
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estados para modais secundários
  const [showResetSenha, setShowResetSenha] = useState(false);
  const [showExonerar, setShowExonerar] = useState(false);

  const handleSalvar = async () => {
    setCarregando(true);
    setErro(null);
    setSucesso(null);

    try {
      // 1. Se o email mudou, atualizar no Auth via Edge Function
      if (formData.email !== usuario.email) {
        await masterService.atualizarAuthEmail(usuario.auth_user_id, formData.email);
      }

      // 2. Atualizar dados na tabela usuarios
      await masterService.atualizarUsuarioTabela(usuario.id, formData);

      setSucesso('Usuário atualizado com sucesso!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErro(err.message || 'Erro ao atualizar usuário.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <UserCircle className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Editar Usuário</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestão de Identidade Institucional</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {erro && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertTriangle size={18} />
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                {sucesso}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Institucional</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Papel */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Papel / Função</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    value={formData.papel}
                    onChange={e => setFormData({ ...formData, papel: e.target.value as PapelUsuario })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none"
                  >
                    {PAPEIS.map(p => (
                      <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nível */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nível de Acesso (0-9)</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={formData.nivel}
                  onChange={e => setFormData({ ...formData, nivel: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Unidade */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unidade Escolar</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    id="unidade-select"
                    value={formData.unidade_id}
                    onChange={e => setFormData({ ...formData, unidade_id: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none"
                  >
                    <option value="">Sem Unidade (Global)</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ativo */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:col-span-2">
                <div>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200">Status da Conta</p>
                  <p className="text-[10px] font-bold text-slate-400">Define se o usuário pode acessar o sistema</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, ativo: !formData.ativo })}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.ativo ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.ativo ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Ações Administrativas */}
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ações Críticas</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowResetSenha(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Key size={14} />
                  Resetar Senha
                </button>
                <button
                  onClick={() => {
                    const select = document.getElementById('unidade-select');
                    if (select) {
                      select.focus();
                      select.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <ArrowLeftRight size={14} />
                  Transferir Unidade
                </button>
                <button
                  onClick={() => setShowExonerar(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <UserX size={14} />
                  Arquivar Usuário
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/30 dark:bg-slate-800/30">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-[11px] font-black uppercase tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={carregando}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {carregando ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modais Secundários */}
      {showResetSenha && (
        <ModalResetSenha 
          authUserId={usuario.auth_user_id}
          nomeUsuario={usuario.nome}
          onClose={() => setShowResetSenha(false)}
        />
      )}

      {showExonerar && (
        <ModalExonerarUsuario 
          usuarioId={usuario.id}
          nomeUsuario={usuario.nome}
          onClose={() => setShowExonerar(false)}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default ModalEditarUsuario;
