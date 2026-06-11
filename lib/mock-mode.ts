import { isSupabaseConfigured } from '@/lib/env'

/** Modo demo local sin Supabase — ideal para pantallazos y desarrollo UI. */
export function isMockMode(): boolean {
  return !isSupabaseConfigured()
}

/** Usuario por defecto en mock (contralor = ve todas las pestañas del sidebar). */
export const MOCK_DEFAULT_USER_ID = 'user-1'
