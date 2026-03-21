'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Shirt, ShoppingBag, Settings } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const CHILD_NAV = [
  { href: '/child', icon: Home, label: 'ホーム' },
  { href: '/child/tasks', icon: CheckSquare, label: 'タスク' },
  { href: '/child/avatar', icon: Shirt, label: 'アバター' },
  { href: '/child/shop', icon: ShoppingBag, label: 'ショップ' },
]

const PARENT_NAV = [
  { href: '/parent', icon: Home, label: 'ホーム' },
  { href: '/parent/tasks', icon: CheckSquare, label: 'タスク管理' },
  { href: '/parent/family', icon: Settings, label: '家族設定' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { currentProfile } = useStore()
  const navItems = currentProfile?.role === 'parent' ? PARENT_NAV : CHILD_NAV

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-3 px-2 transition-all duration-200',
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-purple-400'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-xl transition-all duration-200',
                  isActive ? 'bg-purple-100' : ''
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'font-bold' : ''
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
