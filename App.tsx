
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './servicos/contexto/AuthContext';
import { useTheme } from './servicos/contexto/ThemeContext';
import NavegacaoLateral from './componentes/NavegacaoLateral';
import { Menu, Bell, Search, Building2, User, LogOut, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Notificacao } from './tipos';

// Paginas
import Login from './paginas/Login';
import ResetSenha from './paginas/ResetSenha';
import CadastroGestor from './paginas/auth/CadastroGestor';
import AcessoNegado from './paginas/AcessoNegado';
import DashboardMaster from './paginas/master/DashboardMaster';
import RedeFederadaPage from './paginas/master/RedeFederadaPage';
import GestoresMasterPage from './paginas/master/GestoresMasterPage';
import GestaoUsuarios from './paginas/master/GestaoUsuarios';
import ResilienciaSistema from './paginas/master/ResilienciaSistema';
import IntegridadeDBPage from './paginas/master/IntegridadeDBPage';
import AuditoriaGlobal from './paginas/master/AuditoriaGlobal';
import SuporteCentral from './paginas/master/SuporteCentral';
import PoliticaBackupInstitucional from './paginas/master/PoliticaBackupInstitucional';
import EscolaAmbiente from './paginas/escola/EscolaAmbiente';

import PainelGestor from './paginas/gestao/PainelGestor';
import SuporteMaster from './paginas/gestao/SuporteMaster';
import MensageiroCentral from './paginas/MensageiroCentral';
import GradeHorarios from './paginas/pedagogia/GradeDeHorarios';
import SecretariaLegal from './paginas/secretaria/SecretariaLegal';
import DiarioProfessor from './paginas/professor/DiarioProfessor';
import PortariaAcesso from './paginas/portaria/PortariaAcesso';
import PerfilUsuario from './paginas/perfil/PerfilUsuario';

// Gestor
import PainelGestorNovo from './paginas/gestor/PainelGestor';
import GestaoAcessos from './paginas/gestor/GestaoAcessos';
import GestorLayout from './componentes/gestor/GestorLayout';

import ModosDeOperacao from './paginas/configuracoes/ModosDeOperacao';
import RastreabilidadeCompleta from './paginas/seguranca/RastreabilidadeCompleta';

import { GuardaRota } from './rotas/GuardaRota';

