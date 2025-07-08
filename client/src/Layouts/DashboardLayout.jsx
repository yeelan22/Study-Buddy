// src/Layouts/DashboardLayout.jsx
import { useResponsiveSidebar } from '../hooks/useResponsiveSideBar';
import { SideBar, TopBar, Footer } from '../Components';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  useResponsiveSidebar();

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900 overflow-x-hidden">
      {/* Sidebar Always Present */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[264px]">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 bg-zinc-100 dark:bg-zinc-900 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;