
import { CargoBase, ModuloApp, AcaoRBAC, Delegacao } from '../tipos/rbac';

export function canAccess(
  usuario: { papel: string; delegacoes?: Delegacao[] },
  modulo: ModuloApp,
  acao: AcaoRBAC
): boolean {
  // Gestor sempre tem acesso total
  if (usuario.papel === 'gestor' || usuario.papel === 'admin_plataforma') {
    return true;
  }

  // Verifica delegações ativas
  if (usuario.delegacoes) {
    const agora = new Date();
    const temDelegacao = usuario.delegacoes.some(del => {
      if (!del.ativo) return false;
      
      // Verifica validade temporal
      if (del.inicio && new Date(del.inicio) > agora) return false;
      if (del.fim && new Date(del.fim) < agora) return false;

      // Verifica se a permissão específica existe na delegação
      return del.permissoes.some(p => p.modulo === modulo && p.acao === acao);
    });

    if (temDelegacao) return true;
  }

  // Lógica de Cargo Base (Permissões padrão por cargo)
  const permissoesPadrao: Record<CargoBase, Partial<Record<ModuloApp, AcaoRBAC[]>>> = {
    gestor: {}, // Já tratado acima
    supervisao_pedagogia: {
      pedagogia: ['ver', 'criar', 'editar', 'aprovar'],
      professores: ['ver'],
      configuracoes: ['ver']
    },
    secretaria: {
      secretaria: ['ver', 'criar', 'editar', 'imprimir', 'exportar'],
      documentos: ['ver', 'criar']
    },
    professor: {
      pedagogia: ['ver', 'editar'], // Diário
      professores: ['ver']
    },
    portaria: {
      portaria: ['ver', 'criar']
    },
    delegado: {} // Depende 100% das delegações
  };

  const permissoesDoCargo = permissoesPadrao[usuario.papel as CargoBase];
  if (permissoesDoCargo && permissoesDoCargo[modulo]?.includes(acao)) {
    return true;
  }

  return false;
}
