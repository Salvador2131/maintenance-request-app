import type { AppData } from '@/lib/actions/data'
import type { CalendarEvent, Notification, Task, TaskComment } from '@/lib/types'

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function reviveComment(comment: TaskComment): TaskComment {
  return { ...comment, createdAt: toDate(comment.createdAt) }
}

function reviveTask(task: Task): Task {
  return {
    ...task,
    createdAt: toDate(task.createdAt),
    updatedAt: toDate(task.updatedAt),
    completedAt: task.completedAt ? toDate(task.completedAt) : undefined,
    verifiedAt: task.verifiedAt ? toDate(task.verifiedAt) : undefined,
    comments: task.comments.map(reviveComment),
  }
}

function reviveNotification(notification: Notification): Notification {
  return { ...notification, createdAt: toDate(notification.createdAt) }
}

function reviveCalendarEvent(event: CalendarEvent): CalendarEvent {
  return {
    ...event,
    date: toDate(event.date),
    endDate: event.endDate ? toDate(event.endDate) : undefined,
  }
}

/** Restaura Date objects tras serialización servidor → cliente. */
export function reviveAppData(data: AppData): AppData {
  return {
    ...data,
    tasks: data.tasks.map(reviveTask),
    notifications: data.notifications.map(reviveNotification),
    calendarEvents: data.calendarEvents.map(reviveCalendarEvent),
  }
}
