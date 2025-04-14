
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar sessão inicial e configurar o listener
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao buscar sessão:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (e) {
        console.error('Erro ao buscar sessão:', e);
      } finally {
        setLoading(false);
      }
    };
    
    setData();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função de cadastro
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return result;
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return result;
  };

  // Função de login com Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) {
        toast.error('Erro ao fazer login com Google: ' + error.message);
      }
    } catch (error: any) {
      toast.error('Erro ao fazer login com Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
