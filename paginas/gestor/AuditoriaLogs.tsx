
import React from 'react';
import { mockLogs } from '../../servicos/auditoria.mock';
import { 
  History, 
  Download, 
  Filter, 
  Search,
  Activity,
  User,
  Box
} from 'lucide-react';

const AuditoriaLogs: React.FC = () => {
  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Auditoria & Logs</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Rastreabilidade completa de todas as ações críticas.</p>
        </div>
        <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
          <Download size={18} />
          Exportar Relatório
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filtrar logs..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 font-bold text-xs">
              <Filter size={16} />
              Filtros Avançados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data / Hora</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600">{log.data}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-xs font-black text-slate-900">{log.nome_usuario}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg w-fit">
                      <Box size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{log.modulo}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg w-fit ${
                      log.acao === 'aprovar' ? 'bg-emerald-50 text-emerald-600' : 
                      log.acao === 'excluir' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Activity size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{log.acao}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-medium text-slate-500">{log.detalhes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaLogs;
