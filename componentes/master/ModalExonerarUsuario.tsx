import React, { useState } from 'react';
import { X, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { masterService } from '../../servicos/masterService';

interface Props {
  usuarioId: string;
  nomeUsuario: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalExonerarUsuario: React.FC<Props> = ({ usuarioId, nomeUsuario, onClose, onSuccess }) => {
  const [motivo, setMotivo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleExonerar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) {
      setErro('Por favor, informe o motivo da exoneração/arquivamento.');
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      await masterService.exonerarUsuario(usuarioId, motivo);
      setSucesso(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setErro(err.message || 'Erro ao realizar exoneração.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <UserX className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Arquivar Usuário</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Exoneração Institucional</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleExonerar} className="p-8 space-y-6">
          {sucesso ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">Usuário Arquivado!</p>
                <p className="text-xs text-slate-400 mt-1">O acesso foi revogado e o perfil movido para o arquivo.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-rose-600 shrink-0" size={18} />
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 leading-relaxed">
                  Atenção: Esta ação irá desativar permanentemente o acesso de <span className="font-black underline">{nomeUsuario}</span>. 
                  O registro será mantido para fins de auditoria, mas não poderá mais logar.
                </p>
              </div>

              {erro && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  <AlertTriangle size={18} />
                  {erro}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo da Exoneração</label>
                <textarea
                  autoFocus
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                  placeholder="Ex: Desligamento, Transferência, Fim de Contrato..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-sm font-bold text-slate-700 dark:text-slate-200 resize-none"
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
                  className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {carregando ? 'Processando...' : 'Confirmar Arquivamento'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ModalExonerarUsuario;
