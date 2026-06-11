'use client'

import { Task, TaskPriority, TaskStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  baja: { label: 'Baja', className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  media: { label: 'Media', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  alta: { label: 'Alta', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  urgente: { label: 'Urgente', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pendiente: { label: 'Pendiente', className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  asignada: { label: 'Asignada', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  en_progreso: { label: 'En Progreso', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  completada: { label: 'Completada', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  verificada: { label: 'Verificada', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  rechazada: { label: 'Rechazada', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  cerrada: { label: 'Cerrada', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
}

interface RecentTasksProps {
  tasks: Task[]
  title?: string
}

export function RecentTasks({ tasks, title = 'Tareas Recientes' }: RecentTasksProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Link href="/tareas" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          Ver todas <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No hay tareas</p>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <Link
                key={task.id}
                href={`/tareas/${task.id}`}
                className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.schoolName}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline" className={priorityConfig[task.priority].className}>
                      {priorityConfig[task.priority].label}
                    </Badge>
                    <Badge variant="outline" className={statusConfig[task.status].className}>
                      {statusConfig[task.status].label}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(task.createdAt, { addSuffix: true, locale: es })}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
