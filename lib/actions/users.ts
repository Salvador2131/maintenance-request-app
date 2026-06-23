'use server'

import { isSupabaseConfigured } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import { mapProfile } from '@/lib/supabase/mappers'
import { mockUsers } from '@/lib/mock-data'
import type { User } from '@/lib/types'
import { actionError, actionOk, type ActionResult } from './types'

export async function getUsersForLogin(): Promise<ActionResult<User[]>> {
  if (!isSupabaseConfigured()) {
    return actionOk(mockUsers)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select('*').order('name')

    if (error) return actionError(error.message)
    return actionOk((data ?? []).map(mapProfile))
  } catch (e) {
    return actionError(e instanceof Error ? e.message : 'Error al cargar usuarios')
  }
}
