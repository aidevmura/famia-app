'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Star, Zap, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import TaskCard from '@/components/TaskCard'
import CelebrationModal from '@/components/CelebrationModal'
import BottomNav from '@/components/BottomNav'
import TodayTaskPointsPanel from '@/components/TodayTaskPointsPanel'
import FamilyRulesManager from '@/components/FamilyRulesManager'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getTodayTaskPointsSummary } from '@/lib/utils'

export default function ChildHomePage() {
  const router = useRouter()
  const { currentProfile, currentFamily, state, dispatch, getTodayTasks, isTaskCompletedToday, completeTask, uncompleteTask } = useStore()
  const [celebration, setCelebration] = useState<{ points: number; message: string; selfInitiated: boolean } | null>(null)
  const [lastPoints, setLastPoints] = useState(0)

  useEffect(() => {
    if (!currentProfile) {
      router.replace('/')
    }
  }, [currentProfile, router])

  if (!currentProfile || currentProfile.role !== 'child') return null

  const todayTasks = getTodayTasks(currentProfile.id)
  const completedCount = todayTasks.filter(t => isTaskCompletedToday(t.id, currentProfile.id)).length
  const totalCount = todayTasks.length
  const todayDate = format(new Date(), 'M月d日(E)', { locale: ja })
  const pointsSummary = getTodayTaskPointsSummary(
    state,
    currentProfile.id,
    todayTasks,
    isTaskCompletedToday
  )

  const getMotivationMessage = () => {
    if (completedCount === 0) return 'きょうもがんばろう！🌟'
    if (completedCount < totalCount / 2) return 'いいスタート！✨'
    if (completedCount < totalCount) return 'もうすぐ全部できそう！🔥'
    return 'ぜんぶできた！すごい！🎉'
  }

  const handleComplete = (task: typeof todayTasks[0], selfInitiated: boolean) => {
    const prevPoints = currentProfile.pointsTotal
    completeTask(task, currentProfile.id, selfInitiated)
    const earned = selfInitiated ? task.pointsValue + 5 : task.pointsValue
    setCelebration({
      points: earned,
      message: selfInitiated ? 'ひとりでできた！すごい！' : 'よくがんばったね！',
      selfInitiated,
    })
    setLastPoints(earned)
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    router.replace('/')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 pt-safe-top pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-200 text-sm font-medium">{todayDate}</p>
              <h1 className="text-2xl font-black">{currentProfile.name}ちゃんの ホーム</h1>
            </div>
            <button onClick={handleLogout} className="text-purple-200 hover:text-white p-2">
              <LogOut size={20} />
            </button>
          </div>

          {/* Avatar + もってるポイント + きょうのタスクポイント */}
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-white/20 rounded-2xl p-2 flex-shrink-0"
            >
              <FamiaAvatar config={currentProfile.avatarConfig} size={72} />
            </motion.div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-yellow-400 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <Star size={16} className="text-yellow-900" fill="currentColor" />
                  <span className="font-black text-yellow-900 text-lg">{currentProfile.pointsTotal}pt</span>
                </div>
                <span className="text-purple-200 text-xs font-bold">もってる</span>
              </div>
              <TodayTaskPointsPanel summary={pointsSummary} variant="homeHeader" showCompletionBadge />
              <p className="text-white/90 font-bold text-sm">{getMotivationMessage()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5 space-y-5">
        {/* 家族のルールBOX（旧「きょうのタスク」カードの位置） */}
        {currentFamily && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 shadow-sm border-2 border-purple-100"
          >
            <FamilyRulesManager
              familyId={currentFamily.id}
              editorProfileId={currentProfile.id}
              theme="child"
            />
          </motion.div>
        )}

        {/* Today's tasks */}
        <div>
          <h2 className="font-black text-gray-700 text-base mb-3 px-1">📋 きょうやること</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {todayTasks.map((task, i) => {
                const isCompleted = isTaskCompletedToday(task.id, currentProfile.id)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <TaskCard
                      task={task}
                      isCompleted={isCompleted}
                      onComplete={(selfInitiated) => handleComplete(task, selfInitiated)}
                      onUncomplete={() => uncompleteTask(task.id, currentProfile.id)}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Shortcut cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/child/avatar" className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <span className="text-4xl">👗</span>
            <p className="font-bold text-purple-700 text-sm">アバターを みる</p>
            <ChevronRight size={14} className="text-purple-400" />
          </Link>
          <Link href="/child/shop" className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <span className="text-4xl">🛍️</span>
            <p className="font-bold text-orange-700 text-sm">ショップへ</p>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500" fill="currentColor" />
              <span className="text-xs font-bold text-orange-600">{currentProfile.pointsTotal}pt あり</span>
            </div>
          </Link>
        </div>

        {/* Self-initiated tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <Zap size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-bold text-sm">ひとりでできたら +5ポイント！</p>
            <p className="text-yellow-600 text-xs mt-0.5">タスクを タップして「ひとりでできた！」をえらんでね</p>
          </div>
        </motion.div>
      </div>

      <CelebrationModal
        isOpen={!!celebration}
        points={celebration?.points ?? 0}
        message={celebration?.message ?? ''}
        onClose={() => setCelebration(null)}
      />

      <BottomNav />
    </div>
  )
}
