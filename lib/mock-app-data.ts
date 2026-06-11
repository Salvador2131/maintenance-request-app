import {
  mockCalendarEvents,
  mockNotifications,
  mockSchools,
  mockTasks,
  mockTeams,
  mockUsers,
} from '@/lib/mock-data'
import type { AppData } from '@/lib/actions/data'

/** Datos mock listos para el cliente (Date objects nativos). */
export function getMockAppData(): AppData {
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
