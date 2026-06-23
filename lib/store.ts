'use client'

import { create } from 'zustand'
import { User, Task, Notification, CalendarEvent, TaskStatus, TaskComment, School, Team } from './types'
import type { AppData } from '@/lib/actions/data'

interface AppState {
  // Auth
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  switchRole: (userId: string) => void

  // Data
  users: User[]
  schools: School[]
  teams: Team[]
  dataSource: 'supabase' | 'mock' | null
  hydrate: (data: AppData, demoUserId: string | null) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Task) => void
  replaceTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  updateTaskStatus: (taskId: string, status: TaskStatus, comment?: string) => void
  assignTask: (taskId: string, userId: string, userName: string) => void
  addTaskComment: (taskId: string, comment: TaskComment) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void

  // Calendar
  calendarEvents: CalendarEvent[]
  addCalendarEvent: (event: CalendarEvent) => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth — se hidrata desde cookie + Supabase/mock
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  switchRole: (userId) => {
    const user = get().users.find((u) => u.id === userId)
    if (user) set({ currentUser: user })
  },

  users: [],
  schools: [],
  teams: [],
  dataSource: null,
  hydrate: (data, demoUserId) => {
    const currentUser = demoUserId
      ? data.users.find((u) => u.id === demoUserId) ?? null
      : null
    set({
      users: data.users,
      schools: data.schools,
      teams: data.teams,
      tasks: data.tasks,
      notifications: data.notifications,
      calendarEvents: data.calendarEvents,
      dataSource: data.source,
      currentUser,
    })
  },

  // Tasks
  tasks: [],
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),
  replaceTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    })),
  updateTaskStatus: (taskId, status, comment) =>
    set((state) => {
      const now = new Date()
      return {
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task
          const updates: Partial<Task> = { status, updatedAt: now }
          if (status === 'completada') updates.completedAt = now
          if (status === 'verificada') updates.verifiedAt = now
          if (status === 'rechazada' && comment) updates.rejectionReason = comment
          return { ...task, ...updates }
        }),
      }
    }),
  assignTask: (taskId, userId, userName) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: userId, assignedToName: userName, status: 'asignada', updatedAt: new Date() }
          : task
      ),
    })),
  addTaskComment: (taskId, comment) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, comments: [...task.comments, comment], updatedAt: new Date() } : task
      ),
    })),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    })),
  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
    })),

  // Calendar
  calendarEvents: [],
  addCalendarEvent: (event) =>
    set((state) => ({
      calendarEvents: [...state.calendarEvents, event],
    })),

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

// Selectors
export const useCurrentUser = () => useAppStore((state) => state.currentUser)
export const useTasks = () => useAppStore((state) => state.tasks)
export const useNotifications = () => useAppStore((state) => state.notifications)
export const useCalendarEvents = () => useAppStore((state) => state.calendarEvents)
