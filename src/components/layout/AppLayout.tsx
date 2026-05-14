import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import FAB from './FAB';
import { motion } from 'framer-motion';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#050506] flex flex-col lg:flex-row selection:bg-rose-500/40 selection:text-white">
      <Header />
      
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[28rem] pt-32 sm:pt-48 content-safe-bottom min-h-screen relative overflow-x-hidden">
        {/* Background Decorative Elements (Global Sanctuary Vibes) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.05, 0.12, 0.05],
              x: [0, 150, 0],
              y: [0, 100, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] right-[-15%] w-[80%] h-[80%] bg-rose-600 rounded-full blur-[250px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.03, 0.08, 0.03],
              x: [0, -120, 0],
              y: [0, -80, 0]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", delay: 8 }}
            className="absolute bottom-[-25%] left-[-15%] w-[90%] h-[90%] bg-orange-500 rounded-full blur-[300px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,6,0.98)_100%)]" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 px-6 sm:px-20 max-w-[1920px] mx-auto py-16 sm:py-32">
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
