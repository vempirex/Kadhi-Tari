import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // Mocking auth for now
  const [user] = useState({ name: 'User' }); 
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children || <Outlet />}</>;
}
