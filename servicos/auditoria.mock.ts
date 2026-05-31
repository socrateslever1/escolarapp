
import { LogAuditoria } from '../tipos/auditoria';

export const mockLogs: LogAuditoria[] = [
  { id: '1', data: '2024-02-19 10:30', usuario_id: 'u1', nome_usuario: 'Ana Silva', modulo: 'pedagogia', acao: 'criar', detalhes: 'Criou nova turma: 3º Ano B' },
  { id: '2', data: '2024-02-19 11:15', usuario_id: 'u2', nome_usuario: 'Carlos Souza', modulo: 'estoque', acao: 'editar', detalhes: 'Atualizou estoque de merenda' },
  { id: '3', data: '2024-02-19 12:00', usuario_id: 'u0', nome_usuario: 'Gestor Principal', modulo: 'configuracoes', acao: 'aprovar', detalhes: 'Aprovou calendário letivo' },
];
