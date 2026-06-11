'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, ClipboardList, MapPin } from 'lucide-react'

export default function ColegiosPage() {
  const { schools, users, tasks } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Colegios</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona la red de colegios y sus equipos
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => {
          const director = users.find((u) => u.id === school.directorId)
          const schoolTasks = tasks.filter((t) => t.schoolId === school.id)
          const pendingTasks = schoolTasks.filter(
            (t) => t.status === 'pendiente' || t.status === 'asignada'
          )
          const inProgressTasks = schoolTasks.filter((t) => t.status === 'en_progreso')

          return (
            <Card key={school.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{school.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{school.city}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{school.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Director:</span>
                  <span className="font-medium">{director?.name}</span>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tareas:</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-slate-500/10 text-slate-500">
                      {pendingTasks.length} pendientes
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                      {inProgressTasks.length} en progreso
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
