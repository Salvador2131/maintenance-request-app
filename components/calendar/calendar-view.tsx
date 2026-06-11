'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { filterCalendarEventsByRole, filterTasksByRole } from '@/lib/role-filters'
import { CalendarEvent } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react'

const eventTypeConfig: Record<string, { label: string; className: string }> = {
  tarea: { label: 'Tarea', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  reunion: { label: 'Reunión', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  mantenimiento: { label: 'Mantenimiento', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  reporte: { label: 'Reporte', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
}

export function CalendarView() {
  const { currentUser, calendarEvents, tasks, teams } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredEvents = useMemo(() => {
    if (!currentUser) return []

    const roleTasks = filterTasksByRole(tasks, currentUser, teams)
    const events = filterCalendarEventsByRole(calendarEvents, currentUser)

    const taskEvents: CalendarEvent[] = roleTasks
      .filter((task) => !['cerrada', 'verificada'].includes(task.status))
      .map((task) => ({
        id: `task-event-${task.id}`,
        title: task.title,
        description: task.description,
        type: 'tarea' as const,
        date: task.createdAt,
        schoolId: task.schoolId,
        taskId: task.id,
      }))

    return [...events, ...taskEvents]
  }, [calendarEvents, tasks, currentUser, teams])

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    return filteredEvents.filter((event) => isSameDay(event.date, selectedDate))
  }, [filteredEvents, selectedDate])

  const daysWithEvents = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)

    return filteredEvents
      .filter((event) => event.date >= start && event.date <= end)
      .reduce(
        (acc, event) => {
          const dateKey = format(event.date, 'yyyy-MM-dd')
          if (!acc[dateKey]) acc[dateKey] = []
          acc[dateKey].push(event)
          return acc
        },
        {} as Record<string, CalendarEvent[]>
      )
  }, [filteredEvents, currentDate])

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Calendario</h1>
          <p className="mt-1 text-muted-foreground">
            Visualiza tareas, reuniones y mantenimientos programados
          </p>
        </div>
        <Button variant="outline" onClick={goToToday}>
          Hoy
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentDate}
              onMonthChange={setCurrentDate}
              locale={es}
              className="w-full"
              modifiers={{
                hasEvents: (date) => {
                  const dateKey = format(date, 'yyyy-MM-dd')
                  return !!daysWithEvents[dateKey]
                },
              }}
              modifiersClassNames={{
                hasEvents: 'bg-primary/10 font-semibold',
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'Selecciona una fecha'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No hay eventos para esta fecha
              </p>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <Badge variant="outline" className={eventTypeConfig[event.type].className}>
                        {eventTypeConfig[event.type].label}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {event.endDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(event.date, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                        </span>
                      )}
                      {event.attendees && event.attendees.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees.length} asistentes
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Object.entries(eventTypeConfig).map(([key, { label, className }]) => (
              <div key={key} className="flex items-center gap-2">
                <Badge variant="outline" className={className}>
                  {label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
