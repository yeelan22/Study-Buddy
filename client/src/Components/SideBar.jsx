import { NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/uiStore';
import {
  Home, MessageCircle, UploadCloud, CalendarCheck2, Brain,
  BookText, FileStack, Settings, LogOut
} from 'lucide-react';
import Dlogo from '../assets/neuroLogo.svg';
import Llogo from '../assets/LneuroLogo.svg';

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

export const SideBar = () => {
  const theme = useUIStore((state) => state.theme);
  const sidebarMode = useUIStore((state) => state.sidebarMode);
  const setSidebarMode = useUIStore((state) => state.setSidebarMode);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const sidebarRef = useRef(null);

  // Responsive sidebar mode on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarMode('open');
        closeSidebar(); // Ensure desktop sidebar is closed on mobile
      } else {
        setSidebarMode('mini');
        closeSidebar(); // Ensure mobile sidebar is closed on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarMode, closeSidebar]);

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSidebar]);

  // Handle click outside for desktop (collapse to mini)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const handleClickOutside = (e) => {
      if (sidebarMode !== 'open') return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarMode('mini');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarMode, setSidebarMode]);

  // Handle hover for mini mode (desktop only)
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (sidebarMode !== 'mini') return;

    const handleMouseEnter = () => setSidebarMode('open');
    const handleMouseLeave = () => setSidebarMode('mini');

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [sidebarMode, setSidebarMode]);

  // Sidebar width
  const sidebarWidth = sidebarMode === 'open' ? 240 : 72;

  // Animations
  const sidebarVariants = {
    open: { width: 240, transition: { type: 'spring', stiffness: 200, damping: 24 } },
    mini: { width: 72, transition: { type: 'spring', stiffness: 200, damping: 24 } },
  };

  // --- Desktop Sidebar ---
  return (
    <>
      <motion.aside
        ref={sidebarRef}
        id="sidebar"
        variants={sidebarVariants}
        animate={sidebarMode}
        initial={false}
        className={`hidden md:flex my-4 mx-3 rounded-3xl flex-col h-screen fixed top-0 left-0 z-30 py-6 px-2 transition-colors
          ${theme === 'dark' ? '' : ''}
        `}
        style={{ width: sidebarWidth }}
      >
        <SidebarContent
          mode={sidebarMode}
          setSidebarMode={setSidebarMode}
        />
      </motion.aside>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            id="sidebar-mobile"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            className={`md:hidden w-[240px] fixed h-screen top-0 left-0 z-50 flex flex-col py-6 px-4 shadow-xl rounded-r-2xl transition-all
              ${theme === 'dark' ? '' : 'bg-white'}
            `}
          >
            <SidebarContent
              mode="open"
              setSidebarMode={() => {}}
              onLinkClick={closeSidebar}
              isMobile
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ mode, setSidebarMode, onLinkClick = () => {}, isMobile = false }) => {
  const theme = useUIStore((state) => state.theme);

  // Tooltip state (for accessibility, you can use a library for better tooltips)
  const [tooltip, setTooltip] = useState(null);

  // When a link is clicked in mini mode, collapse sidebar
  const handleLinkClick = () => {
    if (!isMobile && mode === 'open') setSidebarMode('mini');
    onLinkClick();
  };

  return (
    <>
      {/* Logo (no collapse/expand button on desktop) */}
      <div className={`flex items-center gap-3 mb-10 px-2`}>
        <img src={theme === 'dark' ? Dlogo : Llogo} alt="Neuro Logo" className="w-8 h-8" />
        {mode === 'open' && (
          <span className="text-xl font-semibold whitespace-nowrap transition-all">Neuro-Note</span>
        )}
        {/* No toggle button */}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        {mainLinks.map(({ id, name, icon: Icon, to }) => (
          <NavLink
            key={id}
            to={to}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 relative
              ${isActive
                ? 'bg-blue text-white font-semibold shadow-md'
                : 'hover:bg-charcoal hover:text-white dark:hover:text-zinc-gray dark:hover:bg-white'
              }
              ${mode === 'mini' ? 'justify-center' : ''}
              `
            }
            onMouseEnter={() => setTooltip(mode === 'mini' ? name : null)}
            onMouseLeave={() => setTooltip(null)}
          >
            <Icon className="w-5 h-5" />
            {mode === 'open' && <span className="text-sm">{name}</span>}
            {/* Tooltip */}
            {mode === 'mini' && tooltip === name && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded bg-zinc-900 text-white text-xs shadow-lg z-50 whitespace-nowrap">
                {name}
              </span>
            )}
          </NavLink>
        ))}

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          {bottomLinks.map(({ id, name, icon: Icon, to }) => (
            <NavLink
              key={id}
              to={to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 relative
                ${isActive
                  ? 'text-charcoal font-semibold shadow-md dark:bg-white dark:text-charcoal'
                  : 'hover:bg-charcoal hover:text-white dark:hover:text-zinc-gray dark:hover:bg-white'
                }
                ${mode === 'mini' ? 'justify-center' : ''}
                `
              }
              onMouseEnter={() => setTooltip(mode === 'mini' ? name : null)}
              onMouseLeave={() => setTooltip(null)}
            >
              <Icon className="w-5 h-5" />
              {mode === 'open' && <span className="text-sm">{name}</span>}
              {/* Tooltip */}
              {mode === 'mini' && tooltip === name && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded bg-zinc-900 text-white text-xs shadow-lg z-50 whitespace-nowrap">
                  {name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};