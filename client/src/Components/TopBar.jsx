// src/Components/TopBar.jsx
import { useState } from 'react';
import { Sun, Moon, Search, Menu } from 'lucide-react';
import profile from '../assets/profile.jpg';
import { useUIStore } from '../store/uiStore';

export const TopBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const toggleTheme = useUIStore(state => state.toggleTheme);
  const isDarkMode = useUIStore(state => state.theme === 'dark');
  const toggleSidebar = useUIStore(state => state.toggleSidebar);

  return (
    <header className="sticky top-0 left-0 z-40 w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-zinc-50 dark:bg-charcoal shadow-md transition-all">
      {/* Left: Mobile Menu + Profile */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2">
          <Menu className="w-5 h-5 text-zinc-500 dark:text-white" />
        </button>

        <img
          src={profile}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-600"
        />

        <div className="hidden md:block">
          <p className="font-medium leading-none">Chaimae Ouhdane</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Today is a great day to conquer your goals 🌟</p>
        </div>
      </div>

      {/* Right: Search + Theme */}
      <div className="flex items-center gap-4">
        {/* Full Search Input */}
        <div className="hidden md:block relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        </div>

        {/* Mobile Search Icon */}
        <button className="md:hidden p-2">
          <Search className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};