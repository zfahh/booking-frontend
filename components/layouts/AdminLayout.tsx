'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  HomeIcon,
  HistoryIcon,
  SwitchIcon,
  LogoutIcon,
  HamburgerIcon,
  CloseIcon,
} from '@/components/icons'
import { logout, switchRole } from '@/services/auth'
import { setSession } from '@/lib/session'
import { Loader2 } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon, exact: true },
  { href: '/history', label: 'History', icon: HistoryIcon, exact: true },
]

function Sidebar({ onClose, onLogout, onSwitchRole, switching }: { onClose?: () => void; onLogout: () => void; onSwitchRole: () => void; switching: boolean }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-white">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide">Admin</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          )
        })}
        <button
          onClick={onSwitchRole}
          disabled={switching}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {switching ? <Loader2 size={16} className="animate-spin" /> : <SwitchIcon />}
          <span>Switch to User</span>
        </button>
      </nav>

      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [switching, setSwitching] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const handleSwitchRole = async () => {
    setSwitching(true)
    try {
      const { token, user } = await switchRole()
      setSession(token, user.role)
      toast.success('Switched to User')
      router.push('/concerts')
    } catch {
      toast.error('Failed to switch role')
    } finally {
      setSwitching(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside className="hidden md:flex flex-shrink-0 shadow-xl">
        <Sidebar onLogout={handleLogout} onSwitchRole={handleSwitchRole} switching={switching} />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} onLogout={handleLogout} onSwitchRole={handleSwitchRole} switching={switching} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white shadow-md">
          <span className="text-base font-semibold">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
