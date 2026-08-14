import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          // 1. Production Supabase Auth Mode
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser(session.user);
            
            // Verify super_admin role in admin_profiles
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            const isSuperAdmin = profile?.role === 'super_admin' || session.user.user_metadata?.role === 'super_admin';
            setIsAdmin(isSuperAdmin);
          } else {
            setUser(null);
            setIsAdmin(false);
          }

          // Listen for auth changes
          const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;
            if (session?.user) {
              setUser(session.user);
              const { data: profile } = await supabase
                .from('admin_profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              setIsAdmin(profile?.role === 'super_admin' || session.user.user_metadata?.role === 'super_admin');
            } else {
              setUser(null);
              setIsAdmin(false);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          // 2. Local Fallback / Development Session Mode
          const storedLocalSession = localStorage.getItem('iwaat_admin_session');
          if (storedLocalSession && isMounted) {
            const parsed = JSON.parse(storedLocalSession);
            if (parsed.email && parsed.role === 'super_admin') {
              setUser(parsed);
              setIsAdmin(true);
            }
          }
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        // Supabase Cloud Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        // Verify role
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const isSuperAdmin = profile?.role === 'super_admin' || data.user.user_metadata?.role === 'super_admin';
        if (!isSuperAdmin) {
          await supabase.auth.signOut();
          throw new Error('Access denied: Unauthorized admin role.');
        }

        setUser(data.user);
        setIsAdmin(true);
        return { success: true, user: data.user };
      } else {
        // Local Fallback Admin Mode
        // Default Super Admin credentials for testing when Supabase keys are not set
        const validEmail = email.trim().toLowerCase();
        if (
          (validEmail === 'admin@iwaat.com' || validEmail === 'superadmin@iwaat.com' || validEmail === 'ujjwalmaurya2@gmail.com') &&
          password.length >= 6
        ) {
          const localUser = {
            id: 'super-admin-local-id',
            email: validEmail,
            role: 'super_admin',
            name: 'Super Admin',
            created_at: new Date().toISOString(),
          };
          localStorage.setItem('iwaat_admin_session', JSON.stringify(localUser));
          setUser(localUser);
          setIsAdmin(true);
          return { success: true, user: localUser };
        } else {
          throw new Error('Invalid email or password. Use your Super Admin credentials (min 6 chars).');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('iwaat_admin_session');
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        isSupabase: isSupabaseConfigured(),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
