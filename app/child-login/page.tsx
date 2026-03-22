'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import PicturePassword from '@/components/PicturePassword'

function ChildLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('childId')
  const { state, dispatch } = useStore()
  const [error, setError] = useState('')

  const child = state.profiles.find(p => p.id === childId)

  const handlePassword = (sequence: string[]) => {
    if (!child) return
    const correct = child.picturePassword
    if (!correct) return

    const isMatch = sequence.length === correct.length &&
      sequence.every((s, i) => s === correct[i])

    if (isMatch) {
      dispatch({ type: 'LOGIN', payload: { userId: child.id, familyId: child.familyId } })
      router.replace('/child')
    } else {
      setError('ちがうよ！もう一度やってみて')
      setTimeout(() => setError(''), 2000)
    }
  }

  if (!child) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500">こどもが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-yellow-100 to-orange-50 flex flex-col px-6 py-8">
      <Link href="/child-select" className="flex items-center gap-2 text-gray-500 mb-8 w-fit">
        <ArrowLeft size={20} />
        <span className="font-medium">もどる</span>
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Child avatar */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-lg border-4 border-orange-200">
              <FamiaAvatar config={child.avatarConfig} size={80} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">{child.name}ちゃん</h2>
          <p className="text-gray-500 mb-8 text-sm">パスワードをえらんでね</p>

          {/* Picture password */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <PicturePassword
              onComplete={handlePassword}
              label="じゅんばんにえらんでね"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mt-4 bg-red-100 text-red-600 rounded-2xl px-4 py-3 font-bold"
            >
              ❌ {error}
            </motion.div>
          )}

          {/* Demo hint */}
          <p className="mt-4 text-xs text-orange-300 font-bold">
            🎮 デモ：🐱 → 🐰 → 🐻 のじゅんばんで！
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function ChildLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center">読み込み中...</div>}>
      <ChildLoginContent />
    </Suspense>
  )
}
