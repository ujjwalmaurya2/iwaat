import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'ujjwalmaurya2@gmail.com',
  'admin@iwaat.com',
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to verify admin status from database or super admin whitelist
  const verifyAdminInDb = async (authUser) => {
    if (!authUser) return null;
    const userEmail = (
      authUser.email ||
      authUser.user_metadata?.email ||
      authUser.identities?.[0]?.identity_data?.email ||
      ''
    ).toLowerCase().trim();

    const isWhitelisted = AUTHORIZED_SUPER_ADMIN_EMAILS.some(
      (e) => e.toLowerCase() === userEmail
    );

    let dbProfile = null;

    if (supabase) {
      try {
        // 1. Check admin_users table by auth_user_id OR email
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(`auth_user_id.eq.${authUser.id},email.eq.${userEmail}`)
          .maybeSingle();

        if (error) {
          console.warn('[Auth] Note querying admin_users:', error.message);
        }

        if (data && data.status === 'active') {
          dbProfile = data;
          // Link auth_user_id if it was not linked yet
          if (!data.auth_user_id || data.auth_user_id !== authUser.id) {
            try {
              await supabase
                .from('admin_users')
                .update({
                  auth_user_id: authUser.id,
                  last_login_at: new Date().toISOString(),
                  avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || data.avatar_url,
                  full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || data.full_name,
                })
                .eq('email', userEmail);
            } catch (updateErr) {
              // Ignored if RLS update policy restricts
            }
          }
        }
      } catch (e) {
        console.error('[Auth] verifyAdminInDb query error:', e);
      }
    }

    // If active in DB, return DB profile
    if (dbProfile) {
      return dbProfile;
    }

    // If whitelisted super admin email, grant active super admin access immediately
    if (isWhitelisted) {
      return {
        id: authUser.id || 'super-admin-root',
        auth_user_id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Ujjwal Maurya',
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
        role: 'super_admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };
    }

    return null;
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          // Check if landing with OAuth hash / code
          const isOAuthCallback = typeof window !== 'undefined' && (
            window.location.hash.includes('access_token=') ||
            window.location.search.includes('code=') ||
            sessionStorage.getItem('iwaat_admin_login_intent') === 'true'
          );

          // 1. Check active Supabase session (Google OAuth)
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            setUser(session.user);
            const profile = await verifyAdminInDb(session.user);
            if (isMounted) {
              const isAdminUser = Boolean(profile && profile.status === 'active');
              setAdminProfile(profile);
              setIsAdmin(isAdminUser);

              if (isAdminUser && isOAuthCallback && !window.location.pathname.startsWith('/super-admin')) {
                sessionStorage.removeItem('iwaat_admin_login_intent');
                window.location.replace('/super-admin');
                return;
              }
            }
          } else if (isMounted) {
            setUser(null);
            setAdminProfile(null);
            setIsAdmin(false);
          }

          // 2. Listen for Supabase auth state transitions (OAuth redirects / callbacks)
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;
            if (session?.user) {
              setUser(session.user);
              const profile = await verifyAdminInDb(session.user);
              if (isMounted) {
                const isAdminUser = Boolean(profile && profile.status === 'active');
                setAdminProfile(profile);
                setIsAdmin(isAdminUser);
                setLoading(false);

                if (isAdminUser && (event === 'SIGNED_IN' || isOAuthCallback) && !window.location.pathname.startsWith('/super-admin')) {
                  sessionStorage.removeItem('iwaat_admin_login_intent');
                  window.location.replace('/super-admin');
                }
              }
            } else {
              setUser(null);
              setAdminProfile(null);
              setIsAdmin(false);
              setLoading(false);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } else {
          // 3. Development offline test mode (strictly disabled in production)
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
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('iwaat_admin_login_intent', 'true');
      }

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
          'Supabase credentials not configured in .env.local. Please ensure VITE_SUPABASE_ANON_KEY is set.'
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
