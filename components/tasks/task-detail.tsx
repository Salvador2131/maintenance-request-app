'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import {
  addTaskCommentAction,
  assignTaskAction,
  updateTaskStatusAction,
} from '@/lib/actions/tasks'
import { isActionFailure } from '@/lib/actions/types'
import { Task, TaskPriority, TaskStatus, TaskType, TaskComment } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  MapPin,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Play,
  UserPlus,
} from 'lucide-react'

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

interface TaskDetailProps {
  taskId: string
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter()
  const { currentUser, tasks, users, dataSource, replaceTask, updateTaskStatus, assignTask, addTaskComment, addNotification } = useAppStore()
  const [comment, setComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">Tarea no encontrada</p>
        <Link href="/tareas" className="mt-4">
          <Button variant="outline">Volver a Tareas</Button>
        </Link>
      </div>
    )
  }

  const technicians = users.filter((u) => u.role === 'tecnico')

  const canAssign = currentUser?.role === 'contralor' || currentUser?.role === 'admin_equipo'
  const canChangeStatus = task.assignedTo === currentUser?.id || currentUser?.role === 'contralor'
  const canVerify = currentUser?.role === 'director' && task.schoolId === currentUser.schoolId

  const handleAddComment = async () => {
    if (!comment.trim() || !currentUser) return

    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await addTaskCommentAction({
        taskId: task.id,
        userId: currentUser.id,
        userName: currentUser.name,
        content: comment.trim(),
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      addTaskComment(task.id, result.data)
      setComment('')
      toast.success('Comentario agregado')
      router.refresh()
      return
    }

    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      userName: currentUser.name,
      content: comment,
      createdAt: new Date(),
    }

    addTaskComment(task.id, newComment)
    setComment('')
    toast.success('Comentario agregado')
  }

  const handleAssign = async () => {
    if (!selectedTechnician) return

    const tech = users.find((u) => u.id === selectedTechnician)
    if (!tech) return

    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await assignTaskAction({
        taskId: task.id,
        technicianId: tech.id,
        technicianName: tech.name,
        taskTitle: task.title,
        schoolName: task.schoolName,
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      replaceTask(result.data)
      setShowAssignDialog(false)
      toast.success(`Tarea asignada a ${tech.name}`)
      router.refresh()
      return
    }

    assignTask(task.id, tech.id, tech.name)

    addNotification({
      id: `notif-${Date.now()}`,
      userId: tech.id,
      title: 'Nueva tarea asignada',
      message: `${task.title} - ${task.schoolName}`,
      type: 'tarea_asignada',
      read: false,
      createdAt: new Date(),
      taskId: task.id,
    })

    setShowAssignDialog(false)
    toast.success(`Tarea asignada a ${tech.name}`)
  }

  const handleStartTask = async () => {
    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await updateTaskStatusAction({
        taskId: task.id,
        status: 'en_progreso',
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      replaceTask(result.data)
      toast.success('Tarea iniciada')
      router.refresh()
      return
    }

    updateTaskStatus(task.id, 'en_progreso')
    toast.success('Tarea iniciada')
  }

  const handleCompleteTask = async () => {
    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await updateTaskStatusAction({
        taskId: task.id,
        status: 'completada',
        taskTitle: task.title,
        schoolId: task.schoolId,
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      replaceTask(result.data)
      toast.success('Tarea marcada como completada')
      router.refresh()
      return
    }

    updateTaskStatus(task.id, 'completada')

    const school = task.schoolId
    const director = users.find((u) => u.role === 'director' && u.schoolId === school)
    if (director) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId: director.id,
        title: 'Tarea completada',
        message: `${task.title} está lista para verificación`,
        type: 'tarea_completada',
        read: false,
        createdAt: new Date(),
        taskId: task.id,
      })
    }

    toast.success('Tarea marcada como completada')
  }

  const handleVerify = async () => {
    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await updateTaskStatusAction({
        taskId: task.id,
        status: 'verificada',
        taskTitle: task.title,
        assignedToId: task.assignedTo,
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      replaceTask(result.data)
      toast.success('Tarea verificada y aprobada')
      router.refresh()
      return
    }

    updateTaskStatus(task.id, 'verificada')

    addNotification({
      id: `notif-${Date.now()}`,
      userId: task.assignedTo || '',
      title: 'Tarea verificada',
      message: `${task.title} ha sido verificada`,
      type: 'tarea_verificada',
      read: false,
      createdAt: new Date(),
      taskId: task.id,
    })

    toast.success('Tarea verificada y aprobada')
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Por favor ingresa un motivo de rechazo')
      return
    }

    if (dataSource === 'supabase') {
      setIsSaving(true)
      const result = await updateTaskStatusAction({
        taskId: task.id,
        status: 'rechazada',
        rejectionReason: rejectReason,
        taskTitle: task.title,
        assignedToId: task.assignedTo,
      })
      setIsSaving(false)

      if (isActionFailure(result)) {
        toast.error(result.error)
        return
      }

      replaceTask(result.data)
      setShowRejectDialog(false)
      toast.error('Tarea rechazada')
      router.refresh()
      return
    }

    updateTaskStatus(task.id, 'rechazada', rejectReason)

    addNotification({
      id: `notif-${Date.now()}`,
      userId: task.assignedTo || '',
      title: 'Tarea rechazada',
      message: `${task.title} - ${rejectReason}`,
      type: 'tarea_rechazada',
      read: false,
      createdAt: new Date(),
      taskId: task.id,
    })

    setShowRejectDialog(false)
    toast.error('Tarea rechazada')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/tareas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={priorityConfig[task.priority].className}>
                {priorityConfig[task.priority].label}
              </Badge>
              <Badge variant="outline" className={statusConfig[task.status].className}>
                {statusConfig[task.status].label}
              </Badge>
              <span className="text-sm text-muted-foreground">{typeLabels[task.type]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{task.description}</p>
            </CardContent>
          </Card>

          {/* Rejection Reason */}
          {task.status === 'rechazada' && task.rejectionReason && (
            <Card className="border-red-500/50 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-500">
                  <XCircle className="h-5 w-5" />
                  Motivo de Rechazo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{task.rejectionReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Comentarios ({task.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.comments.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No hay comentarios aún
                </p>
              ) : (
                task.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 rounded-lg border border-border p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {c.userName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{c.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(c.createdAt, { addSuffix: true, locale: es })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.content}</p>
                    </div>
                  </div>
                ))
              )}

              <Separator />

              <div className="space-y-2">
                <Textarea
                  placeholder="Agregar un comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={!comment.trim() || isSaving} className="w-full sm:w-auto">
                  Agregar Comentario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Colegio</p>
                  <p className="text-sm text-muted-foreground">{task.schoolName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-sm text-muted-foreground">{task.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Creado por</p>
                  <p className="text-sm text-muted-foreground">{task.createdByName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de creación</p>
                  <p className="text-sm text-muted-foreground">
                    {format(task.createdAt, 'PPP', { locale: es })}
                  </p>
                </div>
              </div>
              {task.assignedToName && (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Asignado a</p>
                    <p className="text-sm text-muted-foreground">{task.assignedToName}</p>
                  </div>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Completada</p>
                    <p className="text-sm text-muted-foreground">
                      {format(task.completedAt, 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Assign Button */}
              {canAssign && (task.status === 'pendiente' || task.status === 'rechazada') && (
                <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                  <DialogTrigger
                    render={
                      <Button className="w-full gap-2">
                        <UserPlus className="h-4 w-4" />
                        Asignar Técnico
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Asignar Técnico</DialogTitle>
                      <DialogDescription>
                        Selecciona un técnico para asignar esta tarea
                      </DialogDescription>
                    </DialogHeader>
                    <Select
                      value={selectedTechnician}
                      onValueChange={(value) => setSelectedTechnician(value ?? '')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name} - {tech.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAssign} disabled={isSaving || !selectedTechnician}>
                        {isSaving ? 'Asignando...' : 'Asignar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Start Button */}
              {canChangeStatus && task.status === 'asignada' && (
                <Button onClick={handleStartTask} className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Iniciar Tarea
                </Button>
              )}

              {/* Complete Button */}
              {canChangeStatus && task.status === 'en_progreso' && (
                <Button onClick={handleCompleteTask} className="w-full gap-2" variant="default">
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar Completada
                </Button>
              )}

              {/* Verify/Reject Buttons */}
              {canVerify && task.status === 'completada' && (
                <>
                  <Button onClick={handleVerify} className="w-full gap-2" variant="default">
                    <CheckCircle2 className="h-4 w-4" />
                    Verificar y Aprobar
                  </Button>
                  <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogTrigger
                      render={
                        <Button variant="destructive" className="w-full gap-2">
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </Button>
                      }
                    />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rechazar Tarea</DialogTitle>
                        <DialogDescription>
                          Por favor indica el motivo del rechazo
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Motivo del rechazo..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                          Confirmar Rechazo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {task.status === 'verificada' && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Tarea Verificada</span>
                </div>
              )}

              {task.status === 'cerrada' && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-4 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Tarea Cerrada</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
