'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import TaskCard from '@/components/TaskCard'
import CelebrationModal from '@/components/CelebrationModal'
import BottomNav from '@/components/BottomNav'
import TodayTaskPointsPanel from '@/components/TodayTaskPointsPanel'
import { getTodayTaskPointsSummary } from '@/lib/utils'

export default function ChildTasksPage() {
  const { currentProfile, state, getTodayTasks, isTaskCompletedToday, completeTask, uncompleteTask } = useStore()
  const [celebration, setCelebration] = useState<{ points: number; message: string } | null>(null)

  if (!currentProfile || currentProfile.role !== 'child') return null

  const todayTasks = getTodayTasks(currentProfile.id)
  const pointsSummary = getTodayTaskPointsSummary(
    state,
    currentProfile.id,
    todayTasks,
    isTaskCompletedToday
  )

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
          <TodayTaskPointsPanel summary={pointsSummary} variant="tasksHeader" showCompletionBadge />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">
        {/* Task list */}
        <div className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 font-bold">きょうのタスクは ないよ！</p>
            </div>
          ) : (
            todayTasks.map((task, i) => {
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
        {pointsSummary.completedCount === pointsSummary.totalCount && todayTasks.length > 0 && (
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
