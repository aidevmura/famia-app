'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function ParentTasksPage() {
  const { currentProfile, state, dispatch, currentFamily, getChildProfiles } = useStore()
  const [filter, setFilter] = useState<string>('all')

  if (!currentProfile || currentProfile.role !== 'parent' || !currentFamily) return null

  const children = getChildProfiles()
  const tasks = state.tasks.filter(t => t.familyId === currentFamily.id)
  const filteredTasks = filter === 'all' ? tasks : filter === 'inactive'
    ? tasks.filter(t => !t.isActive)
    : tasks.filter(t => t.isActive && (filter === 'category-all' || t.category === filter))

  const activeTasks = tasks.filter(t => t.isActive)

  const getAssigneeName = (assignedTo: string | null) => {
    if (!assignedTo) return '全員'
    return state.profiles.find(p => p.id === assignedTo)?.name ?? '不明'
  }

  const handleToggle = (taskId: string, currentActive: boolean) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, isActive: !currentActive } })
  }

  const handleDelete = (taskId: string) => {
    if (confirm('このタスクを削除しますか？')) {
      dispatch({ type: 'DELETE_TASK', payload: taskId })
    }
  }

  return (
    <div className="min-h-dvh bg-blue-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black mb-1">📋 タスク管理</h1>
          <p className="text-blue-200 text-sm">{activeTasks.length}件のアクティブなタスク</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">
        {/* Add button */}
        <Link
          href="/parent/tasks/new"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-black text-base py-4 rounded-2xl shadow-md mb-5 active:scale-95"
        >
          <Plus size={20} />
          新しいタスクを追加
        </Link>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {[
            { key: 'all', label: 'ぜんぶ' },
            { key: 'routine', label: 'ルーティン' },
            { key: 'chore', label: 'おてつだい' },
            { key: 'habit', label: 'しゅうかん' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.map((task, i) => {
            const cat = CATEGORY_LABELS[task.category]
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'bg-white rounded-2xl p-4 shadow-sm border-2',
                  task.isActive ? 'border-blue-100' : 'border-gray-100 opacity-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">{task.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
                        {cat.emoji} {cat.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {FREQUENCY_LABELS[task.frequency]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">
                        ⭐ {task.pointsValue}pt
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                        👤 {getAssigneeName(task.assignedTo)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(task.id, task.isActive)}
                      className="p-1 hover:opacity-70 transition-opacity"
                      title={task.isActive ? '無効化' : '有効化'}
                    >
                      {task.isActive
                        ? <ToggleRight size={24} className="text-green-500" />
                        : <ToggleLeft size={24} className="text-gray-400" />
                      }
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-500 font-medium">タスクがまだありません</p>
              <Link href="/parent/tasks/new" className="text-blue-500 font-bold text-sm mt-2 block">
                最初のタスクを追加 →
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