const App: React.FC = () => {
  const { usuario, loading, sair } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);
  const [menuTemaAberto, setMenuTemaAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (usuario) {
      const carregarNotificacoes = async () => {
        const { data } = await supabase
          .from('notificacoes')
          .select('*')
          .eq('lida', false)
          .order('criado_em', { ascending: false });
        if (data) setNotificacoes(data);
      };
      carregarNotificacoes();
    }
  }, [usuario]);

  // Se estiver carregando mas JÁ TIVERMOS o usuário (cache), não bloqueamos a tela
  const mostrarLoader = loading && !usuario;

  if (mostrarLoader) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="animate-pulse font-black text-2xl text-blue-400 tracking-tighter">EscolarApp...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden relative">
      {usuario && <NavegacaoLateral aberta={sidebarAberta} aoFechar={() => setSidebarAberta(false)} />}
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {usuario && (
          <header className="h-16 lg:h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarAberta(true)} className="p-2 lg:hidden text-slate-600 dark:text-slate-400">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{usuario.unidade || "Core Central"}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               {/* Seletor de Tema */}
               <div className="relative">
                 <button 
                   onClick={() => setMenuTemaAberto(!menuTemaAberto)}
                   className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                   title="Alterar Tema"
                 >
                   {theme === 'light' && <Sun size={20} />}
                   {theme === 'dark' && <Moon size={20} />}
                   {theme === 'auto' && <Monitor size={20} />}
                 </button>

                 {menuTemaAberto && (
                   <>
                     <div className="fixed inset-0 z-40" onClick={() => setMenuTemaAberto(false)} />
                     <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                       <button 
                         onClick={() => { setTheme('light'); setMenuTemaAberto(false); }}
                         className={`w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                       >
                         <Sun size={14} /> Claro
                       </button>
                       <button 
                         onClick={() => { setTheme('dark'); setMenuTemaAberto(false); }}
                         className={`w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                       >
                         <Moon size={14} /> Escuro
                       </button>
                       <button 
                         onClick={() => { setTheme('auto'); setMenuTemaAberto(false); }}
                         className={`w-full flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'auto' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                       >
                         <Monitor size={14} /> Automático
                       </button>
                     </div>
                   </>
                 )}
               </div>

               <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block" />

               <div className="relative">
                 <button 
                   onClick={() => setMenuUsuarioAberto(!menuUsuarioAberto)}
                   className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                 >
                   <img 
                     src={`https://ui-avatars.com/api/?name=${usuario.nome}&background=3b82f6&color=fff`} 
                     className="w-8 h-8 rounded-lg shadow-sm" 
                     alt="Avatar" 
                   />
                   <div className="hidden sm:block text-left">
                     <p className="text-[10px] font-black text-slate-900 dark:text-slate-100 leading-none truncate max-w-[100px]">{usuario.nome}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{usuario.papel}</p>
                   </div>
                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${menuUsuarioAberto ? 'rotate-180' : ''}`} />
                 </button>

                 {menuUsuarioAberto && (
                   <>
                     <div 
                       className="fixed inset-0 z-40" 
                       onClick={() => setMenuUsuarioAberto(false)}
                     />
                     <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                       <Link 
                         to="/perfil" 
                         onClick={() => setMenuUsuarioAberto(false)}
                         className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                       >
                         <User size={16} />
                         Meu Perfil
                       </Link>
                       <div className="h-px bg-slate-50 dark:bg-slate-800 my-1 mx-2" />
                       <button 
                         onClick={() => {
                           setMenuUsuarioAberto(false);
                           sair();
                         }}
                         className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                       >
                         <LogOut size={16} />
                         Sair do Sistema
                       </button>
                     </div>
                   </>
                 )}
               </div>
               <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block" />
               <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative">
                 <Bell size={20} />
                 {notificacoes.length > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                 )}
               </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] dark:bg-slate-950">
          <Routes>
            <Route 
              path="/acesso" 
              element={usuario ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route path="/reset-senha" element={<ResetSenha />} />
            
            <Route path="/cadastro-gestor" element={<CadastroGestor />} />
            <Route path="/acesso-negado" element={<AcessoNegado />} />

            <Route element={<GuardaRota papeisPermitidos={['admin_plataforma', 'gestor']} />}>
              <Route path="/perfil" element={<PerfilUsuario />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['admin_plataforma']} />}>
              <Route path="/master" element={<DashboardMaster />} />
              <Route path="/escola/:id" element={<EscolaAmbiente />} />
              <Route path="/master/rede" element={<RedeFederadaPage />} />
              <Route path="/master/gestores" element={<GestoresMasterPage />} />
              <Route path="/master/usuarios" element={<GestaoUsuarios />} />
              <Route path="/master/resiliencia" element={<ResilienciaSistema />} />
              <Route path="/master/integridade" element={<IntegridadeDBPage />} />
              <Route path="/master/auditoria" element={<AuditoriaGlobal />} />
              <Route path="/master/suporte" element={<SuporteCentral />} />
              <Route path="/master/backup" element={<PoliticaBackupInstitucional />} />
            </Route>

            <Route element={<GuardaRota papeisPermitidos={['gestor']} />}>
              <Route path="/gestao" element={<PainelGestorNovo />} />
              <Route path="/mensagens" element={<MensageiroCentral />} />
              <Route path="/secretaria" element={<SecretariaLegal />} />
              <Route path="/supervisao/grade-horarios" element={<GradeHorarios />} />
              <Route path="/professor" element={<DiarioProfessor />} />
              <Route path="/portaria" element={<PortariaAcesso />} />
              
              {/* Novas Rotas Gestor */}
              <Route path="/gestor" element={<GestorLayout />}>
                <Route index element={<PainelGestorNovo />} />
                <Route path="acessos" element={<GestaoAcessos />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to={usuario ? (usuario.papel === 'admin_plataforma' ? '/master' : '/gestao') : '/acesso'} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
