'use client'

import { useAppStore } from '@/lib/store'
import { TaskType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/user-avatar'
import { Users, Wrench, ClipboardList } from 'lucide-react'

const specialtyLabels: Record<TaskType, string> = {
  electrico: 'Eléctrico',
  informatico: 'Informático',
  fontaneria: 'Fontanería',
  climatizacion: 'Climatización',
  general: 'General',
}

export default function EquiposPage() {
  const { teams, users, tasks } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Equipos de Soporte</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona los equipos técnicos y sus miembros
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const admin = team.adminId ? users.find((u) => u.id === team.adminId) : null
          const members = users.filter((u) => team.memberIds.includes(u.id))
          const teamTasks = tasks.filter((t) =>
            members.some((m) => t.assignedTo === m.id)
          )
          const activeTasks = teamTasks.filter(
            (t) => t.status === 'asignada' || t.status === 'en_progreso'
          )
          const completedTasks = teamTasks.filter((t) =>
            ['completada', 'verificada', 'cerrada'].includes(t.status)
          )

          return (
            <Card key={team.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {specialtyLabels[team.specialty]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {admin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Admin:</span>
                    <span className="font-medium">{admin.name}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Miembros ({members.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 rounded-full bg-accent px-3 py-1"
                      >
                        <UserAvatar name={member.name} avatarUrl={member.avatar} className="h-6 w-6" />
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tareas:</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                      {activeTasks.length} activas
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      {completedTasks.length} completadas
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
