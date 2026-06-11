'use client'

import { useLayoutEffect } from 'react'
import { useAppStore } from '@/lib/store'
import type { AppData } from '@/lib/actions/data'
import { getMockAppData } from '@/lib/mock-app-data'
import { isMockMode, MOCK_DEFAULT_USER_ID } from '@/lib/mock-mode'
import { reviveAppData } from '@/lib/revive-app-data'

type Props = {
  initialData: AppData
  demoUserId: string | null
}

export function AppHydration({ initialData, demoUserId }: Props) {
  const hydrate = useAppStore((s) => s.hydrate)

  useLayoutEffect(() => {
    const data = isMockMode() ? getMockAppData() : reviveAppData(initialData)
    const userId =
      demoUserId ?? (isMockMode() ? MOCK_DEFAULT_USER_ID : null)
    hydrate(data, userId)
  }, [initialData, demoUserId, hydrate])

  return null
}
