import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, Mail, Music, MessageCircle, MoreHorizontal, Calendar, Smile, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Image, path: '/feed', label: 'Feed' },
  { icon: Mail, path: '/letters', label: 'Letters' },
  { icon: MessageCircle, path: '/chat', label: 'Chat' },
  { icon: MoreHorizontal, path: '/more', label: 'More' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      <main className="pb-24 pt-4 px-4 max-w-2xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="glass-card rounded-3xl p-2 flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="relative p-3 flex flex-col items-center gap-1 group"
              >
                <item.icon 
                  size={20} 
                  className={twMerge(
                    "transition-all duration-300",
                    isActive ? "text-primary scale-110" : "text-gray-400 group-hover:text-white"
                  )} 
                />
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/10 blur-md rounded-full -z-10"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  );
}
