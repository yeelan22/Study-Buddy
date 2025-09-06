// src/Components/TopBar.jsx
import { useState } from 'react'
import {
  Sun,
  Moon,
  Search,
  SquareChevronRight,
  SquareChevronLeft,
} from 'lucide-react'
import profile from '../../assets/profile.jpg'
import { useUIStore } from '../../store/uiStore'
import { NavLink } from 'react-router-dom'
import { Tooltip } from './Tooltip'

import { useUserStore } from '../../store/userStore' 

export const TopBar = () => {
  const toggleTheme = useUIStore((state) => state.toggleTheme)
  const isDarkMode = useUIStore((state) => state.theme === 'dark')
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)
  const { name, avatar } = useUserStore((state) => state.user)

  return (
    <header className="w-full z-10 rounded-xl py-3 px-2 sm:px-4 bg-transparent ">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <Tooltip text={isSidebarOpen ? "Close sidebar" : "Open sidebar"}>
            <button onClick={toggleSidebar} className="md:hidden p-2">
              {isSidebarOpen ? (
                <SquareChevronLeft className="w-6 h-6" />
              ) : (
                <SquareChevronRight className="w-6 h-6" />
              )}
            </button>
          </Tooltip>

          <Tooltip text="Profile">
            <img src={`${avatar}`} className="w-12 rounded-full hidden md:block cursor-pointer" alt="profile" />
          </Tooltip>
          <div className="hidden md:block">
            <p className="font-medium leading-none">{name}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 ">
              Today is a great day to conquer your goals 🌟
            </p>
          </div>
        </div>

        <Tooltip text="Go to dashboard">
          <NavLink to="/app/dashboard" className="text-xl font-semibold md:hidden">
            Neuro-Note
          </NavLink>
        </Tooltip>

          <Tooltip text={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <button
              onClick={toggleTheme}
              className="cursor-pointer p-2 rounded-full bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </Tooltip>
      </div>
    </header>
  )
}