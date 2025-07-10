// src/Layouts/DashboardLayout.jsx
import { useResponsiveSidebar } from '../hooks/useResponsiveSideBar';
import { SideBar, TopBar, Footer } from '../Components';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
function DashboardLayout() {
  useResponsiveSidebar();

  const theme = useUIStore((state) => state.theme);

  return (
    <div className={` text-zinc-800 dark:text-white min-h-screen flex  transition-colors ease-in-out duration-300 overflow-hidden ${theme === "dark" ? "bg-charcoal" : "glass-light"} `} >
      {/* Sidebar Always Present */}
      <SideBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[264px]">
        {/* Top Bar */}
       
       <TopBar />
        {/* Page Content */}
        <main className="w-full flex-1 px-4 sm:px-6 py-2   dark:bg-charcoal overflow-y-hidden">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default DashboardLayout;