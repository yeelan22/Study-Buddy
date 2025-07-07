// TopBar.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Search } from 'lucide-react';
import profile from '../assets/profile.jpg'; // replace with your actual static image
import { useUIStore } from '../store/uiStore';

export const TopBar = () => {
  const [searchValue, setSearchValue] = useState('');
    const toggleDarkMode = useUIStore((state) => state.toggleTheme);
    const isDarkMode = useUIStore((state) => state.theme === 'dark');
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 shadow-md bg-zinc-50 dark:bg-charcoal text-zinc-800 dark:text-white"
    >
      {/* Left side: Greeting */}
      <div className="flex items-center gap-4">
        <img
          src={profile}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-600"
        />
        <div>
          <p className="font-medium leading-none">Chaimae Ouhdane</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Today is a great day to conquer your goals 🌟</p>
        </div>
      </div>

      {/* Right side: Search + Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </motion.header>
  );
};
