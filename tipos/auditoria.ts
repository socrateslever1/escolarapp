
import { ModuloApp, AcaoRBAC } from './rbac';

export interface LogAuditoria {
  id: string;
  data: string;
  usuario_id: string;
  nome_usuario: string;
  modulo: ModuloApp;
  acao: AcaoRBAC;
  detalhes: string;
  ip?: string;
}
