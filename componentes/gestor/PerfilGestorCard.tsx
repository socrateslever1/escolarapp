
import React from 'react';
import { User, Building, Shield, Edit3 } from 'lucide-react';
import { useAuth } from '../../servicos/contexto/AuthContext';

const PerfilGestorCard: React.FC = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <img 
            src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=3b82f6&color=fff&size=128`} 
            className="w-24 h-24 rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800"
            alt="Avatar"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-1">{usuario.nome}</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6">Gestor Escolar</p>

        <div className="w-full space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Building size={16} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate">{usuario.unidade || 'Escola Não Definida'}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Shield size={16} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Acesso Nível 5 (Total)</span>
          </div>
        </div>

        <button className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-500/20 hover:shadow-blue-500/20">
          <Edit3 size={14} />
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default PerfilGestorCard;
