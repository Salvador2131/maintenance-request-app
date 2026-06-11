import type { CalendarEvent, Task, Team, User } from '@/lib/types'

export function getTeamMemberIds(user: User, teams: Team[]): Set<string> {
  const adminTeams = teams.filter((t) => t.adminId === user.id)
  const memberTeams = teams.filter((t) => user.teamId && t.id === user.teamId)
  const relevantTeams = user.role === 'admin_equipo' ? adminTeams : memberTeams

  return new Set(relevantTeams.flatMap((t) => t.memberIds))
}

export function filterTasksByRole(tasks: Task[], user: User | null, teams: Team[]): Task[] {
  if (!user) return []

  if (user.role === 'contralor') return tasks
  if (user.role === 'director') return tasks.filter((t) => t.schoolId === user.schoolId)
  if (user.role === 'tecnico') return tasks.filter((t) => t.assignedTo === user.id)

  if (user.role === 'admin_equipo') {
    const memberIds = getTeamMemberIds(user, teams)
    return tasks.filter((t) => t.assignedTo && memberIds.has(t.assignedTo))
  }

  return []
}

export function filterCalendarEventsByRole(
  events: CalendarEvent[],
  user: User | null
): CalendarEvent[] {
  if (!user) return []

  if (user.role === 'contralor') return events

  if (user.role === 'director') {
    return events.filter(
      (e) =>
        e.schoolId === user.schoolId ||
        e.attendees?.includes(user.id) ||
        e.type === 'reporte'
    )
  }

  if (user.role === 'tecnico') {
    return events.filter(
      (e) => e.type === 'mantenimiento' || e.attendees?.includes(user.id)
    )
  }

  if (user.role === 'admin_equipo') {
    return events.filter(
      (e) =>
        e.type === 'mantenimiento' ||
        e.type === 'reunion' ||
        e.attendees?.includes(user.id)
    )
  }

  return events
}
