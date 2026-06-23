export type NotificationPreferences = {
  email: boolean
  push: boolean
  taskCreated: boolean
  taskAssigned: boolean
  taskCompleted: boolean
  taskVerified: boolean
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: true,
  push: true,
  taskCreated: true,
  taskAssigned: true,
  taskCompleted: true,
  taskVerified: true,
}

function storageKey(userId: string): string {
  return `mantenpro_prefs_${userId}`
}

export function loadNotificationPreferences(userId: string): NotificationPreferences {
  if (typeof window === 'undefined') return defaultNotificationPreferences

  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return defaultNotificationPreferences
    return { ...defaultNotificationPreferences, ...JSON.parse(raw) }
  } catch {
    return defaultNotificationPreferences
  }
}

export function saveNotificationPreferences(
  userId: string,
  prefs: NotificationPreferences
): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(userId), JSON.stringify(prefs))
}
