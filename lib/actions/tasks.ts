'use server'

import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import { mapTask, mapTaskComment } from '@/lib/supabase/mappers'
import type { DbTask } from '@/lib/database.types'
import type { Task, TaskComment, TaskPriority, TaskStatus, TaskType } from '@/lib/types'
import { actionError, actionOk, type ActionResult } from './types'
import { createNotification, notifyContralors } from './notifications'

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

function revalidateTaskPaths(taskId?: string) {
  revalidatePath('/dashboard')
  revalidatePath('/tareas')
  revalidatePath('/calendario')
  revalidatePath('/reportes')
  revalidatePath('/colegios')
  revalidatePath('/equipos')
  if (taskId) revalidatePath(`/tareas/${taskId}`)
}

async function loadTaskContext(taskId: string) {
  const supabase = await createClient()

  const { data: taskRow, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single()

  if (taskError || !taskRow) return null

  const [schoolRes, profilesRes, commentsRes] = await Promise.all([
    supabase.from('schools').select('name').eq('id', taskRow.school_id).single(),
    supabase.from('profiles').select('id, name'),
    supabase.from('task_comments').select('*').eq('task_id', taskId).order('created_at'),
  ])

  const userNameById = new Map((profilesRes.data ?? []).map((p) => [p.id, p.name]))
  const comments = (commentsRes.data ?? []).map((c) =>
    mapTaskComment(c, userNameById.get(c.user_id) ?? 'Usuario')
  )

  return mapTask(
    taskRow,
    schoolRes.data?.name ?? '',
    userNameById.get(taskRow.created_by) ?? '',
    taskRow.assigned_to ? userNameById.get(taskRow.assigned_to) : undefined,
    comments
  )
}

export type CreateTaskInput = {
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  schoolId: string
  location: string
  createdBy: string
  createdByName: string
}

export async function createTask(input: CreateTaskInput): Promise<ActionResult<Task>> {
  if (!isSupabaseConfigured()) {
    return actionError('Supabase no configurado', true)
  }

  try {
    const supabase = await createClient()
    const now = new Date().toISOString()
    const taskId = newId('task')

    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', input.schoolId)
      .single()

    const row: DbTask = {
      id: taskId,
      title: input.title,
      description: input.description,
      type: input.type,
      priority: input.priority,
      status: 'pendiente',
      school_id: input.schoolId,
      location: input.location,
      created_by: input.createdBy,
      assigned_to: null,
      rejection_reason: null,
      created_at: now,
      updated_at: now,
      completed_at: null,
      verified_at: null,
    }

    const { error } = await supabase.from('tasks').insert(row)
    if (error) return actionError(error.message)

    await notifyContralors(
      'Nueva tarea creada',
      `${input.title} - ${school?.name ?? 'Colegio'}`,
      'tarea_creada',
      taskId
    )

    revalidateTaskPaths(taskId)
    const task = await loadTaskContext(taskId)
    if (!task) return actionError('Tarea creada pero no se pudo cargar')

    return actionOk(task)
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al crear tarea')
  }
}

export async function assignTaskAction(input: {
  taskId: string
  technicianId: string
  technicianName: string
  taskTitle: string
  schoolName: string
}): Promise<ActionResult<Task>> {
  if (!isSupabaseConfigured()) return actionError('Supabase no configurado', true)

  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('tasks')
      .update({
        assigned_to: input.technicianId,
        status: 'asignada',
        updated_at: now,
      })
      .eq('id', input.taskId)

    if (error) return actionError(error.message)

    await createNotification({
      userId: input.technicianId,
      title: 'Nueva tarea asignada',
      message: `${input.taskTitle} - ${input.schoolName}`,
      type: 'tarea_asignada',
      taskId: input.taskId,
      link: `/tareas/${input.taskId}`,
    })

    revalidateTaskPaths(input.taskId)
    const task = await loadTaskContext(input.taskId)
    if (!task) return actionError('Tarea actualizada pero no se pudo cargar')

    return actionOk(task)
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al asignar tarea')
  }
}

export async function updateTaskStatusAction(input: {
  taskId: string
  status: TaskStatus
  rejectionReason?: string
  taskTitle?: string
  schoolId?: string
  assignedToId?: string
}): Promise<ActionResult<Task>> {
  if (!isSupabaseConfigured()) return actionError('Supabase no configurado', true)

  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const updates: Partial<DbTask> = {
      status: input.status,
      updated_at: now,
    }

    if (input.status === 'completada') updates.completed_at = now
    if (input.status === 'verificada') updates.verified_at = now
    if (input.status === 'rechazada') {
      updates.rejection_reason = input.rejectionReason ?? null
    }

    const { error } = await supabase.from('tasks').update(updates).eq('id', input.taskId)
    if (error) return actionError(error.message)

    if (input.status === 'completada' && input.schoolId && input.taskTitle) {
      const { data: director } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'director')
        .eq('school_id', input.schoolId)
        .maybeSingle()

      if (director) {
        await createNotification({
          userId: director.id,
          title: 'Tarea completada',
          message: `${input.taskTitle} está lista para verificación`,
          type: 'tarea_completada',
          taskId: input.taskId,
          link: `/tareas/${input.taskId}`,
        })
      }
    }

    if (input.status === 'verificada' && input.assignedToId && input.taskTitle) {
      await createNotification({
        userId: input.assignedToId,
        title: 'Tarea verificada',
        message: `${input.taskTitle} ha sido verificada`,
        type: 'tarea_verificada',
        taskId: input.taskId,
        link: `/tareas/${input.taskId}`,
      })
    }

    if (input.status === 'rechazada' && input.assignedToId && input.taskTitle) {
      await createNotification({
        userId: input.assignedToId,
        title: 'Tarea rechazada',
        message: `${input.taskTitle} - ${input.rejectionReason ?? ''}`,
        type: 'tarea_rechazada',
        taskId: input.taskId,
        link: `/tareas/${input.taskId}`,
      })
    }

    revalidateTaskPaths(input.taskId)
    const task = await loadTaskContext(input.taskId)
    if (!task) return actionError('Estado actualizado pero no se pudo cargar la tarea')

    return actionOk(task)
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al actualizar estado')
  }
}

export async function addTaskCommentAction(input: {
  taskId: string
  userId: string
  userName: string
  content: string
}): Promise<ActionResult<TaskComment>> {
  if (!isSupabaseConfigured()) return actionError('Supabase no configurado', true)

  try {
    const supabase = await createClient()
    const now = new Date().toISOString()
    const commentId = newId('comment')

    const { error: commentError } = await supabase.from('task_comments').insert({
      id: commentId,
      task_id: input.taskId,
      user_id: input.userId,
      content: input.content,
      created_at: now,
    })

    if (commentError) return actionError(commentError.message)

    await supabase
      .from('tasks')
      .update({ updated_at: now })
      .eq('id', input.taskId)

    revalidateTaskPaths(input.taskId)

    return actionOk({
      id: commentId,
      taskId: input.taskId,
      userId: input.userId,
      userName: input.userName,
      content: input.content,
      createdAt: new Date(now),
    })
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al agregar comentario')
  }
}
