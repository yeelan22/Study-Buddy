// components/ThemeToggle.jsx
import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export default function ThemeToggle() {
  const { theme, toggleTheme, initTheme } = useUIStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
