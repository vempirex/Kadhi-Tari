/**
 * NEW AUTH GUARD - CLEAN IMPLEMENTATION
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for Auth Hydration
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">Authenticating Frequency...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect Unauthenticated Users
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Profile Completion Check
  const hasProfile = !!profile?.username;

  // Force onboarding if profile is missing (and not already there)
  if (!hasProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Prevent onboarding if profile is already complete
  if (hasProfile && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children || <Outlet />}</>;
}
