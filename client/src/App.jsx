import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedLayout from './layouts/ProtectedLayout';
import DashboardLayout from './layouts/DashboardLayout';
import {
  Dashboard, ChatSmart, GoalBreakdown,
  JournalToughts, MemoryZone, MindMap,
  Settings, UploadNotes
} from "./Pages";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
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
            <Route path="chatSmart" element={<ChatSmart />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

