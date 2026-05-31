
import React from 'react';
import { Upload } from 'lucide-react';

const UploadDocumentos: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-blue-400 transition-all cursor-pointer group">
      <div className="bg-slate-50 p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:bg-blue-50 transition-all">
        <Upload className="text-slate-400 group-hover:text-blue-600 transition-all" size={32} />
      </div>
      <p className="text-sm font-bold text-slate-600">Clique ou arraste arquivos para fazer upload</p>
      <p className="text-[10px] text-slate-400 uppercase font-black mt-2 tracking-widest">PDF, PNG ou JPG até 10MB</p>
    </div>
  );
};

export default UploadDocumentos;
