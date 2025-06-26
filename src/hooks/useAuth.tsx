import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const ACCESS_TOKEN_KEY = 'cryptohub_access_token';
const REFRESH_TOKEN_KEY = 'cryptohub_refresh_token';

// Token utility functions
const getStoredTokens = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken };
};

const setStoredTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setError(`Profile fetch error: ${error.message}`);
        return null;
      }
      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setError(`Profile fetch exception: ${error}`);
      return null;
    }
  };

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedTokens = getStoredTokens();
      if (!storedTokens.refreshToken) {
        console.log('No refresh token available');
        return false;
      }

      console.log('Refreshing access token...');
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: storedTokens.refreshToken,
      });

      if (error) {
        console.error('Error refreshing token:', error);
        clearStoredTokens();
        setAccessToken(null);
        setRefreshToken(null);
        return false;
      }

      if (data.session) {
        const newAccessToken = data.session.access_token;
        const newRefreshToken = data.session.refresh_token;
        
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setStoredTokens(newAccessToken, newRefreshToken);
        
        console.log('Access token refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in refreshAccessToken:', error);
      return false;
    }
  }, []);

  const isTokenValid = useCallback((): boolean => {
    if (!accessToken) return false;
    return !isTokenExpired(accessToken);
  }, [accessToken]);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!accessToken) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(accessToken)) {
        console.log('Token expired, refreshing...');
        refreshAccessToken();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [accessToken, refreshAccessToken]);

  useEffect(() => {
    console.log('AuthProvider mounted');
    
    // Initialize tokens from storage
    const storedTokens = getStoredTokens();
    if (storedTokens.accessToken && storedTokens.refreshToken) {
      setAccessToken(storedTokens.accessToken);
      setRefreshToken(storedTokens.refreshToken);
      
      // Check if access token is still valid
      if (!isTokenExpired(storedTokens.accessToken)) {
        console.log('Stored access token is valid');
      } else {
        console.log('Stored access token expired, refreshing...');
        refreshAccessToken();
      }
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          // Store tokens
          if (session.access_token && session.refresh_token) {
            setAccessToken(session.access_token);
            setRefreshToken(session.refresh_token);
            setStoredTokens(session.access_token, session.refresh_token);
          }
        } else {
          setProfile(null);
          setAccessToken(null);
          setRefreshToken(null);
          clearStoredTokens();
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        
        // Store tokens
        if (session.access_token && session.refresh_token) {
          setAccessToken(session.access_token);
          setRefreshToken(session.refresh_token);
          setStoredTokens(session.access_token, session.refresh_token);
        }
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Error getting session:', error);
      setError(`Session error: ${error}`);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshAccessToken]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data.session) {
        setAccessToken(data.session.access_token);
        setRefreshToken(data.session.refresh_token);
        setStoredTokens(data.session.access_token, data.session.refresh_token);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
      setRefreshToken(null);
      clearStoredTokens();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    error,
    accessToken,
    refreshToken,
    signIn,
    signUp,
    signOut,
    refreshAccessToken,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
