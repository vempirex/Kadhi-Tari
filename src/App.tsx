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

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGuard><Navbar /></AuthGuard>}>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/letters" element={<Letters />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/thoughts" element={<Thoughts />} />
            <Route path="/timeline" element={<MemoryTimeline />} />
            <Route path="/jokes" element={<Jokes />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/secret" element={<Secret />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
