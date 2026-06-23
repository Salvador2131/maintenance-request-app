'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsersForLogin } from '@/lib/actions/users'
import { useAppStore } from '@/lib/store'
import type { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Wrench, 
  Shield, 
  GraduationCap, 
  Hammer, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const roles = [
  {
    id: 'contralor',
    label: 'Contralor',
    icon: Shield,
    color: 'bg-primary',
    hoverColor: 'hover:bg-primary/90',
    textColor: 'text-primary-foreground',
    description: 'Supervisión total del sistema',
    features: ['Vista de todos los colegios', 'Gestión de equipos técnicos', 'Reportes completos', 'Asignación de tareas'],
    role: 'contralor' as const,
  },
  {
    id: 'director',
    label: 'Director',
    icon: GraduationCap,
    color: 'bg-accent',
    hoverColor: 'hover:bg-accent/90',
    textColor: 'text-accent-foreground',
    description: 'Gestión de su colegio',
    features: ['Crear solicitudes de mantenimiento', 'Verificar trabajos completados', 'Vista del calendario', 'Seguimiento de tareas'],
    role: 'director' as const,
  },
  {
    id: 'tecnico',
    label: 'Técnico',
    icon: Hammer,
    color: 'bg-chart-3',
    hoverColor: 'hover:bg-chart-3/90',
    textColor: 'text-foreground',
    description: 'Ejecución de mantenimiento',
    features: ['Ver tareas asignadas', 'Reportar avances', 'Marcar tareas completadas', 'Agregar comentarios'],
    role: 'tecnico' as const,
  },
  {
    id: 'admin_equipo',
    label: 'Admin de Equipo',
    icon: Users,
    color: 'bg-chart-4',
    hoverColor: 'hover:bg-chart-4/90',
    textColor: 'text-foreground',
    description: 'Administración de equipos',
    features: ['Gestión de técnicos', 'Reasignación de tareas', 'Estadísticas del equipo', 'Coordinación de trabajos'],
    role: 'admin_equipo' as const,
  },
]

const stats = [
  { label: 'Colegios', value: '3', icon: Building2 },
  { label: 'Tareas Activas', value: '10', icon: CheckCircle2 },
  { label: 'Equipos', value: '3', icon: Users },
  { label: 'Técnicos', value: '3', icon: Hammer },
]

export default function LoginPage() {
  const router = useRouter()
  const { setCurrentUser } = useAppStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsersForLogin().then((result) => {
      if (result.ok) setUsers(result.data)
      setLoading(false)
    })
  }, [])

  const handleRoleSelect = async (role: User['role']) => {
    const user = users.find((u) => u.role === role)
    if (!user) return

    await fetch('/api/demo-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })

    setCurrentUser(user)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center gap-3 rounded-2xl bg-card px-6 py-3 shadow-lg ring-1 ring-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                MantenPro
              </h1>
            </div>
            <h2 className="mt-4 text-balance text-xl font-medium text-foreground sm:text-2xl">
              Sistema de Gestión de Mantenimiento Escolar
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Administra eficientemente el mantenimiento de tu red de colegios. 
              Crea solicitudes, asigna tareas y da seguimiento en tiempo real.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
              >
                <stat.icon className="mb-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Modo Demo
          </Badge>
          <h3 className="text-xl font-semibold text-foreground">
            Selecciona un rol para explorar
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Haz clic en cualquier rol para ver el sistema desde esa perspectiva
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const user = users.find((u) => u.role === role.role)
            return (
              <Card
                key={role.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.color}`}>
                      <role.icon className={`h-6 w-6 ${role.textColor}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                  <CardTitle className="text-lg">{role.label}</CardTitle>
                  <CardDescription className="text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="mb-4 space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleRoleSelect(role.role)}
                    disabled={loading || !user}
                    className={`w-full ${role.color} ${role.hoverColor} ${role.textColor}`}
                  >
                    Entrar como {role.label}
                  </Button>
                  {user && (
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {user.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Gestión Integral</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Administra todas las solicitudes de mantenimiento desde un solo lugar
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold text-foreground">Reportes Detallados</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Visualiza estadísticas y métricas de rendimiento en tiempo real
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground">Colaboración</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Coordina equipos técnicos y directores de manera eficiente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            Modo demo — selecciona un perfil para explorar el sistema con datos de Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
