
import React from 'react';
import { mockUsuarios } from '../../servicos/gestorService.mock';

const ListaAcessos: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockUsuarios.map(u => (
        <div key={u.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="font-bold">{u.nome}</p>
          <p className="text-xs text-slate-500">{u.email}</p>
        </div>
      ))}
    </div>
  );
};

export default ListaAcessos;
