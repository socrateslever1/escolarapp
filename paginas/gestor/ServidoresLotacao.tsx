
import React from 'react';
import { mockServidores } from '../../servicos/gestorService.mock';
import { 
  UserCircle, 
  Search, 
  Filter, 
  FileText, 
  MoreHorizontal,
  Briefcase,
  Clock,
  MapPin
} from 'lucide-react';

const ServidoresLotacao: React.FC = () => {
  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Servidores & Lotação</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Gestão de quadro de pessoal e movimentações internas.</p>
        </div>
        <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
          <FileText size={18} />
          Relatório de Lotação
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar servidor por nome ou matrícula..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
            />
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:text-blue-600 transition-all">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Vínculo</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga Horária</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lotação Atual</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockServidores.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{s.nome}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Matrícula: {s.matricula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Briefcase size={12} className="text-slate-400" />
                        {s.cargo}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{s.vinculo}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {s.carga_horaria}h semanais
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {s.lotacao}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm">
                      <MoreHorizontal size={18} />
                    </button>
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

export default ServidoresLotacao;
