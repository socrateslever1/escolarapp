
import React from 'react';
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  Send, 
  ChevronRight,
  Search,
  Clock
} from 'lucide-react';

const ComunicacoesOficiais: React.FC = () => {
  const modelos = [
    { titulo: 'Ofício Circular', desc: 'Comunicação externa ou interna formal.' },
    { titulo: 'Memorando Interno', desc: 'Comunicação rápida entre setores.' },
    { titulo: 'Edital de Convocação', desc: 'Chamada para reuniões ou eventos.' },
  ];

  const historico = [
    { id: '1', titulo: 'Ofício 012/2024', destino: 'Secretaria de Educação', data: '18/02/2024', status: 'Enviado' },
    { id: '2', titulo: 'Memorando 005/2024', destino: 'Coordenação Pedagógica', data: '15/02/2024', status: 'Lido' },
  ];

  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Comunicações Oficiais</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Gestão de documentos e comunicados formais da unidade.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
          <Plus size={18} />
          Nova Comunicação
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Modelos */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Modelos Rápidos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {modelos.map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FileText size={20} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">{m.titulo}</h4>
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Histórico */}
          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Histórico de Envios</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold"
                />
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {historico.map((h) => (
                <div key={h.id} className="p-6 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 text-slate-400 p-2 rounded-xl">
                      <Send size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{h.titulo}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Para: {h.destino}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <Clock size={12} />
                        {h.data}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{h.status}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <div className="bg-blue-50 p-4 rounded-2xl mb-6">
            <MessageSquare className="text-blue-600 mb-2" size={24} />
            <h4 className="text-sm font-black text-blue-900">Central de Avisos</h4>
            <p className="text-[10px] font-medium text-blue-700/70 mt-1">Envie comunicados rápidos para todos os professores e funcionários.</p>
          </div>
          
          <div className="space-y-4">
            <textarea 
              placeholder="Digite o comunicado aqui..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium min-h-[120px]"
            />
            <button className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
              Disparar Comunicado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComunicacoesOficiais;
