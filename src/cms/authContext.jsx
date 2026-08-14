import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to verify admin status from database
  const verifyAdminInDb = async (authUser) => {
    if (!authUser || !supabase) return null;
    try {
      // Check admin_users table by auth_user_id or email
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`auth_user_id.eq.${authUser.id},email.eq.${authUser.email}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[Auth] Error querying admin_users:', error.message);
      }

      if (data && data.status === 'active') {
        return data;
      }
      return null;
    } catch (e) {
      console.error('[Auth] verifyAdminInDb error:', e);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          // 1. Check active Supabase session (Google OAuth)
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser(session.user);
            const profile = await verifyAdminInDb(session.user);
            if (isMounted) {
              setAdminProfile(profile);
              setIsAdmin(Boolean(profile && profile.status === 'active'));
            }
          } else if (isMounted) {
            setUser(null);
            setAdminProfile(null);
            setIsAdmin(false);
          }

          // Listen for Supabase auth state transitions (OAuth redirects)
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;
            if (session?.user) {
              setUser(session.user);
              const profile = await verifyAdminInDb(session.user);
              if (isMounted) {
                setAdminProfile(profile);
                setIsAdmin(Boolean(profile && profile.status === 'active'));
              }
            } else {
              setUser(null);
              setAdminProfile(null);
              setIsAdmin(false);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          // 2. Development offline test mode (strictly disabled in production)
          if (import.meta.env.DEV) {
            const storedLocalSession = localStorage.getItem('iwaat_admin_session');
            if (storedLocalSession && isMounted) {
              const parsed = JSON.parse(storedLocalSession);
              if (parsed.email && parsed.role === 'super_admin' && parsed.status === 'active') {
                setUser(parsed);
                setAdminProfile(parsed);
                setIsAdmin(true);
              }
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

  // Google OAuth Login
  const loginWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        // Production: Redirect to Supabase Google OAuth Provider
        const redirectTo = `${window.location.origin}/super-admin`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account',
            },
          },
        });

        if (error) throw error;
        return { success: true };
      } else {
        // If Supabase credentials are not yet configured
        throw new Error(
          'Supabase project credentials not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        );
      }
    } catch (err) {
      console.error('[Auth] Google OAuth Error:', err);
      setAuthError(err.message || 'Google authentication failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Local development mock login (strictly disabled in production)
  const loginDevMock = async (email = 'ujjwalmaurya2@gmail.com') => {
    if (!import.meta.env.DEV) {
      throw new Error('Development mock login is disabled in production builds.');
    }

    const mockAdmin = {
      id: 'mock-super-admin-id',
      email,
      full_name: 'Ujjwal Maurya (Dev)',
      role: 'super_admin',
      status: 'active',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('iwaat_admin_session', JSON.stringify(mockAdmin));
    setUser(mockAdmin);
    setAdminProfile(mockAdmin);
    setIsAdmin(true);
    return { success: true, user: mockAdmin };
  };

  // Sign out
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('iwaat_admin_session');
      setUser(null);
      setAdminProfile(null);
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
        adminProfile,
        isAdmin,
        loading,
        authError,
        isSupabase: isSupabaseConfigured(),
        loginWithGoogle,
        loginDevMock,
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
