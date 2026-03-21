'use client'

import NiceAvatar, { genConfig } from 'react-nice-avatar'
import type { AvatarConfig } from '@/types'

interface FamiaAvatarProps {
  config: AvatarConfig
  size?: number
  className?: string
}

export default function FamiaAvatar({ config, size = 80, className = '' }: FamiaAvatarProps) {
  const avatarConfig = genConfig(config as Parameters<typeof genConfig>[0])
  return (
    <NiceAvatar
      style={{ width: size, height: size }}
      className={className}
      {...avatarConfig}
    />
  )
}
