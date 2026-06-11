export type UserRole = 'contralor' | 'director' | 'tecnico' | 'admin_equipo'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  schoolId?: string
  teamId?: string
  specialty?: string
}

export interface School {
  id: string
  name: string
  address: string
  city: string
  directorId: string
}

export interface Team {
  id: string
  name: string
  specialty: TaskType
  adminId?: string
  memberIds: string[]
}

export type TaskType = 'electrico' | 'informatico' | 'fontaneria' | 'climatizacion' | 'general'
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente'
export type TaskStatus = 'pendiente' | 'asignada' | 'en_progreso' | 'completada' | 'verificada' | 'rechazada' | 'cerrada'

export interface TaskComment {
  id: string
  taskId: string
  userId: string
  userName: string
  content: string
  createdAt: Date
  attachments?: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  schoolId: string
  schoolName: string
  location: string
  createdBy: string
  createdByName: string
  assignedTo?: string
  assignedToName?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  verifiedAt?: Date
  attachments?: string[]
  comments: TaskComment[]
  rejectionReason?: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: 'tarea' | 'reunion' | 'mantenimiento' | 'reporte'
  date: Date
  endDate?: Date
  schoolId?: string
  taskId?: string
  attendees?: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'tarea_creada' | 'tarea_asignada' | 'tarea_completada' | 'tarea_verificada' | 'tarea_rechazada' | 'reunion'
  read: boolean
  createdAt: Date
  taskId?: string
  link?: string
}

export interface DashboardStats {
  totalTasks: number
  pendingTasks: number
  inProgressTasks: number
  completedTasks: number
  avgResolutionTime: number
  tasksByType: { type: TaskType; count: number }[]
  tasksByPriority: { priority: TaskPriority; count: number }[]
  recentTasks: Task[]
}
