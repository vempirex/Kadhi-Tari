import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import FAB from './FAB';
import { motion } from 'framer-motion';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#050506] flex flex-col lg:flex-row">
      <Header />
      
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-16 sm:pt-20 content-safe-bottom min-h-screen relative overflow-x-hidden">
        {/* Background Decorative Elements (Global) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.03, 0.06, 0.03],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-rose-500 rounded-full blur-[150px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.02, 0.05, 0.02],
              x: [0, -40, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] left-[10%] w-[60%] h-[60%] bg-orange-400 rounded-full blur-[180px]"
          />
        </div>

        {/* Page Content */}
        <div className="relative z-10 page-container py-8 sm:py-12">
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
