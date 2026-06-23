'use server'

import { createClient } from '@/lib/supabase/server'
import { mapNotification } from '@/lib/supabase/mappers'
import type { DbNotification } from '@/lib/database.types'
import type { Notification } from '@/lib/types'
import { actionError, actionOk, type ActionResult } from './types'

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

type CreateNotificationInput = {
  userId: string
  title: string
  message: string
  type: Notification['type']
  taskId?: string
  link?: string
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<ActionResult<Notification>> {
  try {
    const supabase = await createClient()
    const row: DbNotification = {
      id: newId('notif'),
      user_id: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      read: false,
      task_id: input.taskId ?? null,
      link: input.link ?? null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('notifications').insert(row)
    if (error) return actionError(error.message)

    return actionOk(mapNotification(row))
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al crear notificación')
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<ActionResult<Notification>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select('*')
      .single()

    if (error) return actionError(error.message)
    return actionOk(mapNotification(data))
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al marcar notificación')
  }
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<ActionResult<number>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select('id')

    if (error) return actionError(error.message)
    return actionOk(data?.length ?? 0)
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al marcar notificaciones')
  }
}

export async function notifyContralors(
  title: string,
  message: string,
  type: Notification['type'],
  taskId?: string
): Promise<ActionResult<Notification[]>> {
  try {
    const supabase = await createClient()
    const { data: contralors, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'contralor')

    if (profilesError) return actionError(profilesError.message)
    if (!contralors?.length) return actionOk([])

    const notifications: Notification[] = []
    for (const profile of contralors) {
      const result = await createNotification({
        userId: profile.id,
        title,
        message,
        type,
        taskId,
        link: taskId ? `/tareas/${taskId}` : undefined,
      })
      if (result.ok) notifications.push(result.data)
    }

    return actionOk(notifications)
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al notificar contralores')
  }
}
