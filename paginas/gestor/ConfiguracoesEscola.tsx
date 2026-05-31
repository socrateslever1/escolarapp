
import React from 'react';
import { 
  Settings, 
  Save, 
  Calendar, 
  Clock, 
  Shield, 
  Bell,
  ChevronRight
} from 'lucide-react';

const ConfiguracoesEscola: React.FC = () => {
  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Configurações da Unidade</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Parâmetros institucionais e políticas internas.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
          <Save size={18} />
          Salvar Alterações
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Settings size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Parâmetros Gerais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Institucional</label>
                <input 
                  type="text"
                  defaultValue="E.M. Municipal Osmarina Melo de Oliveira"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Código INEP</label>
                <input 
                  type="text"
                  defaultValue="12345678"
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Horários de Funcionamento</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Matutino', 'Vespertino', 'Noturno'].map((turno) => (
                  <div key={turno} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">{turno}</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="bg-amber-50 p-2 rounded-xl text-amber-600">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Políticas de Segurança</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Exigir MFA para cargos administrativos', ativo: true },
                { label: 'Bloquear acessos fora do horário comercial', ativo: false },
                { label: 'Notificar gestor em cada nova delegação', ativo: true },
              ].map((politica, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                  <span className="text-xs font-bold text-slate-700">{politica.label}</span>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${politica.ativo ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${politica.ativo ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Módulos Ativos</h4>
            <div className="space-y-3">
              {[
                { label: 'Pedagógico', icon: <Calendar size={14} /> },
                { label: 'Secretaria', icon: <Clock size={14} /> },
                { label: 'Portaria', icon: <Shield size={14} /> },
                { label: 'Notificações', icon: <Bell size={14} /> },
              ].map((modulo, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    {modulo.icon}
                    {modulo.label}
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesEscola;
