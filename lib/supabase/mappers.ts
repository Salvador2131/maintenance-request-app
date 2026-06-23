import type {
  DbCalendarEvent,
  DbNotification,
  DbProfile,
  DbSchool,
  DbTask,
  DbTaskComment,
  DbTeam,
} from '@/lib/database.types'
import type {
  CalendarEvent,
  Notification,
  School,
  Task,
  TaskComment,
  TaskPriority,
  TaskStatus,
  TaskType,
  Team,
  User,
  UserRole,
} from '@/lib/types'

export function mapProfile(row: DbProfile): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    schoolId: row.school_id ?? undefined,
    teamId: row.team_id ?? undefined,
    specialty: row.specialty ?? undefined,
    avatar: row.avatar_url ?? undefined,
  }
}

export function mapSchool(row: DbSchool): School {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    city: row.city,
    directorId: row.director_id ?? '',
  }
}

export function mapTeam(row: DbTeam, memberIds: string[]): Team {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty as TaskType,
    adminId: row.admin_id ?? undefined,
    memberIds,
  }
}

export function mapTaskComment(row: DbTaskComment, userName: string): TaskComment {
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    userName,
    content: row.content,
    createdAt: new Date(row.created_at),
  }
}

export function mapTask(
  row: DbTask,
  schoolName: string,
  createdByName: string,
  assignedToName?: string,
  comments: TaskComment[] = []
): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type as TaskType,
    priority: row.priority as TaskPriority,
    status: row.status as TaskStatus,
    schoolId: row.school_id,
    schoolName,
    location: row.location,
    createdBy: row.created_by,
    createdByName,
    assignedTo: row.assigned_to ?? undefined,
    assignedToName,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    verifiedAt: row.verified_at ? new Date(row.verified_at) : undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    comments,
  }
}

export function mapNotification(row: DbNotification): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type as Notification['type'],
    read: row.read,
    createdAt: new Date(row.created_at),
    taskId: row.task_id ?? undefined,
    link: row.link ?? undefined,
  }
}

export function mapCalendarEvent(row: DbCalendarEvent, attendees: string[] = []): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    type: row.type as CalendarEvent['type'],
    date: new Date(row.date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    schoolId: row.school_id ?? undefined,
    taskId: row.task_id ?? undefined,
    attendees,
  }
}
