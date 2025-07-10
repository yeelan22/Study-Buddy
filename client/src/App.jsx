import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from './Layouts/ProtectedLayout';
import DashboardLayout from './Layouts/DashboardLayout';
import {
  Dashboard, ChatSmart, GoalBreakdown,
  JournalToughts, MemoryZone, MindMap,
  Settings, UploadNotes, LandingPage,
  Login, Register
} from "./Pages";
import { useUIStore } from "./store/uiStore";
import { useUserStore } from "./store/userStore";

function App() {
  const initTheme = useUIStore((s) => s.initTheme);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    initTheme();
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user) {
        setUser(parsed.user);
      }
    }
  }, []);
  return (
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/app" element={<ProtectedLayout />}>
          <Route element={<DashboardLayout />}>
            <Route index path='dashboard' element={<Dashboard />} />
            <Route path="goalBreakdown" element={<GoalBreakdown />} />
            <Route path="journalToughts" element={<JournalToughts />} />
            <Route path="memoryZone" element={<MemoryZone />} />
            <Route path="mindMap" element={<MindMap />} />
            <Route path="settings" element={<Settings />} />
            <Route path="uploadNotes" element={<UploadNotes />} />
            <Route path="chatSmart" element={<ChatSmart />} />
          </Route>
        </Route>
      </Routes>
  );
}

export default App;

