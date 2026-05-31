
import React from 'react';
import CartoesIndicadores from '../../componentes/gestor/CartoesIndicadores';
import PerfilGestorCard from '../../componentes/gestor/PerfilGestorCard';
import { 
  Bell, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const PainelGestor: React.FC = () => {
  const alertas = [
    { tipo: 'critico', msg: '03 Diários de classe não preenchidos (3º Ano A)', data: 'Hoje' },
    { tipo: 'info', msg: 'Reunião pedagógica agendada para amanhã', data: '12:00' },
    { tipo: 'aviso', msg: 'Estoque de Merenda: Arroz abaixo do limite', data: 'Ontem' },
  ];

  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Painel Gestor</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Visão estratégica e gerencial da unidade escolar.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">19 Fev, 2024</span>
          </div>
          <button className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          </button>
        </div>
      </header>

      <CartoesIndicadores />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Alertas Estratégicos */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Alertas & Notificações</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline">Ver Todos</button>
            </div>
            
            <div className="space-y-4">
              {alertas.map((alerta, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-500 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${
                      alerta.tipo === 'critico' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 
                      alerta.tipo === 'aviso' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {alerta.tipo === 'critico' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{alerta.msg}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">{alerta.data}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                </div>
              ))}
            </div>
          </section>

          {/* Atalhos Rápidos */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={80} />
              </div>
              <h4 className="text-xl font-black mb-2 relative z-10">Novo Acesso</h4>
              <p className="text-blue-100 text-xs mb-6 relative z-10">Cadastre um novo funcionário na unidade.</p>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">Iniciar</button>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <h4 className="text-xl font-black mb-2 relative z-10">Delegar</h4>
              <p className="text-slate-400 text-xs mb-6 relative z-10">Atribua permissões granulares a usuários.</p>
              <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">Configurar</button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <PerfilGestorCard />
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">Status do Sistema</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400 dark:text-slate-500">Banco de Dados</span>
                  <span className="text-emerald-500">Online</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[99%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400 dark:text-slate-500">Armazenamento</span>
                  <span className="text-blue-500">45%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelGestor;
