import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        setHasProfile(!!data?.username);
      }
      setLoading(false);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setHasProfile(false);
      } else {
        checkAuth(); // Re-verify on auth changes
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If user has no profile and isn't on onboarding page, redirect to onboarding
  if (!hasProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has profile and is on onboarding page, redirect to home
  if (hasProfile && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children || <Outlet />}</>;
}


