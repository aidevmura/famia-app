import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday } from 'date-fns'
import { ja } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return '今日'
  if (isYesterday(d)) return '昨日'
  return format(d, 'M月d日(E)', { locale: ja })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function hashPassword(password: string): string {
  // Very simple "hash" for prototype - in production use bcrypt
  return btoa(password)
}

export function checkPassword(password: string, hash: string): boolean {
  return btoa(password) === hash
}

export const PICTURE_PASSWORD_EMOJIS = [
  '🐱', '🐶', '🐰', '🐻', '🦊', '🐸', '🐧', '🦁', '🐨',
]

export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getDayOfWeekLabel(dayIndex: number): string {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[dayIndex]
}

export function getWeekdayStreak(completions: { completedDate: string; taskId: string }[], taskId: string): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    if (completions.some(c => c.taskId === taskId && c.completedDate === dateStr)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export const CATEGORY_LABELS = {
  chore: { label: 'おてつだい', emoji: '🧹', color: 'bg-orange-100 text-orange-700' },
  habit: { label: 'しゅうかん', emoji: '⭐', color: 'bg-yellow-100 text-yellow-700' },
  routine: { label: 'ルーティン', emoji: '📅', color: 'bg-blue-100 text-blue-700' },
}

export const FREQUENCY_LABELS = {
  daily: '毎日',
  weekday: '平日',
  weekend: '週末',
  weekly: '毎週',
}
