// src/layouts/DashboardLayout.jsx
import { useUIStore } from '../store/uiStore'
import { SideBar, TopBar } from '../Components/shared'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  const theme = useUIStore((state) => state.theme)
  const sidebarMode = useUIStore((state) => state.sidebarMode)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)

  // Sidebar width for desktop
  const sidebarWidth = sidebarMode === 'open' ? 240 : 72

  return (
    <div
    className={`h-full min-h-screen text-zinc-800 
        bg-gradient-to-bl 
        from-[#3b83f681] 
        via-[#f3e8ff] 
        to-[#3b83f669]
        dark:bg-gradient-to-tl
        dark:from-charcoal 
        dark:via-[#3b83f69e]
        dark:to-charcoal  
        dark:text-white 
        flex transition-colors ease-in-out duration-300`}
     >
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <SideBar />
      </div>

      {/* Scrollable page content */}
      <div
        className={`flex-1 ml-0 transition-all duration-300
          md:ml-[${sidebarWidth}px]
        `}
        style={{
          marginLeft: isSidebarOpen
            ? 0
            : window.innerWidth >= 768
            ? sidebarWidth
            : 0,
        }}
      >
        <div className="w-full h-full md:ml-3 md:px-4 md:py-4">
          <div className="max-w-[1440px] mx-auto md:rounded-3xl glass-container md:p-4 ">
            {/* TopBar inside glass card */}
            <TopBar />

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