export * from './rbac';
export * from './gestor';
export * from './auditoria';
export * from './global';

export type PapelUsuario = 
  | 'admin_plataforma' 
  | 'gestor' 
  | 'pedagogia' 
  | 'secretaria' 
  | 'professor' 
  | 'familia' 
  | 'portaria' 
  | 'servicos_gerais' 
  | 'supervisor';

export interface UsuarioEscola {
  id: string;
  auth_user_id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  nivel: number;
  unidade_id: string;
  ativo: boolean;
  created_at: string;
}
