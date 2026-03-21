'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import type { Task, TaskCategory, TaskFrequency } from '@/types'

const EMOJIS = ['🧹', '🍽️', '📝', '⏰', '🎒', '🐹', '✨', '🌱', '🏃', '📚', '🛁', '🛏️', '🌙', '☀️', '💪']
const CATEGORIES: { key: TaskCategory; label: string; desc: string }[] = [
  { key: 'routine', label: '📅 ルーティン', desc: '朝・夜の決まった行動' },
  { key: 'chore', label: '🧹 おてつだい', desc: '家のお手伝い' },
  { key: 'habit', label: '⭐ しゅうかん', desc: '身に付けたい習慣' },
]
const FREQUENCIES: { key: TaskFrequency; label: string }[] = [
  { key: 'daily', label: '毎日' },
  { key: 'weekday', label: '平日のみ' },
  { key: 'weekend', label: '週末のみ' },
]

export default function NewTaskPage() {
  const router = useRouter()
  const { currentProfile, currentFamily, state, dispatch, getChildProfiles } = useStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🧹')
  const [category, setCategory] = useState<TaskCategory>('chore')
  const [frequency, setFrequency] = useState<TaskFrequency>('daily')
  const [points, setPoints] = useState(10)
  const [assignedTo, setAssignedTo] = useState<string | null>(null)
  const [scheduledTime, setScheduledTime] = useState('')

  if (!currentProfile || !currentFamily) return null
  const children = getChildProfiles()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const task: Task = {
      id: generateId(),
      familyId: currentFamily.id,
      createdBy: currentProfile.id,
      assignedTo,
      title,
      description,
      category,
      pointsValue: points,
      frequency,
      scheduledTime: scheduledTime || null,
      isActive: true,
      emoji,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TASK', payload: task })
    router.replace('/parent/tasks')
  }

  return (
    <div className="min-h-dvh bg-blue-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <Link href="/parent/tasks" className="flex items-center gap-2 text-blue-200 mb-4 w-fit">
            <ArrowLeft size={20} />
            <span>もどる</span>
          </Link>
          <h1 className="text-2xl font-black">✏️ タスクを追加</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Emoji picker */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">アイコンを選ぶ</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    emoji === e ? 'bg-blue-100 border-2 border-blue-400 scale-110' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2">タスク名 *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例：朝ごはんを食べる"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-400 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2">メモ（任意）</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="補足説明があれば..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">カテゴリ</label>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    category === cat.key
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="font-bold text-gray-800">{cat.label}</span>
                  <span className="text-xs text-gray-500">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">頻度</label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    frequency === f.key
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Points */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              ポイント: <span className="text-blue-600">{points}pt</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={points}
              onChange={e => setPoints(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5pt</span>
              <span>50pt</span>
            </div>
          </div>

          {/* Scheduled time */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2">実行時間（任意）</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Assign to */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">だれのタスク？</label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setAssignedTo(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  assignedTo === null ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                全員
              </button>
              {children.map(child => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setAssignedTo(child.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                    assignedTo === child.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95"
          >
            タスクを登録！
          </button>
        </form>
      </div>
    </div>
  )
}
