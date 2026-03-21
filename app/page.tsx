'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useStore } from '@/lib/store'

export default function LandingPage() {
  const router = useRouter()
  const { currentProfile, currentFamily } = useStore()

  useEffect(() => {
    if (currentProfile && currentFamily) {
      if (currentProfile.role === 'parent') {
        router.replace('/parent')
      } else {
        router.replace('/child')
      }
    }
  }, [currentProfile, currentFamily, router])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 px-6 py-12">
      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐', '✨', '🌟', '💫', '⭐', '✨'].map((star, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-40"
            style={{
              left: `${10 + i * 15}%`,
              top: `${5 + (i % 3) * 15}%`,
            }}
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {star}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-sm w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="text-8xl mb-4 animate-float inline-block">🌈</div>
          <h1 className="text-5xl font-black gradient-text mb-2">ファミア</h1>
          <p className="text-gray-500 font-medium text-lg">
            かぞくで たのしく<br />いっしょに なりたい自分に！
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { emoji: '🧹', label: 'お手伝い' },
            { emoji: '⭐', label: 'ポイント' },
            { emoji: '👗', label: 'きせかえ' },
          ].map((item) => (
            <div key={item.label} className="bg-white/80 rounded-2xl p-3 shadow-sm">
              <div className="text-3xl mb-1">{item.emoji}</div>
              <p className="text-xs font-bold text-gray-600">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <Link
            href="/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 block"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="bg-white text-purple-600 font-bold text-base py-3.5 rounded-2xl shadow-sm border-2 border-purple-200 hover:bg-purple-50 transition-all active:scale-95 block"
          >
            はじめて？ かぞくをつくる
          </Link>

          {/* Demo hint */}
          <p className="text-xs text-gray-400 mt-2">
            🎮 デモモード：パパ（papa / papa123）または<br />
            きこ（ファミリーコード: KIKO01 → 🐱🐰🐻）
          </p>
        </motion.div>
      </div>
    </div>
  )
}
