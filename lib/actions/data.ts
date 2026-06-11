'use server'

import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import {
  mapCalendarEvent,
  mapNotification,
  mapProfile,
  mapSchool,
  mapTask,
  mapTaskComment,
  mapTeam,
} from '@/lib/supabase/mappers'
import {
  mockCalendarEvents,
  mockNotifications,
  mockSchools,
  mockTasks,
  mockTeams,
  mockUsers,
} from '@/lib/mock-data'
import type {
  CalendarEvent,
  Notification,
  School,
  Task,
  Team,
  User,
} from '@/lib/types'

export type AppData = {
  source: 'supabase' | 'mock'
  users: User[]
  schools: School[]
  teams: Team[]
  tasks: Task[]
  notifications: Notification[]
  calendarEvents: CalendarEvent[]
}

export async function fetchAppData(): Promise<AppData> {
  if (!isSupabaseConfigured()) {
    return {
      source: 'mock',
      users: mockUsers,
      schools: mockSchools,
      teams: mockTeams,
      tasks: mockTasks,
      notifications: mockNotifications,
      calendarEvents: mockCalendarEvents,
    }
  }

  try {
    const supabase = await createClient()

    const [
      profilesRes,
      schoolsRes,
      teamsRes,
      teamMembersRes,
      tasksRes,
      commentsRes,
      notificationsRes,
      eventsRes,
      attendeesRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').order('name'),
      supabase.from('schools').select('*').order('name'),
      supabase.from('teams').select('*').order('name'),
      supabase.from('team_members').select('team_id, profile_id'),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('task_comments').select('*').order('created_at'),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('calendar_events').select('*').order('date'),
      supabase.from('calendar_event_attendees').select('event_id, profile_id'),
    ])

    const firstError =
      profilesRes.error ??
      schoolsRes.error ??
      teamsRes.error ??
      teamMembersRes.error ??
      tasksRes.error ??
      commentsRes.error ??
      notificationsRes.error ??
      eventsRes.error ??
      attendeesRes.error

    if (firstError) throw firstError

    const users = (profilesRes.data ?? []).map(mapProfile)
    const userNameById = new Map(users.map((u) => [u.id, u.name]))
    const schoolNameById = new Map(
      (schoolsRes.data ?? []).map((s) => [s.id, s.name])
    )

    const membersByTeam = new Map<string, string[]>()
    for (const row of teamMembersRes.data ?? []) {
      const list = membersByTeam.get(row.team_id) ?? []
      list.push(row.profile_id)
      membersByTeam.set(row.team_id, list)
    }

    const commentsByTask = new Map<string, ReturnType<typeof mapTaskComment>[]>()
    for (const row of commentsRes.data ?? []) {
      const list = commentsByTask.get(row.task_id) ?? []
      list.push(mapTaskComment(row, userNameById.get(row.user_id) ?? 'Usuario'))
      commentsByTask.set(row.task_id, list)
    }

    const attendeesByEvent = new Map<string, string[]>()
    for (const row of attendeesRes.data ?? []) {
      const list = attendeesByEvent.get(row.event_id) ?? []
      list.push(row.profile_id)
      attendeesByEvent.set(row.event_id, list)
    }

    return {
      source: 'supabase',
      users,
      schools: (schoolsRes.data ?? []).map(mapSchool),
      teams: (teamsRes.data ?? []).map((t) =>
        mapTeam(t, membersByTeam.get(t.id) ?? [])
      ),
      tasks: (tasksRes.data ?? []).map((t) =>
        mapTask(
          t,
          schoolNameById.get(t.school_id) ?? '',
          userNameById.get(t.created_by) ?? '',
          t.assigned_to ? userNameById.get(t.assigned_to) : undefined,
          commentsByTask.get(t.id) ?? []
        )
      ),
      notifications: (notificationsRes.data ?? []).map(mapNotification),
      calendarEvents: (eventsRes.data ?? []).map((e) =>
        mapCalendarEvent(e, attendeesByEvent.get(e.id) ?? [])
      ),
    }
  } catch (error) {
    console.error('[fetchAppData] Supabase falló, usando mock:', error)
    return {
      source: 'mock',
      users: mockUsers,
      schools: mockSchools,
      teams: mockTeams,
      tasks: mockTasks,
      notifications: mockNotifications,
      calendarEvents: mockCalendarEvents,
    }
  }
}

export async function getProfileById(userId: string): Promise<User | null> {
  const data = await fetchAppData()
  return data.users.find((u) => u.id === userId) ?? null
}
