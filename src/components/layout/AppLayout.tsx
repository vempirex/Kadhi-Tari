import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import FAB from './FAB';
import { motion } from 'framer-motion';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-charcoal flex flex-col lg:flex-row selection:bg-rose-100 selection:text-rose-900">
      <Header />
      
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen relative overflow-x-hidden">
        {/* Background Decorative Elements - Subtle & Professional */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-warm-50/30">
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-50 rounded-full blur-[120px]"
          />
        </div>

        {/* Page Content */}
        <div className="relative z-10 px-4 sm:px-8 max-w-7xl mx-auto py-8 sm:py-12 pb-32 lg:pb-12">
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
