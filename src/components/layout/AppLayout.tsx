import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import FAB from './FAB';
import { motion } from 'framer-motion';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#050506] flex flex-col lg:flex-row selection:bg-rose-500/30 selection:text-rose-200">
      <Header />
      
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 pt-24 sm:pt-32 content-safe-bottom min-h-screen relative overflow-x-hidden">
        {/* Background Decorative Elements (Global Sanctuary Vibes) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.03, 0.08, 0.03],
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-rose-500 rounded-full blur-[200px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.02, 0.06, 0.02],
              x: [0, -80, 0],
              y: [0, -40, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-orange-400 rounded-full blur-[250px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 px-4 sm:px-12 max-w-[1600px] mx-auto py-12 sm:py-20">
          <Outlet />
        </div>
      </main>

      {/* Navigation for Mobile */}
      <BottomNav />
      
      {/* Global Actions */}
      <FAB />
    </div>
  );
}
