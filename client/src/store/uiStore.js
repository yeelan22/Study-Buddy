import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // 🌙 Theme State
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

  // 🧭 Sidebar State
  sidebarMode: 'open',
  isSidebarOpen: false,
  setSidebarMode: (mode) => set({ sidebarMode: mode }),
  toggleSidebarMode: () =>
    set((state) => ({ sidebarMode: state.sidebarMode === 'open' ? 'mini' : 'open' })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // 📏 Topbar State
  isTopbarVisible: true,
  toggleTopbar: () => set((state) => ({ isTopbarVisible: !state.isTopbarVisible })),
  showTopbar: () => set({ isTopbarVisible: true }),
  hideTopbar: () => set({ isTopbarVisible: false }),

  // 🧠 Mind Map State (used by MindMap.jsx)
  mindMapData: null, // contains { nodes, edges, summary }
  setMindMapData: ({ nodes, edges }) => set({ mindMapData: { nodes, edges } }),


  // 📝 Notes-related UI
  selectedNoteId: null,
  selectedNoteSummary: '',
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  setSelectedNoteSummary: (summary) => set({ selectedNoteSummary: summary }),


  // In your useUIStore:
  updateNode: (id, data) => set(state => ({
    mindMapData: {
      ...state.mindMapData,
      nodes: state.mindMapData.nodes.map(n =>
        n.id === id ? { ...n, ...data } : n
      )
    }
  })),
  deleteNode: (id) => set(state => ({
      mindMapData: {
      ...state.mindMapData,
      nodes: state.mindMapData.nodes.filter(n => n.id !== id),
      edges: state.mindMapData.edges.filter(e => e.source !== id && e.target !== id)
    }
  })),

  updateNodePosition: (id, position) => set(state => ({
  mindMapData: {
    ...state.mindMapData,
    nodes: state.mindMapData.nodes.map(n =>
      n.id === id ? { ...n, x: position.x, y: position.y } : n
    )
  }
   })),

  viewMode: 'mindmap',
  setViewMode: (mode) => set({ viewMode: mode }),

   
}));
