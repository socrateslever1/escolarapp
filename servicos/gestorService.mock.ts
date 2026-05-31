
import { UsuarioEscola, Servidor, DocumentoGestor, Delegacao } from '../tipos';

export const mockUsuarios: UsuarioEscola[] = [
  { id: '1', auth_user_id: 'u1', nome: 'Ana Silva', email: 'ana@escola.com', papel: 'pedagogia', ativo: true, nivel: 4, unidade_id: 'unid1', created_at: '2024-01-10' },
  { id: '2', auth_user_id: 'u2', nome: 'Carlos Souza', email: 'carlos@escola.com', papel: 'secretaria', ativo: true, nivel: 3, unidade_id: 'unid1', created_at: '2024-01-12' },
  { id: '3', auth_user_id: 'u3', nome: 'Beto Oliveira', email: 'beto@escola.com', papel: 'professor', ativo: false, nivel: 2, unidade_id: 'unid1', created_at: '2024-02-01' },
];

export const mockServidores: Servidor[] = [
  { id: '1', nome: 'Maria Oliveira', matricula: '12345', cargo: 'Professor Nível II', vinculo: 'efetivo', carga_horaria: 40, lotacao: 'Sala 04', situacao: 'ativo' },
  { id: '2', nome: 'João Santos', matricula: '67890', cargo: 'Agente Administrativo', vinculo: 'contratado', carga_horaria: 30, lotacao: 'Secretaria', situacao: 'ativo' },
];

export const mockDocumentos: DocumentoGestor[] = [
  { id: '1', nome: 'Portaria de Nomeação 2024', tipo: 'Portaria', data_upload: '2024-01-05', url: '#', status: 'validado' },
  { id: '2', nome: 'RG - Frente e Verso', tipo: 'RG', data_upload: '2024-01-05', url: '#', status: 'validado' },
];

export const mockDelegacoes: Delegacao[] = [
  { 
    id: 'd1', 
    usuario_id: '2', 
    nome_usuario: 'Carlos Souza', 
    perfil_nome: 'Almoxarife', 
    permissoes: [{ modulo: 'estoque', acao: 'ver' }, { modulo: 'estoque', acao: 'editar' }],
    concedido_por: 'Diretor Geral',
    criado_em: '2024-01-15',
    ativo: true
  }
];
