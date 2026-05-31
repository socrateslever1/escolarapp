
import React from 'react';
import { mockLogs } from '../../servicos/auditoria.mock';

const TabelaLogs: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y divide-slate-50">
          {mockLogs.map(log => (
            <tr key={log.id}>
              <td className="px-6 py-4 text-xs font-bold">{log.data}</td>
              <td className="px-6 py-4 text-xs">{log.nome_usuario}</td>
              <td className="px-6 py-4 text-xs">{log.detalhes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaLogs;
