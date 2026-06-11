import { cookies } from 'next/headers'
import { AppLayout } from '@/components/layout/app-layout'
import { AppHydration } from '@/components/providers/app-hydration'
import { fetchAppData } from '@/lib/actions/data'
import { DEMO_USER_COOKIE } from '@/lib/demo-session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const demoUserId = cookieStore.get(DEMO_USER_COOKIE)?.value ?? null
  const initialData = await fetchAppData()

  return (
    <>
      <AppHydration initialData={initialData} demoUserId={demoUserId} />
      <AppLayout>{children}</AppLayout>
    </>
  )
}
