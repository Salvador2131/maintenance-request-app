'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { createTask } from '@/lib/actions/tasks'
import { isActionFailure } from '@/lib/actions/types'
import { TaskType, TaskPriority, Task } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const typeLabels: Record<TaskType, string> = {
  electrico: 'Eléctrico',
  informatico: 'Informático',
  fontaneria: 'Fontanería',
  climatizacion: 'Climatización',
  general: 'General',
}

const priorityLabels: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
}

export function NewTaskForm() {
  const router = useRouter()
  const { currentUser, schools, addTask, addNotification, dataSource } = useAppStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as TaskType | '',
    priority: '' as TaskPriority | '',
    schoolId: currentUser?.schoolId || '',
    location: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.title || !formData.description || !formData.type || !formData.priority || !formData.schoolId || !formData.location) {
      toast.error('Por favor completa todos los campos requeridos')
      setIsSubmitting(false)
      return
    }

    const school = schools.find((s) => s.id === formData.schoolId)

    if (dataSource === 'supabase' && currentUser) {
      const result = await createTask({
        title: formData.title,
        description: formData.description,
        type: formData.type as TaskType,
        priority: formData.priority as TaskPriority,
        schoolId: formData.schoolId,
        location: formData.location,
        createdBy: currentUser.id,
        createdByName: currentUser.name,
      })

      if (isActionFailure(result)) {
        toast.error(result.error)
        setIsSubmitting(false)
        return
      }

      addTask(result.data)
      toast.success('Tarea creada exitosamente')
      router.refresh()
      router.push('/tareas')
      setIsSubmitting(false)
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type as TaskType,
      priority: formData.priority as TaskPriority,
      status: 'pendiente',
      schoolId: formData.schoolId,
      schoolName: school?.name || '',
      location: formData.location,
      createdBy: currentUser?.id || '',
      createdByName: currentUser?.name || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    }

    addTask(newTask)

    // Add notification for contralor
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user-1', // Contralor
      title: 'Nueva tarea creada',
      message: `${newTask.title} - ${school?.name}`,
      type: 'tarea_creada',
      read: false,
      createdAt: new Date(),
      taskId: newTask.id,
    })

    toast.success('Tarea creada exitosamente')
    router.push('/tareas')
    setIsSubmitting(false)
  }

  const availableSchools = currentUser?.role === 'director'
    ? schools.filter((s) => s.id === currentUser.schoolId)
    : schools

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tareas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Tarea</h1>
          <p className="text-muted-foreground">Crea una nueva solicitud de mantenimiento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Tarea</CardTitle>
          <CardDescription>
            Completa los detalles de la solicitud de mantenimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ej: Reparación de luces en aula 101"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe el problema con detalle..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school">Colegio *</Label>
                <Select
                  value={formData.schoolId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, schoolId: value ?? '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un colegio" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSchools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  placeholder="Ej: Aula 101, Edificio A"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Trabajo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: (value ?? '') as TaskType | '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: (value ?? '') as TaskPriority | '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/tareas">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Tarea'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
