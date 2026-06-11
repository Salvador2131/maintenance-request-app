'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Building2,
  Users,
  Settings,
  BarChart3,
  Wrench,
  X,
} from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'

const roleLabels: Record<string, string> = {
  contralor: 'Contralor',
  director: 'Director',
  tecnico: 'Técnico',
  admin_equipo: 'Admin Equipo',
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['contralor', 'director', 'tecnico', 'admin_equipo'],
  },
  {
    title: 'Tareas',
    href: '/tareas',
    icon: ClipboardList,
    roles: ['contralor', 'director', 'tecnico', 'admin_equipo'],
  },
  {
    title: 'Calendario',
    href: '/calendario',
    icon: Calendar,
    roles: ['contralor', 'director', 'tecnico', 'admin_equipo'],
  },
  {
    title: 'Colegios',
    href: '/colegios',
    icon: Building2,
    roles: ['contralor'],
  },
  {
    title: 'Equipos',
    href: '/equipos',
    icon: Users,
    roles: ['contralor', 'admin_equipo'],
  },
  {
    title: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    roles: ['contralor'],
  },
  {
    title: 'Configuración',
    href: '/configuracion',
    icon: Settings,
    roles: ['contralor', 'director'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentUser, sidebarOpen, setSidebarOpen } = useAppStore()

  const filteredNavItems = navItems.filter((item) =>
    currentUser ? item.roles.includes(currentUser.role) : false
  )

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary">
              <Wrench className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">MantenPro</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            {currentUser && (
              <UserAvatar
                name={currentUser.name}
                avatarUrl={currentUser.avatar}
                className="h-10 w-10"
                fallbackClassName="bg-sidebar-primary text-sidebar-primary-foreground"
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser?.name}</span>
              <span className="text-xs text-sidebar-foreground/70">{roleLabels[currentUser?.role || '']}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/50">
            Sistema de Gestión v1.0
          </p>
        </div>
      </aside>
    </>
  )
}
