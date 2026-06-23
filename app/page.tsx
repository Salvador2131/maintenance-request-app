import { redirect } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/env'

export default function Page() {
  // Sin Supabase = modo mock → ir directo al dashboard (contralor por defecto)
  redirect(isSupabaseConfigured() ? '/login' : '/dashboard')
}
