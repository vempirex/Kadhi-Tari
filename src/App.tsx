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
import Login from './pages/Login';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background bg-grain text-white relative">
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary rounded-full blur-[150px]"
          />
        </div>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthGuard><Navbar /></AuthGuard>}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/feed" element={<PageTransition><Feed /></PageTransition>} />
              <Route path="/letters" element={<PageTransition><Letters /></PageTransition>} />
              <Route path="/playlist" element={<PageTransition><Playlist /></PageTransition>} />
              <Route path="/thoughts" element={<PageTransition><Thoughts /></PageTransition>} />
              <Route path="/timeline" element={<PageTransition><MemoryTimeline /></PageTransition>} />
              <Route path="/jokes" element={<PageTransition><Jokes /></PageTransition>} />
              <Route path="/planner" element={<PageTransition><Planner /></PageTransition>} />
              <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
              <Route path="/secret" element={<PageTransition><Secret /></PageTransition>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="container mx-auto px-4 pt-20 pb-32"
    >
      {children}
    </motion.div>
  );
}

export default App
