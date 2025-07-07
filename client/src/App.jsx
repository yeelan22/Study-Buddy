import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from './layouts/ProtectedLayout';
import DashboardLayout from './layouts/DashboardLayout';
import {
  Dashboard, ChatSmart, GoalBreakdown,
  JournalToughts, MemoryZone, MindMap,
  Settings, UploadNotes, LandingPage,
  Login, Register
} from "./Pages";
import { useUIStore } from "./store/uiStore";

function App() {
   const initTheme = useUIStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, []);
  return (
      <Routes>
        {/* Public */}
        <Route path="/" element={<ChatSmart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/app" element={<ProtectedLayout />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="goalBreakdown" element={<GoalBreakdown />} />
            <Route path="journalToughts" element={<JournalToughts />} />
            <Route path="memoryZone" element={<MemoryZone />} />
            <Route path="mindMap" element={<MindMap />} />
            <Route path="settings" element={<Settings />} />
            <Route path="uploadNotes" element={<UploadNotes />} />
            {/* <Route path="chatSmart" element={<ChatSmart />} /> */}
          </Route>
        </Route>
      </Routes>
  );
}

export default App;

