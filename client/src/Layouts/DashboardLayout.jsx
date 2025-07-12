// src/Layouts/DashboardLayout.jsx
import { useResponsiveSidebar } from '../hooks/useResponsiveSideBar';
import { SideBar, TopBar, Footer } from '../Components';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

function DashboardLayout() {
  useResponsiveSidebar();
  const theme = useUIStore((state) => state.theme);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div
      className={`text-zinc-800 dark:text-white min-h-screen flex transition-colors ease-in-out duration-300 overflow-hidden ${
        theme === 'dark' ? 'bg-charcoal' : 'glass-light'
      }`}
    >
      <SideBar />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-[264px]' : 'ml-0'
        }`}
      >
        <TopBar />
        <main className="flex-1 px-4 sm:px-6 py-4 dark:bg-charcoal overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;