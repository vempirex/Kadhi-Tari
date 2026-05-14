/**
 * UPDATED AUTH GUARD - PREVENT REDIRECT LOOPS
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading State - Wait for everything to settle
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">Verifying Sanctuary Access...</p>
        </div>
      </div>
    );
  }

  // 2. Auth Check - No session means no access
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Profile Completion Check
  const isOnboardingPage = location.pathname === '/onboarding';
  const isProfileComplete = !!profile?.profile_completed;

  // Case A: Profile is incomplete -> Redirect to onboarding (unless already there)
  if (!isProfileComplete && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // Case B: Profile is complete but user is trying to go back to onboarding -> Redirect to home
  if (isProfileComplete && isOnboardingPage) {
    return <Navigate to="/" replace />;
  }

  // Case C: Everything is correct -> Render the page
  return <>{children || <Outlet />}</>;
}
