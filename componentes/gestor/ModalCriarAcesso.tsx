import React, { useState, useEffect } from 'react';
import { X, Shield, User, Mail, Lock, FileText, Loader2 } from 'lucide-react';
import { gestorService } from '../../servicos/gestorService';
import { PapelUsuario } from '../../tipos';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onSucesso: () => void;
  unidadeId: string;
}

const ModalCriarAcesso: React.FC<Props> = ({ aberto, onFechar, onSucesso, unidadeId }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    papel: '' as PapelUsuario | '',
    observacoes: ''
  });

  const [nivel, setNivel] = useState<number>(0);

  useEffect(() => {
    const definirNivel = (papel: string) => {
      switch (papel) {
        case 'supervisor':
        case 'pedagogia':
          return 4;
        case 'secretaria':
          return 3;
        case 'professor':
          return 2;
        case 'portaria':
        case 'servicos_gerais':
          return 1;
        default:
          return 0;
      }
    };
    setNivel(definirNivel(formData.papel));
  }, [formData.papel]);

  if (!aberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      if (!formData.papel) throw new Error('Selecione um papel para o usuário');
      
      await gestorService.criarUsuarioDaUnidade({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha || undefined,
        papel: formData.papel,
        nivel: nivel,
        unidade_id: unidadeId,
        observacoes: formData.observacoes
      });

      onSucesso();
      onFechar();
      // Reset form
      setFormData({
        nome: '',
        email: '',
        senha: '',
        papel: '',
        observacoes: ''
      });
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao criar o acesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Criar Novo Acesso
            </h3>
          </div>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {erro && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold">
              {erro}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200"
                  placeholder="joao@escola.gov.br"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                Senha Provisória
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                Papel / Função
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  required
                  value={formData.papel}
                  onChange={(e) => setFormData({ ...formData, papel: e.target.value as PapelUsuario })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all dark:text-slate-200"
                >
                  <option value="">Selecionar...</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="pedagogia">Pedagogia</option>
                  <option value="secretaria">Secretaria</option>
                  <option value="professor">Professor</option>
                  <option value="portaria">Portaria</option>
                  <option value="servicos_gerais">Serviços Gerais</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Observações Internas
              </label>
              {nivel > 0 && (
                <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                  Nível de Acesso: {nivel}
                </span>
              )}
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px] dark:text-slate-200"
                placeholder="Detalhes sobre a lotação ou restrições..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onFechar}
              disabled={loading}
              className="flex-1 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Criando...
                </>
              ) : (
                'Criar Acesso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCriarAcesso;
