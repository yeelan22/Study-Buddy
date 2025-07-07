import { useState } from 'react';
import { TopBar, SideBar, Footer } from '../Components';

export const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col md:ml-[264px] transition-all duration-300">
        {/* TopBar */}
        <TopBar />

        {/* Main content area */}
        <main className="flex-1 p-6 bg-gray-300 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 m-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};