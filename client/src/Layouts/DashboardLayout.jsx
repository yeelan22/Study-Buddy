// src/layouts/DashboardLayout.jsx
import { useUIStore } from '../store/uiStore'
import { SideBar, TopBar } from '../Components/shared'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

function DashboardLayout() {
  const theme = useUIStore((state) => state.theme)
  const sidebarMode = useUIStore((state) => state.sidebarMode)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const [isDesktop, setIsDesktop] = useState(false)

  const sidebarWidth = sidebarMode === "open" ? 240 : 72

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 960)
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return (
    <div
      className={`h-screen text-zinc-800 
        bg-gradient-to-bl from-[#3b83f681] via-[#f3e8ff] to-[#3b83f669]
        dark:bg-gradient-to-tl dark:from-charcoal dark:via-[#3b83f69e] dark:to-charcoal  
        dark:text-white flex transition-colors ease-in-out duration-300`}
    >
      {/* Sidebar */}
      <div
        className={`
          transition-all duration-300
          ${isDesktop ? "sticky top-0 shrink-0" : "fixed inset-y-0 left-0 z-50"}
          ${!isDesktop && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"}
        `}
        style={isDesktop ? { width: sidebarWidth + 8 } : { width: 240 }}
      >
        <SideBar />
      </div>

      {/* Content (scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-[1440px] mx-auto rounded-3xl glass-container p-4 min-h-full">
          <TopBar />
          <div className="mt-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
