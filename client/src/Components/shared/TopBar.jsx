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

export const TopBar = () => {
  const [searchValue, setSearchValue] = useState('')
  const toggleTheme = useUIStore((state) => state.toggleTheme)
  const isDarkMode = useUIStore((state) => state.theme === 'dark')
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)

  return (
    <header className="w-full z-10 rounded-xl py-3 px-2 sm:px-4 bg-transparent ">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button onClick={toggleSidebar} className="md:hidden p-2">
            {isSidebarOpen ? (
              <SquareChevronLeft className="w-6 h-6" />
            ) : (
              <SquareChevronRight className="w-6 h-6" />
            )}
          </button>

          <img src={profile} className="w-12 rounded-full hidden md:block" alt="" />
          <div className="hidden lg:block">
            <p className="font-medium leading-none">Chaimae Ouhdane</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 ">
              Today is a great day to conquer your goals 🌟
            </p>
          </div>
        </div>

        <NavLink to="/app/dashboard" className="text-xl font-semibold md:hidden">
          Neuro-Note
        </NavLink>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </div>

          <button className="md:hidden p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600">
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}