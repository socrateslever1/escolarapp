
import React from 'react';
import { Users, FileText, ShieldCheck, AlertCircle } from 'lucide-react';

const CartoesIndicadores: React.FC = () => {
  const stats = [
    { label: 'Total de Acessos', value: '24', icon: <Users />, color: 'bg-blue-500' },
    { label: 'Documentos Pendentes', value: '03', icon: <FileText />, color: 'bg-amber-500' },
    { label: 'Delegações Ativas', value: '08', icon: <ShieldCheck />, color: 'bg-emerald-500' },
    { label: 'Alertas Críticos', value: '01', icon: <AlertCircle />, color: 'bg-rose-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-current/20`}>
              {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 20 })}
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CartoesIndicadores;
