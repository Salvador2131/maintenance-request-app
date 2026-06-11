'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const PLACEHOLDER_AVATAR = '/placeholder-user.jpg'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

type UserAvatarProps = {
  name: string
  avatarUrl?: string | null
  className?: string
  fallbackClassName?: string
  size?: 'default' | 'sm' | 'lg'
}

export function UserAvatar({
  name,
  avatarUrl,
  className,
  fallbackClassName,
  size = 'default',
}: UserAvatarProps) {
  const src = avatarUrl && !avatarUrl.startsWith('/avatars/') ? avatarUrl : PLACEHOLDER_AVATAR

  return (
    <Avatar className={className} size={size}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={cn('bg-primary text-primary-foreground text-xs', fallbackClassName)}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
