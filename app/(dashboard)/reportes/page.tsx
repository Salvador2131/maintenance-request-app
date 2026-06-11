'use client'

import { useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { TaskType, TaskPriority } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  Award,
} from 'lucide-react'

const typeLabels: Record<TaskType, string> = {
  electrico: 'Eléctrico',
  informatico: 'Informático',
  fontaneria: 'Fontanería',
  climatizacion: 'Climatización',
  general: 'General',
}

export default function ReportesPage() {
  const { tasks, schools, users } = useAppStore()

  // Calculate statistics
  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) =>
      ['completada', 'verificada', 'cerrada'].includes(t.status)
    )
    const pendingTasks = tasks.filter(
      (t) => t.status === 'pendiente' || t.status === 'asignada'
    )
    const inProgressTasks = tasks.filter((t) => t.status === 'en_progreso')

    // Average resolution time (in days)
    const tasksWithResolution = completedTasks.filter((t) => t.completedAt)
    const avgResolutionMs =
      tasksWithResolution.length > 0
        ? tasksWithResolution.reduce(
            (acc, t) => acc + (t.completedAt!.getTime() - t.createdAt.getTime()),
            0
          ) / tasksWithResolution.length
        : 0
    const avgResolutionDays = Math.round(avgResolutionMs / (1000 * 60 * 60 * 24) * 10) / 10

    return {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      inProgress: inProgressTasks.length,
      avgResolutionDays,
      completionRate: tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0,
    }
  }, [tasks])

  // Tasks by school
  const tasksBySchool = useMemo(() => {
    return schools.map((school) => {
      const schoolTasks = tasks.filter((t) => t.schoolId === school.id)
      const completedTasks = schoolTasks.filter((t) =>
        ['completada', 'verificada', 'cerrada'].includes(t.status)
      )
      return {
        name: school.name.replace('Colegio ', '').replace('Instituto ', '').replace('Escuela ', ''),
        total: schoolTasks.length,
        completed: completedTasks.length,
        pending: schoolTasks.length - completedTasks.length,
      }
    })
  }, [tasks, schools])

  // Tasks by type
  const tasksByType = useMemo(() => {
    return Object.entries(
      tasks.reduce(
        (acc, task) => {
          acc[task.type] = (acc[task.type] || 0) + 1
          return acc
        },
        {} as Record<TaskType, number>
      )
    ).map(([type, count]) => ({
      type: typeLabels[type as TaskType],
      count,
    }))
  }, [tasks])

  // Technician performance
  const technicianPerformance = useMemo(() => {
    const technicians = users.filter((u) => u.role === 'tecnico')
    return technicians.map((tech) => {
      const techTasks = tasks.filter((t) => t.assignedTo === tech.id)
      const completedTasks = techTasks.filter((t) =>
        ['completada', 'verificada', 'cerrada'].includes(t.status)
      )
      return {
        id: tech.id,
        name: tech.name,
        total: techTasks.length,
        completed: completedTasks.length,
        efficiency:
          techTasks.length > 0
            ? Math.round((completedTasks.length / techTasks.length) * 100)
            : 0,
      }
    }).sort((a, b) => b.efficiency - a.efficiency)
  }, [tasks, users])

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'hsl(var(--chart-1))',
    },
    completed: {
      label: 'Completadas',
      color: 'hsl(var(--chart-2))',
    },
    pending: {
      label: 'Pendientes',
      color: 'hsl(var(--chart-3))',
    },
    count: {
      label: 'Cantidad',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Reportes</h1>
        <p className="mt-1 text-muted-foreground">
          Estadísticas y análisis del sistema de mantenimiento
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Tareas"
          value={stats.total}
          icon={<ClipboardList className="h-5 w-5" />}
          description="En el sistema"
        />
        <StatsCard
          title="Tasa de Completado"
          value={`${stats.completionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Tareas finalizadas"
        />
        <StatsCard
          title="Tiempo Promedio"
          value={`${stats.avgResolutionDays} días`}
          icon={<Clock className="h-5 w-5" />}
          description="Resolución promedio"
        />
        <StatsCard
          title="Colegios Activos"
          value={schools.length}
          icon={<Building2 className="h-5 w-5" />}
          description="En la red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tasks by School */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tareas por Colegio</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={tasksBySchool} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" name="Completadas" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" name="Pendientes" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tasks by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={tasksByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Technician Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Award className="h-5 w-5" />
            Rendimiento de Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posición</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead className="text-center">Tareas Asignadas</TableHead>
                <TableHead className="text-center">Completadas</TableHead>
                <TableHead className="text-center">Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicianPerformance.map((tech, index) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-semibold">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell className="text-center">{tech.total}</TableCell>
                  <TableCell className="text-center">{tech.completed}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        tech.efficiency >= 80
                          ? 'bg-green-500/10 text-green-500'
                          : tech.efficiency >= 50
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                      }
                    >
                      {tech.efficiency}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
