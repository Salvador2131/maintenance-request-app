import { redirect } from 'next/navigation'

export default function Page() {
  // Sin Supabase = modo mock → ir directo al dashboard (contralor por defecto)
  const mockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  redirect(mockMode ? '/dashboard' : '/login')
}
