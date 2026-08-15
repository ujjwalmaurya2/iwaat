import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

const AuthContext = createContext(null);

// ─── Canonical Production URL ──────────────────────────────────────────────
// VITE_APP_URL must be set in Vercel's environment variables to the clean
// production domain. It is used ONLY for the OAuth callback redirect target
// so that Vercel preview-URL Deployment Protection cannot intercept tokens.
// Falls back to window.location.origin for local development only.
const getAppOrigin = () => {
  const configured = import.meta.env.VITE_APP_URL;
  if (configured) return configured.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};

// ─── Super Admin Whitelist ─────────────────────────────────────────────────
// Used as a fallback when admin_users table cannot be read (e.g. fresh DB,
// RLS policy, or table not yet seeded). These emails are still verified via
// real Google OAuth — this is NOT a bypass of authentication.
export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'ujjwalmaurya2@gmail.com',
  'admin@iwaat.com',
];

// ─── AuthProvider ──────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [authError, setAuthError]     = useState(null);

  // ── Resolve email from all possible locations in a Supabase user object ──
  const resolveEmail = (authUser) => (
    authUser?.email ||
    authUser?.user_metadata?.email ||
    authUser?.identities?.[0]?.identity_data?.email ||
    ''
  ).toLowerCase().trim();

  // ── Verify admin status: DB first, whitelist fallback ────────────────────
  const verifyAdminInDb = async (authUser) => {
    if (!authUser) return null;

    const userEmail   = resolveEmail(authUser);
    const isWhitelisted = AUTHORIZED_SUPER_ADMIN_EMAILS.some(
      (e) => e.toLowerCase() === userEmail
    );

    let dbProfile = null;

    if (supabase && userEmail) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(`auth_user_id.eq.${authUser.id},email.eq.${userEmail}`)
          .maybeSingle();

        if (error) {
          console.warn('[Auth] admin_users query warning:', error.message);
        }

        if (data && data.status === 'active') {
          dbProfile = data;
          // Back-fill auth_user_id if missing
          if (!data.auth_user_id || data.auth_user_id !== authUser.id) {
            try {
              await supabase
                .from('admin_users')
                .update({
                  auth_user_id: authUser.id,
                  last_login_at: new Date().toISOString(),
                  avatar_url:
                    authUser.user_metadata?.avatar_url ||
                    authUser.user_metadata?.picture ||
                    data.avatar_url,
                  full_name:
                    authUser.user_metadata?.full_name ||
                    authUser.user_metadata?.name ||
                    data.full_name,
                })
                .eq('email', userEmail);
            } catch (_) { /* RLS may block – silently ignore */ }
          }
        }
      } catch (e) {
        console.error('[Auth] verifyAdminInDb error:', e);
      }
    }

    // DB record wins
    if (dbProfile) return dbProfile;

    // Whitelist fallback: still requires a valid Google session
    if (isWhitelisted) {
      return {
        id:             authUser.id || 'super-admin-root',
        auth_user_id:   authUser.id,
        email:          authUser.email,
        full_name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          'Ujjwal Maurya',
        avatar_url:
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture || '',
        role:           'super_admin',
        status:         'active',
        created_at:     new Date().toISOString(),
        last_login_at:  new Date().toISOString(),
      };
    }

    return null;
  };

  // ── Apply auth state from a Supabase session/user ────────────────────────
  const applySession = async (authUser, isMounted) => {
    if (!authUser) {
      if (isMounted) {
        setUser(null);
        setAdminProfile(null);
        setIsAdmin(false);
      }
      return;
    }
    const profile     = await verifyAdminInDb(authUser);
    const isAdminUser = Boolean(profile && profile.status === 'active');
    if (isMounted) {
      setUser(authUser);
      setAdminProfile(profile);
      setIsAdmin(isAdminUser);
    }
  };

  // ── Init: check existing session + subscribe to auth changes ─────────────
  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured() || !supabase) {
          // Local dev offline mock
          if (import.meta.env.DEV) {
            const raw = localStorage.getItem('iwaat_admin_session');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.email && parsed.role === 'super_admin' && parsed.status === 'active') {
                if (isMounted) {
                  setUser(parsed);
                  setAdminProfile(parsed);
                  setIsAdmin(true);
                }
              }
            }
          }
          return;
        }

        // 1. Check for an existing Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('[Auth] getSession error:', sessionError.message);
        }
        await applySession(session?.user ?? null, isMounted);

        // 2. Subscribe to future auth-state changes (handles OAuth callback)
        const { data: listenerData } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!isMounted) return;
            console.log('[Auth] onAuthStateChange event:', event);
            await applySession(newSession?.user ?? null, isMounted);
            if (isMounted) setLoading(false);
          }
        );
        subscription = listenerData?.subscription;

      } catch (err) {
        console.error('[Auth] initAuth error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Google OAuth Login ────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error(
          'Supabase is not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
        );
      }

      // CRITICAL: Use the canonical production URL, never window.location.origin,
      // because Vercel preview/deployment URLs are protected by Vercel Authentication
      // and will intercept the OAuth callback tokens before the app can handle them.
      const redirectTo = `${getAppOrigin()}/super-admin`;
      console.log('[Auth] OAuth redirectTo:', redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt:       'select_account',
          },
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('[Auth] Google OAuth error:', err);
      const msg = err.message || 'Google authentication failed.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  // ── Local dev mock login (disabled in production) ─────────────────────────
  const loginDevMock = async (email = 'ujjwalmaurya2@gmail.com') => {
    if (!import.meta.env.DEV) {
      throw new Error('Development mock login is disabled in production builds.');
    }
    const mockAdmin = {
      id:           'mock-super-admin-id',
      email,
      full_name:    'Ujjwal Maurya (Dev)',
      role:         'super_admin',
      status:       'active',
      avatar_url:   '',
      created_at:   new Date().toISOString(),
    };
    localStorage.setItem('iwaat_admin_session', JSON.stringify(mockAdmin));
    setUser(mockAdmin);
    setAdminProfile(mockAdmin);
    setIsAdmin(true);
    return { success: true, user: mockAdmin };
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('iwaat_admin_session');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    } finally {
      setUser(null);
      setAdminProfile(null);
      setIsAdmin(false);
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
