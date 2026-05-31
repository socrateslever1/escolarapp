
import React from 'react';
import { mockDelegacoes } from '../../servicos/gestorService.mock';
import { 
  ShieldCheck, 
  Plus, 
  Calendar, 
  User, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';

const DelegacoesPermissoes: React.FC = () => {
  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Delegações & RBAC</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Permissões granulares para funções específicas.</p>
        </div>
        <button className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-xl shadow-slate-900/20 dark:shadow-blue-500/20 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all">
          <Plus size={18} />
          Nova Delegação
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Delegações Ativas</h3>
            </div>
            
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {mockDelegacoes.map((d) => (
                <div key={d.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-2xl">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">{d.perfil_nome}</h4>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            <User size={12} />
                            {d.nome_usuario}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            <Calendar size={12} />
                            Desde {d.criado_em}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {d.permissoes.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {p.modulo}:{p.acao}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Info size={20} className="text-blue-200" />
              <h4 className="text-sm font-black uppercase tracking-widest">O que é RBAC?</h4>
            </div>
            <p className="text-blue-100 text-xs leading-relaxed mb-6">
              Role-Based Access Control permite que você delegue tarefas específicas (como gerenciar estoque ou biblioteca) sem dar acesso total ao sistema.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                Segurança Granular
              </li>
              <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                Validade Temporal
              </li>
              <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                Logs de Auditoria
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Perfis Sugeridos</h4>
            <div className="space-y-3">
              {['Merendeira', 'Almoxarife', 'Bibliotecário', 'Patrimônio'].map((perfil) => (
                <button key={perfil} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-700 transition-all group">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{perfil}</span>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegacoesPermissoes;
