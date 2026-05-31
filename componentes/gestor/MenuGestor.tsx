
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  History, 
  FileText, 
  UserCircle, 
  Settings, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const MenuGestor: React.FC = () => {
  const location = useLocation();

  const itens = [
    { path: '/gestao', label: 'Painel Geral', icon: <LayoutDashboard size={18} /> },
    { path: '/gestor/acessos', label: 'Gestão de Acessos', icon: <Users size={18} /> },
    { path: '/gestor/delegacoes', label: 'Delegações & RBAC', icon: <ShieldCheck size={18} /> },
    { path: '/gestor/auditoria', label: 'Auditoria & Logs', icon: <History size={18} /> },
    { path: '/gestor/servidores', label: 'Servidores & Lotação', icon: <UserCircle size={18} /> },
    { path: '/gestor/documentos', label: 'Meus Documentos', icon: <FileText size={18} /> },
    { path: '/gestor/comunicacoes', label: 'Comunicações', icon: <MessageSquare size={18} /> },
    { path: '/gestor/configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
  ];

  return (
    <div className="space-y-1">
      {itens.map((item) => {
        const ativo = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
              ativo 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight size={14} className={`transition-transform ${ativo ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
          </Link>
        );
      })}
    </div>
  );
};

export default MenuGestor;
