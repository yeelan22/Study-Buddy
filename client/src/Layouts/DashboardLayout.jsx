import { useResponsiveSidebar } from '../hooks/useResponsiveSideBar'
import { SideBar, TopBar } from '../Components'
import { Outlet } from 'react-router-dom'
import { useUIStore } from '../store/uiStore'

function DashboardLayout() {
  useResponsiveSidebar()
  const theme = useUIStore((state) => state.theme)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)

  return (
    <div
      className={`text-zinc-800 bg-gradient-to-tl from-[#f8fafd] via-[#eef1fb] to-[#e1e6ff]   dark:from-[#1e1e2d] dark:via-[#2a2a38] dark:to-[#1a1a26] dark:text-white min-h-screen flex transition-colors ease-in-out duration-300`}
    >
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <SideBar />
      </div>

      {/* Scrollable page content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-[240px]' : 'ml-0'
        }`}
      >
        <div className="w-full min-h-screen  overflow-y-auto md:px-4 md:py-4">
          <div className="max-w-[1440px] mx-auto md:rounded-3xl glass dark:bg-zinc-900/50 dark:backdrop-blur-xl md:border md:border-white/1 md:dark:border-zinc-700 shadow-lg md:p-4 ">
            {/* TopBar inside glass card */}
            <TopBar/>

            {/* Routed page content */}
            <div className="mt-5">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout