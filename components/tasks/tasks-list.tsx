'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { filterTasksByRole } from '@/lib/role-filters'
import { TaskPriority, TaskStatus, TaskType } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Plus, Search, Filter, Eye } from 'lucide-react'

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

const typeLabels: Record<TaskType, string> = {
  electrico: 'Eléctrico',
  informatico: 'Informático',
  fontaneria: 'Fontanería',
  climatizacion: 'Climatización',
  general: 'General',
}

export function TasksList() {
  const { currentUser, tasks, schools, teams } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [schoolFilter, setSchoolFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    let result = filterTasksByRole(tasks, currentUser, teams)

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.location.toLowerCase().includes(searchLower)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter)
    }
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter)
    }
    if (schoolFilter !== 'all') {
      result = result.filter((t) => t.schoolId === schoolFilter)
    }
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter)
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [tasks, currentUser, teams, search, statusFilter, priorityFilter, schoolFilter, typeFilter])

  const canCreateTask = currentUser?.role === 'director' || currentUser?.role === 'contralor'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Tareas</h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona las solicitudes de mantenimiento
          </p>
        </div>
        {canCreateTask && (
          <Link href="/tareas/nueva">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value ?? 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                {Object.entries(priorityConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentUser?.role === 'contralor' && (
              <Select value={schoolFilter} onValueChange={(value) => setSchoolFilter(value ?? 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Colegio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los colegios</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value ?? 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Tarea</TableHead>
                  <TableHead>Colegio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No se encontraron tareas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">{task.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{task.schoolName}</TableCell>
                      <TableCell>
                        <span className="text-sm">{typeLabels[task.type]}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityConfig[task.priority].className}>
                          {priorityConfig[task.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[task.status].className}>
                          {statusConfig[task.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {task.assignedToName || <span className="text-muted-foreground">Sin asignar</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(task.createdAt, { addSuffix: true, locale: es })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/tareas/${task.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
