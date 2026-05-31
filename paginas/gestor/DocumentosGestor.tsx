
import React from 'react';
import { mockDocumentos } from '../../servicos/gestorService.mock';
import { 
  FileText, 
  Upload, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

const DocumentosGestor: React.FC = () => {
  return (
    <div className="p-4 lg:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Meus Documentos</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Documentação institucional e pessoal do gestor.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
          <Upload size={18} />
          Upload Documento
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Arquivos Enviados</h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {mockDocumentos.map((doc) => (
                <div key={doc.id} className="p-8 hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">{doc.nome}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.tipo}</span>
                          <span className="text-[10px] font-bold text-slate-300">•</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.data_upload}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                        doc.status === 'validado' ? 'bg-emerald-50 text-emerald-600' : 
                        doc.status === 'pendente' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {doc.status === 'validado' ? <CheckCircle2 size={12} /> : doc.status === 'pendente' ? <Clock size={12} /> : <AlertCircle size={12} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{doc.status}</span>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-all">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={20} className="text-amber-500" />
              <h4 className="text-sm font-black uppercase tracking-widest">Aviso LGPD</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Os documentos aqui armazenados são de uso exclusivo para fins institucionais e de validação de acesso. Seus dados estão protegidos conforme a Lei Geral de Proteção de Dados.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Documentos Obrigatórios</h4>
            <ul className="space-y-4">
              {[
                { label: 'RG / CNH', ok: true },
                { label: 'CPF', ok: true },
                { label: 'Portaria de Nomeação', ok: true },
                { label: 'Termo de Posse', ok: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                  {item.ok ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-100" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentosGestor;
