'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { LogOut, Plus, Users, Star, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import BottomNav from '@/components/BottomNav'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CATEGORY_LABELS, FREQUENCY_LABELS } from '@/lib/utils'

export default function ParentHomePage() {
  const router = useRouter()
  const { currentProfile, currentFamily, dispatch, state, getChildProfiles, getTodayTasks, isTaskCompletedToday } = useStore()
  const [expandedChild, setExpandedChild] = useState<string | null>(null)

  useEffect(() => {
    if (!currentProfile) router.replace('/')
  }, [currentProfile, router])

  if (!currentProfile || currentProfile.role !== 'parent') return null

  const children = getChildProfiles()
  const todayDate = format(new Date(), 'M月d日(E)', { locale: ja })

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    router.replace('/')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-purple-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-200 text-sm">{todayDate}</p>
              <h1 className="text-2xl font-black">
                {currentProfile.name}のダッシュボード
              </h1>
            </div>
            <button onClick={handleLogout} className="text-blue-200 hover:text-white p-2">
              <LogOut size={20} />
            </button>
          </div>

          {currentFamily && (
            <div className="bg-white/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
              <Users size={14} />
              <span className="text-sm font-bold">{currentFamily.name}</span>
              <span className="text-blue-200 text-xs">コード: {currentFamily.inviteCode}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5 space-y-5">
        {/* Children status */}
        <div>
          <h2 className="font-black text-gray-700 text-base mb-3">👧 こどもたちの 今日の状況</h2>
          {children.map((child, i) => {
            const tasks = getTodayTasks(child.id)
            const allTasks = state.tasks.filter(t => t.familyId === currentFamily?.id && t.assignedTo === child.id && t.isActive)
            const done = tasks.filter(t => isTaskCompletedToday(t.id, child.id)).length
            const progress = tasks.length > 0 ? (done / tasks.length) * 100 : 0
            const isExpanded = expandedChild === child.id

            return (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border-2 border-purple-100 mb-3 overflow-hidden"
              >
                {/* 子どもカードヘッダー（タップで展開） */}
                <button
                  onClick={() => setExpandedChild(isExpanded ? null : child.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FamiaAvatar config={child.avatarConfig} size={56} />
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-base">{child.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500" fill="currentColor" />
                          <span className="text-sm font-bold text-gray-600">{child.pointsTotal}pt</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{done}/{tasks.length}タスク完了</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  {/* プログレスバー */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 text-right">{Math.round(progress)}% 達成</p>
                </button>

                {/* 展開：今日のタスク一覧 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-purple-100"
                    >
                      {/* 今日のタスク */}
                      <div className="px-4 pt-3 pb-1">
                        <p className="text-xs font-black text-purple-500 mb-2">📅 今日のタスク（{tasks.length}件）</p>
                        {tasks.length === 0 ? (
                          <p className="text-xs text-gray-400 pb-3">今日のタスクはありません</p>
                        ) : (
                          <div className="space-y-2 mb-3">
                            {tasks.map(task => {
                              const completed = isTaskCompletedToday(task.id, child.id)
                              const cat = CATEGORY_LABELS[task.category]
                              return (
                                <div
                                  key={task.id}
                                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                                    completed ? 'bg-green-50' : 'bg-gray-50'
                                  }`}
                                >
                                  {completed
                                    ? <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                    : <Circle size={18} className="text-gray-300 flex-shrink-0" />
                                  }
                                  <span className="text-lg">{task.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                      {task.title}
                                    </p>
                                    <p className="text-xs text-gray-400">{cat.label} · {task.pointsValue}pt</p>
                                  </div>
                                  {completed && (
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                                      完了
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* 全タスク（今日以外も含む） */}
                      {allTasks.length > tasks.length && (
                        <div className="px-4 pt-1 pb-3">
                          <p className="text-xs font-black text-gray-400 mb-2">
                            📋 全タスク（{allTasks.length}件登録済み）
                          </p>
                          <div className="space-y-1.5">
                            {allTasks.filter(t => !tasks.find(tt => tt.id === t.id)).map(task => {
                              const cat = CATEGORY_LABELS[task.category]
                              return (
                                <div key={task.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
                                  <span className="text-base">{task.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-500 truncate">{task.title}</p>
                                    <p className="text-xs text-gray-400">{cat.label} · {FREQUENCY_LABELS[task.frequency]} · {task.pointsValue}pt</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* タスク管理へのリンク */}
                      <div className="px-4 pb-4">
                        <Link
                          href="/parent/tasks"
                          className="block w-full text-center text-xs font-bold text-purple-500 bg-purple-50 rounded-xl py-2.5 hover:bg-purple-100 transition-colors"
                        >
                          タスクを追加・編集する →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {children.length === 0 && (
            <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">👧</div>
              <p className="text-gray-500 font-medium">まだこどもが登録されていません</p>
              <Link href="/parent/family" className="text-purple-500 font-bold text-sm mt-2 block">
                こどもを追加する →
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-black text-gray-700 text-base mb-3">⚡ クイックアクション</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/parent/tasks"
              className="bg-white rounded-2xl p-4 shadow-sm border-2 border-blue-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="bg-blue-100 rounded-xl p-2.5">
                <span className="text-2xl">📋</span>
              </div>
              <p className="font-bold text-gray-700 text-sm text-center">タスク管理</p>
            </Link>
            <Link
              href="/parent/tasks/new"
              className="bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="bg-white/30 rounded-xl p-2.5">
                <Plus size={24} className="text-white" />
              </div>
              <p className="font-bold text-white text-sm">タスクを追加</p>
            </Link>
          </div>
        </div>

        {/* Family Rules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-700 text-base">📜 家族のルールBOX</h2>
          </div>
          <div className="space-y-2">
            {state.familyRules
              .filter(r => r.familyId === currentFamily?.id)
              .map((rule, i) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3"
                >
                  <span className="text-xl">📜</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{rule.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{rule.content}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Invite code info */}
        {currentFamily && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-5 text-white">
            <p className="font-bold text-purple-200 text-sm mb-1">👨‍👩‍👧 ファミリーコード</p>
            <p className="font-black text-4xl tracking-widest mb-2">{currentFamily.inviteCode}</p>
            <p className="text-purple-200 text-xs">こどもはこのコードでログインできます</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
