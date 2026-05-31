
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../supabaseClient';

// Fallback for Session type if not exported correctly from the library version
type Session = any;

type AuthState = {
  loading: boolean;
  sessao: Session | null;
  usuario: any | null;
  sair: () => Promise<void>;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [sessao, setSessao] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<any | null>(() => {
    try {
      const cached = localStorage.getItem('escolarapp-perfil-cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const iniciouRef = useRef(false);

  const buscarPerfilInstitucional = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        localStorage.setItem('escolarapp-perfil-cache', JSON.stringify(data));
      }
      return data;
    } catch (e) {
      console.error("Erro ao buscar perfil institucional:", e);
      throw e;
    }
  };

  const login = async (email: string, senha: string) => {
    // Não usamos o setLoading(true) global aqui para evitar que o App.tsx 
    // mostre o loader de tela cheia, permitindo que a página de Login 
    // gerencie seu próprio estado e mostre o botão de cancelar.
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) throw error;

      if (!data.user) throw new Error('Usuário não retornado pelo serviço de autenticação.');

      const perfil = await buscarPerfilInstitucional(data.user.id);
      
      if (!perfil) {
        // Se autenticou mas não tem perfil, desloga para não ficar em estado inconsistente
        await (supabase.auth as any).signOut();
        throw new Error('Perfil institucional não encontrado. Entre em contato com o administrador.');
      }

      if (!perfil.ativo) {
        await (supabase.auth as any).signOut();
        throw new Error('Seu acesso foi desativado pela administração.');
      }

      setUsuario(perfil);
      setSessao(data.session);
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'Erro inesperado ao realizar login.' 
      };
    }
  };

  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;

    const inicializarAuth = async () => {
      try {
        const { data: { session } } = await (supabase.auth as any).getSession();
        
        if (session) {
          setSessao(session);
          if (!usuario) {
            const perfil = await buscarPerfilInstitucional(session.user.id);
            
            if (perfil && !perfil.ativo) {
              await (supabase.auth as any).signOut();
              setUsuario(null);
              setSessao(null);
              localStorage.removeItem('escolarapp-perfil-cache');
              return;
            }
            
            setUsuario(perfil);
          } else {
            buscarPerfilInstitucional(session.user.id).then(async perfil => {
              if (perfil && !perfil.ativo) {
                await (supabase.auth as any).signOut();
                setUsuario(null);
                setSessao(null);
                localStorage.removeItem('escolarapp-perfil-cache');
                return;
              }
              if (perfil) setUsuario(perfil);
            }).catch(() => {});
          }
        } else {
          localStorage.removeItem('escolarapp-perfil-cache');
          setUsuario(null);
        }
      } catch (err) {
        console.error("Erro no boot auth:", err);
      } finally {
        setLoading(false);
      }

      const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event: string, newSession: Session | null) => {
        setSessao(newSession);
        
        if (newSession) {
          try {
            const perfil = await buscarPerfilInstitucional(newSession.user.id);
            
            if (perfil && !perfil.ativo) {
              await (supabase.auth as any).signOut();
              setUsuario(null);
              setSessao(null);
              localStorage.removeItem('escolarapp-perfil-cache');
              return;
            }

            setUsuario(perfil);
          } catch (err) {
            setUsuario(null);
          }
        } else {
          localStorage.removeItem('escolarapp-perfil-cache');
          setUsuario(null);
          setSessao(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    inicializarAuth();
  }, []);

  const sair = async () => {
    setLoading(true);
    localStorage.removeItem('escolarapp-perfil-cache');
    await (supabase.auth as any).signOut();
    setSessao(null);
    setUsuario(null);
    setLoading(false);
    window.location.href = '/#/acesso';
  };

  const value = useMemo<AuthState>(
    () => ({ loading, sessao, usuario, sair, login }),
    [loading, sessao, usuario]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro do AuthProvider');
  return ctx;
};
