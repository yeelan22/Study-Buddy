// store/uiStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  theme: 'light',
  initTheme: () => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const final = stored || (prefersDark ? 'dark' : 'light');

    document.documentElement.classList.toggle('dark', final === 'dark');
    set({ theme: final });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),

  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleTopbar: () => set((state) => ({ isTopbarVisible: !state.isTopbarVisible })),
  showTopbar: () => set({ isTopbarVisible: true }),
  hideTopbar: () => set({ isTopbarVisible: false }),
}));

