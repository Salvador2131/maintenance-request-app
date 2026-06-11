'use client'

import { useAppStore } from '@/lib/store'
import { filterTasksByRole } from '@/lib/role-filters'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentTasks } from '@/components/dashboard/recent-tasks'
import { TasksByTypeChart, TasksByPriorityChart } from '@/components/dashboard/tasks-chart'
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react'

export default function DashboardPage() {
  const { currentUser, tasks, schools, teams } = useAppStore()

  const filteredTasks = filterTasksByRole(tasks, currentUser, teams)

  const pendingTasks = filteredTasks.filter((t) => t.status === 'pendiente' || t.status === 'asignada')
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'en_progreso')
  const completedTasks = filteredTasks.filter((t) =>
    ['completada', 'verificada', 'cerrada'].includes(t.status)
  )
  const urgentTasks = filteredTasks.filter(
    (t) => t.priority === 'urgente' && !['cerrada', 'verificada'].includes(t.status)
  )

  const roleGreetings: Record<string, string> = {
    contralor: 'Panel de Control General',
    director: 'Panel de Tu Colegio',
    tecnico: 'Tus Tareas Asignadas',
    admin_equipo: 'Panel del Equipo',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {roleGreetings[currentUser?.role || 'contralor']}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido, {currentUser?.name ?? 'Usuario'}. Aquí está el resumen de actividades.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Tareas"
          value={filteredTasks.length}
          icon={<ClipboardList className="h-5 w-5" />}
          description="En el sistema"
        />
        <StatsCard
          title="Pendientes"
          value={pendingTasks.length}
          icon={<Clock className="h-5 w-5" />}
          description="Requieren atención"
          className={pendingTasks.length > 0 ? 'border-amber-500/50' : ''}
        />
        <StatsCard
          title="En Progreso"
          value={inProgressTasks.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="En ejecución"
        />
        <StatsCard
          title="Completadas"
          value={completedTasks.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Finalizadas"
        />
      </div>

      {currentUser?.role === 'contralor' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatsCard
            title="Colegios Activos"
            value={schools.length}
            icon={<Building2 className="h-5 w-5" />}
            description="En la red"
          />
          <StatsCard
            title="Tareas Urgentes"
            value={urgentTasks.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            description="Requieren atención inmediata"
            className={urgentTasks.length > 0 ? 'border-red-500/50 bg-red-500/5' : ''}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <TasksByTypeChart tasks={filteredTasks} />
        <TasksByPriorityChart tasks={filteredTasks} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTasks
          tasks={filteredTasks.filter((t) => !['cerrada', 'verificada'].includes(t.status))}
          title="Tareas Activas"
        />
        <RecentTasks
          tasks={filteredTasks
            .filter((t) => t.priority === 'urgente' || t.priority === 'alta')
            .slice(0, 5)}
          title="Alta Prioridad"
        />
      </div>
    </div>
  )
}
