import React, { useState } from 'react';
import { X, Key, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { masterService } from '../../servicos/masterService';

interface Props {
  authUserId: string;
  nomeUsuario: string;
  onClose: () => void;
}

const ModalResetSenha: React.FC<Props> = ({ authUserId, nomeUsuario, onClose }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      await masterService.resetarSenha(authUserId, novaSenha);
      setSucesso(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setErro(err.message || 'Erro ao resetar senha.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Key className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Resetar Senha</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Segurança da Conta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleReset} className="p-8 space-y-6">
          {sucesso ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">Senha Alterada!</p>
                <p className="text-xs text-slate-400 mt-1">A nova senha já está ativa para o usuário.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="text-amber-600 shrink-0" size={18} />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                  Você está definindo uma nova senha para <span className="underline">{nomeUsuario}</span>. 
                  O usuário deverá ser informado manualmente sobre esta alteração.
                </p>
              </div>

              {erro && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  <AlertTriangle size={18} />
                  {erro}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha Temporária</label>
                <input
                  type="password"
                  autoFocus
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-[11px] font-black uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={carregando}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {carregando ? 'Processando...' : 'Confirmar Reset'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModalResetSenha;
