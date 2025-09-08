// store/uiStore.js
import { create } from "zustand";
import instance from "../utils/axiosInstance";
import debounce from "lodash/debounce";

export const useUIStore = create((set, get) => {
  // --- Debounced Save Function (shared by all updates)
  const debouncedSave = debounce(async () => {
    const { mindMapData, selectedNoteId } = get();
    if (!selectedNoteId) return;

    try {
      await instance.put(`/mindmap/${selectedNoteId}`, mindMapData);
      console.log("✅ Mindmap saved to backend");
    } catch (err) {
      console.error("❌ Mindmap save failed:", err);
    }
  }, 1000); // wait 1s after last change

  return {
    // 🌙 Theme State
    theme: "light",
    initTheme: () => {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const final = stored || (prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", final === "dark");
      set({ theme: final });
    },
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        return { theme: newTheme };
      }),

    // 🧭 Sidebar State
    sidebarMode: "open",
    isSidebarOpen: false,
    setSidebarMode: (mode) => set({ sidebarMode: mode }),
    toggleSidebarMode: () =>
      set((state) => ({ sidebarMode: state.sidebarMode === "open" ? "mini" : "open" })),
    openSidebar: () => set({ isSidebarOpen: true }),
    closeSidebar: () => set({ isSidebarOpen: false }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    // 📏 Topbar State
    isTopbarVisible: true,
    toggleTopbar: () => set((state) => ({ isTopbarVisible: !state.isTopbarVisible })),
    showTopbar: () => set({ isTopbarVisible: true }),
    hideTopbar: () => set({ isTopbarVisible: false }),

    // 🧠 Mind Map State
    mindMapData: { nodes: [], edges: [] },
    isGeneratingMindMap: false,

    setMindMapData: ({ nodes, edges }) => {
      set({ mindMapData: { nodes: nodes || [], edges: edges || [] } });
      debouncedSave();
    },

    setGeneratingMindMap: (isGenerating) => set({ isGeneratingMindMap: isGenerating }),

    updateNode: (id, data) => {
      set((state) => ({
        mindMapData: {
          ...state.mindMapData,
          nodes: state.mindMapData.nodes.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        },
      }));
      debouncedSave();
    },

    updateNodePosition: (id, position) => {
      set((state) => ({
        mindMapData: {
          ...state.mindMapData,
          nodes: state.mindMapData.nodes.map((n) =>
            n.id === id ? { ...n, x: position.x, y: position.y } : n
          ),
        },
      }));
      debouncedSave();
    },

    deleteNode: (id) => {
      set((state) => ({
        mindMapData: {
          ...state.mindMapData,
          nodes: state.mindMapData.nodes.filter((n) => n.id !== id),
          edges: state.mindMapData.edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
        },
      }));
      debouncedSave();
    },

    // 📝 Notes-related UI
    selectedNoteId: null,
    selectedNoteSummary: "",
    setSelectedNoteId: (id) => set({ selectedNoteId: id }),
    setSelectedNoteSummary: (summary) => set({ selectedNoteSummary: summary }),
  };
});
