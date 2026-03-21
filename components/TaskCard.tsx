'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap } from 'lucide-react'
import type { Task } from '@/types'
import { cn, CATEGORY_LABELS } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  isCompleted: boolean
  onComplete: (selfInitiated: boolean) => void
  onUncomplete: () => void
  showSelfInitiated?: boolean
}

export default function TaskCard({
  task,
  isCompleted,
  onComplete,
  onUncomplete,
  showSelfInitiated = true,
}: TaskCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const category = CATEGORY_LABELS[task.category]

  const handleComplete = (selfInitiated: boolean) => {
    setCelebrating(true)
    onComplete(selfInitiated)
    setShowOptions(false)
    setTimeout(() => setCelebrating(false), 1000)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl border-2 p-4 transition-all duration-300 card-hover',
        isCompleted
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-purple-100 shadow-sm'
      )}
    >
      {/* Celebration burst */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0, y: -40 }}
            exit={{}}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <span className="text-4xl">⭐</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Emoji */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
          isCompleted ? 'bg-green-100' : 'bg-purple-50'
        )}>
          {isCompleted ? '✅' : task.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-bold text-base leading-tight',
            isCompleted ? 'text-green-700 line-through decoration-green-400' : 'text-gray-800'
          )}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', category.color)}>
              {category.emoji} {category.label}
            </span>
            {task.scheduledTime && (
              <span className="text-xs text-gray-400">⏰ {task.scheduledTime}</span>
            )}
          </div>
        </div>

        {/* Points + Action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold',
            isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          )}>
            <Star size={12} fill="currentColor" />
            <span>{task.pointsValue}pt</span>
          </div>

          {!isCompleted ? (
            <div className="relative">
              {showSelfInitiated ? (
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                >
                  やった！
                </button>
              ) : (
                <button
                  onClick={() => handleComplete(false)}
                  className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                >
                  やった！
                </button>
              )}

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    className="absolute right-0 top-9 z-20 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 min-w-[180px]"
                  >
                    <p className="text-xs text-gray-500 mb-2 font-medium">どうだった？</p>
                    <button
                      onClick={() => handleComplete(true)}
                      className="w-full flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-2.5 rounded-xl mb-2 transition-colors"
                    >
                      <Zap size={14} className="text-yellow-500" />
                      <span>ひとりでできた！</span>
                      <span className="ml-auto text-yellow-600 text-xs">+5ボーナス</span>
                    </button>
                    <button
                      onClick={() => handleComplete(false)}
                      className="w-full flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-sm font-bold px-3 py-2.5 rounded-xl transition-colors"
                    >
                      <span>✅ できた</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={onUncomplete}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              取り消す
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
