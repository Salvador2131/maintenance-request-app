'use client'

import { useAppStore } from '@/lib/store'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

const roleLabels: Record<string, string> = {
  contralor: 'Contralor',
  director: 'Director',
  tecnico: 'Técnico',
  admin_equipo: 'Admin Equipo',
}

export function Header() {
  const router = useRouter()
  const { currentUser, notifications, setSidebarOpen, sidebarOpen } = useAppStore()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark')
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleLogout = async () => {
    await fetch('/api/demo-session', { method: 'DELETE' })
    router.push('/login')
  }

  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUser?.id).length

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-foreground">Sistema de Mantenimiento Escolar</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-2 py-1.5 text-sm font-semibold">Notificaciones</div>
            <DropdownMenuSeparator />
            {notifications
              .filter((n) => n.userId === currentUser?.id)
              .slice(0, 5)
              .map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 py-3">
                  <span className={`text-sm font-medium ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notif.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{notif.message}</span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                {currentUser && (
                  <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatar} className="h-8 w-8" />
                )}
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                  <span className="text-xs text-muted-foreground">{roleLabels[currentUser?.role || '']}</span>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">Cambiar Usuario (Demo)</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cambiar de Rol
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
