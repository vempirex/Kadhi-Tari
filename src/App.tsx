import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Letters from './pages/Letters';
import Playlist from './pages/Playlist';
import Thoughts from './pages/Thoughts';
import MemoryTimeline from './pages/MemoryTimeline';
import Jokes from './pages/Jokes';
import Planner from './pages/Planner';
import Chat from './pages/Chat';
import Secret from './pages/Secret';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import AuthGuard from './components/AuthGuard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-warm-50 text-charcoal selection:bg-rose-100 selection:text-rose-900">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
            
            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/feed" element={<AnimatedPage><Feed /></AnimatedPage>} />
              <Route path="/letters" element={<AnimatedPage><Letters /></AnimatedPage>} />
              <Route path="/playlist" element={<AnimatedPage><Playlist /></AnimatedPage>} />
              <Route path="/thoughts" element={<AnimatedPage><Thoughts /></AnimatedPage>} />
              <Route path="/timeline" element={<AnimatedPage><MemoryTimeline /></AnimatedPage>} />
              <Route path="/jokes" element={<AnimatedPage><Jokes /></AnimatedPage>} />
              <Route path="/planner" element={<AnimatedPage><Planner /></AnimatedPage>} />
              <Route path="/chat" element={<AnimatedPage><Chat /></AnimatedPage>} />
              <Route path="/secret" element={<AnimatedPage><Secret /></AnimatedPage>} />
              <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
              <Route path="/profile/edit" element={<AnimatedPage><EditProfile /></AnimatedPage>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
