'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'
import { useAppStore } from '@/lib/store'
import { Loader2 } from 'lucide-react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const dataSource = useAppStore((s) => s.dataSource)

  if (dataSource === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
