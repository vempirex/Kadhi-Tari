import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white relative overflow-x-hidden">
        {/* Cinematic Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-300 rounded-full blur-[150px]"
          />
        </div>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthGuard><Navbar /></AuthGuard>}>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/feed" element={<PageWrap><Feed /></PageWrap>} />
              <Route path="/letters" element={<PageWrap><Letters /></PageWrap>} />
              <Route path="/playlist" element={<PageWrap><Playlist /></PageWrap>} />
              <Route path="/thoughts" element={<PageWrap><Thoughts /></PageWrap>} />
              <Route path="/timeline" element={<PageWrap><MemoryTimeline /></PageWrap>} />
              <Route path="/jokes" element={<PageWrap><Jokes /></PageWrap>} />
              <Route path="/planner" element={<PageWrap><Planner /></PageWrap>} />
              <Route path="/chat" element={<PageWrap><Chat /></PageWrap>} />
              <Route path="/secret" element={<PageWrap><Secret /></PageWrap>} />
              <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
              <Route path="/profile/edit" element={<PageWrap><EditProfile /></PageWrap>} />
            </Route>
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="container mx-auto px-4 pt-16 pb-32 relative z-10"
    >
      {children}
    </motion.div>
  );
}
