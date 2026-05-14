import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">Synchronizing Identity...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasProfile = !!profile?.username;

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
