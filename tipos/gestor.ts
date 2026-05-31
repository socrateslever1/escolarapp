
import { CargoBase } from './rbac';

export interface Servidor {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  vinculo: 'efetivo' | 'contratado' | 'comissionado';
  carga_horaria: number;
  lotacao: string;
  situacao: 'ativo' | 'licenca' | 'afastado' | 'aposentado';
}

export interface DocumentoGestor {
  id: string;
  nome: string;
  tipo: 'RG' | 'CPF' | 'Portaria' | 'Comprovante' | 'Outros';
  data_upload: string;
  url: string;
  status: 'validado' | 'pendente' | 'recusado';
}
