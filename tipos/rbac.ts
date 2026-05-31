
export type CargoBase = 'gestor' | 'supervisao_pedagogia' | 'secretaria' | 'professor' | 'portaria' | 'delegado';

export type ModuloApp = 
  | 'pedagogia' 
  | 'secretaria' 
  | 'professores' 
  | 'portaria' 
  | 'estoque' 
  | 'biblioteca' 
  | 'auditoria' 
  | 'configuracoes' 
  | 'documentos' 
  | 'servidores';

export type AcaoRBAC = 'ver' | 'criar' | 'editar' | 'excluir' | 'imprimir' | 'exportar' | 'aprovar';

export interface Permissao {
  modulo: ModuloApp;
  acao: AcaoRBAC;
}

export interface Delegacao {
  id: string;
  usuario_id: string;
  nome_usuario: string;
  perfil_nome: string; // Ex: Merendeira, Almoxarife
  permissoes: Permissao[];
  inicio?: string;
  fim?: string;
  concedido_por: string;
  criado_em: string;
  ativo: boolean;
}
