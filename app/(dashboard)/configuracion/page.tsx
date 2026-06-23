'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import {
  defaultNotificationPreferences,
  loadNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from '@/lib/preferences'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Bell, Mail, User, Shield, Palette } from 'lucide-react'

export default function ConfiguracionPage() {
  const { currentUser } = useAppStore()
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  )

  useEffect(() => {
    if (currentUser?.id) {
      setNotifications(loadNotificationPreferences(currentUser.id))
    }
  }, [currentUser?.id])

  const handleSave = () => {
    if (!currentUser?.id) {
      toast.error('No hay usuario activo')
      return
    }
    saveNotificationPreferences(currentUser.id, notifications)
    toast.success('Configuración guardada exitosamente')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Configuración</h1>
        <p className="mt-1 text-muted-foreground">
          Administra tu perfil y preferencias del sistema
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil
          </CardTitle>
          <CardDescription>Información de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue={currentUser?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={currentUser?.email} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Input
              id="role"
              defaultValue={
                currentUser?.role === 'contralor'
                  ? 'Contralor / Superadmin'
                  : currentUser?.role === 'director'
                    ? 'Director de Colegio'
                    : currentUser?.role === 'tecnico'
                      ? 'Técnico de Soporte'
                      : 'Administrador de Equipo'
              }
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Configura cómo recibir notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Canales de notificación</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Notificaciones por email</span>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Notificaciones push</span>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tipos de notificación</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cuando se crea una nueva tarea</span>
              <Switch
                checked={notifications.taskCreated}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, taskCreated: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cuando se te asigna una tarea</span>
              <Switch
                checked={notifications.taskAssigned}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, taskAssigned: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cuando se completa una tarea</span>
              <Switch
                checked={notifications.taskCompleted}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, taskCompleted: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cuando se verifica una tarea</span>
              <Switch
                checked={notifications.taskVerified}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, taskVerified: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>Opciones de seguridad de la cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input id="current-password" type="password" placeholder="********" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input id="new-password" type="password" placeholder="********" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input id="confirm-password" type="password" placeholder="********" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </div>
  )
}
