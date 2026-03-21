'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import TaskCard from '@/components/TaskCard'
import CelebrationModal from '@/components/CelebrationModal'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@/lib/utils'

const FILTERS = [
  { key: 'all', label: 'ぜんぶ' },
  { key: 'routine', label: 'ルーティン' },
  { key: 'chore', label: 'おてつだい' },
  { key: 'habit', label: 'しゅうかん' },
]

export default function ChildTasksPage() {
  const { currentProfile, state, getTodayTasks, isTaskCompletedToday, completeTask, uncompleteTask } = useStore()
  const [filter, setFilter] = useState('all')
  const [celebration, setCelebration] = useState<{ points: number; message: string } | null>(null)

  if (!currentProfile || currentProfile.role !== 'child') return null

  const todayTasks = getTodayTasks(currentProfile.id)
  const filteredTasks = filter === 'all' ? todayTasks : todayTasks.filter(t => t.category === filter)

  const completedToday = todayTasks.filter(t => isTaskCompletedToday(t.id, currentProfile.id))
  const totalPoints = completedToday.reduce((sum, t) => {
    const comp = state.completions.find(c => c.taskId === t.id && c.userId === currentProfile.id)
    return sum + (comp?.pointsEarned ?? 0)
  }, 0)

  const handleComplete = (task: (typeof todayTasks)[0], selfInitiated: boolean) => {
    completeTask(task, currentProfile.id, selfInitiated)
    const earned = selfInitiated ? task.pointsValue + 5 : task.pointsValue
    setCelebration({
      points: earned,
      message: selfInitiated ? 'ひとりでできた！' : 'よくがんばった！',
    })
  }

  return (
    <div className="min-h-dvh bg-purple-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black mb-1">📋 タスクいちらん</h1>
          <p className="text-purple-200 text-sm">{currentProfile.name}ちゃんのきょうのタスク</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm font-bold">
              ✅ {completedToday.length}/{todayTasks.length}こ おわり
            </div>
            <div className="bg-yellow-400 text-yellow-900 rounded-xl px-3 py-1.5 text-sm font-bold">
              ⭐ きょう +{totalPoints}pt
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f.key
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 font-bold">きょうのタスクは ないよ！</p>
            </div>
          ) : (
            filteredTasks.map((task, i) => {
              const isCompleted = isTaskCompletedToday(task.id, currentProfile.id)
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <TaskCard
                    task={task}
                    isCompleted={isCompleted}
                    onComplete={(si) => handleComplete(task, si)}
                    onUncomplete={() => uncompleteTask(task.id, currentProfile.id)}
                  />
                </motion.div>
              )
            })
          )}
        </div>

        {/* Weekly overview hint */}
        {completedToday.length === todayTasks.length && todayTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl p-5 text-white text-center"
          >
            <div className="text-5xl mb-3">🌟</div>
            <p className="font-black text-xl">きょうのタスク コンプリート！</p>
            <p className="text-green-100 text-sm mt-1">すごい！全部できたよ！</p>
          </motion.div>
        )}
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
