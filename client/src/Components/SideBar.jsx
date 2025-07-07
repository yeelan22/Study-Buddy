// SideBar.jsx
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/uiStore';
import {
  Home,
  MessageCircle,
  UploadCloud,
  CalendarCheck2,
  Brain,
  BookText,
  FileStack,
  Settings,
  LogOut,
} from 'lucide-react';
import Dlogo from '../assets/neuroLogo.svg';
import Llogo from '../assets/LneuroLogo.svg'

const mainLinks = [
  { id: 1, name: 'Dashboard', icon: Home, to: '/app/dashboard' },
  { id: 2, name: 'Chat Smart', icon: MessageCircle, to: '/app/chatSmart' },
  { id: 3, name: 'Upload Notes', icon: UploadCloud, to: '/app/uploadNotes' },
  { id: 4, name: 'Goal Breakdown', icon: CalendarCheck2, to: '/app/goalBreakdown' },
  { id: 5, name: 'Mind Map', icon: Brain, to: '/app/mindMap' },
  { id: 6, name: 'Journal Thoughts', icon: BookText, to: '/app/journalToughts' },
  { id: 7, name: 'Memory Zone', icon: FileStack, to: '/app/memoryZone' },
];

const bottomLinks = [
  { id: 8, name: 'Settings', icon: Settings, to: '/app/settings' },
  { id: 9, name: 'Logout', icon: LogOut, to: '/logout' },
];

export const SideBar = ({ isOpen, onClose }) => {
    const theme = useUIStore((state) => state.theme);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#sidebar')) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          id="sidebar"
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="w-[240px] h-screen fixed top-4 left-4 z-50 flex flex-col py-6 px-4 rounded-3xl shadow-md bg-white text-zinc-800 shadow-zinc-200 dark:bg-charcoal dark:text-white dark:shadow-none"
        >
          <div className="flex items-center gap-3 mb-10 pl-2">
            <img src={ theme === 'dark'? Dlogo : Llogo } alt="Neuro Logo" className="w-8 h-8" />
            <span className="text-xl font-semibold">Neuro-Note</span>
          </div>

          <nav className="flex flex-col gap-2">
            {mainLinks.map(({ id, name, icon: Icon, to }) => (
              <NavLink
                key={id}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 
                  ${isActive
                    ? 'bg-white text-charcoal font-semibold shadow-md dark:bg-white dark:text-charcoal'
                    : 'hover:bg-charcoal hover:text-white dark:hover:text-zinc-gray dark:hover:bg-white'}`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{name}</span>
              </NavLink>
            ))}

            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              {bottomLinks.map(({ id, name, icon: Icon, to }) => (
                <NavLink
                  key={id}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 
                    ${isActive
                      ? 'bg-white text-charcoal font-semibold shadow-md dark:bg-white dark:text-charcoal'
                      : 'hover:bg-charcoal hover:text-white dark:hover:text-zinc-gray dark:hover:bg-white'}`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{name}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

