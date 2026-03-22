'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import type { FamilyRule } from '@/types'

type Theme = 'child' | 'parent'

interface FamilyRulesManagerProps {
  familyId: string
  editorProfileId: string
  theme?: Theme
}

export default function FamilyRulesManager({
  familyId,
  editorProfileId,
  theme = 'parent',
}: FamilyRulesManagerProps) {
  const { state, dispatch } = useStore()
  const rules = state.familyRules.filter(r => r.familyId === familyId)

  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const isChild = theme === 'child'
  const cardBorder = isChild ? 'border-2 border-purple-100' : 'border border-gray-100'
  const addBtnClass = isChild
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    : 'bg-blue-500 text-white'
  const inputClass = isChild
    ? 'border-2 border-purple-200 rounded-2xl focus:border-purple-400'
    : 'border-2 border-gray-200 rounded-xl focus:border-blue-400'

  const startEdit = (r: FamilyRule) => {
    setEditingId(r.id)
    setEditTitle(r.title)
    setEditContent(r.content)
  }

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return
    dispatch({
      type: 'UPDATE_FAMILY_RULE',
      payload: { id: editingId, title: editTitle.trim(), content: editContent.trim() },
    })
    setEditingId(null)
  }

  const handleAdd = () => {
    if (!newTitle.trim()) return
    const rule: FamilyRule = {
      id: generateId(),
      familyId,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdBy: editorProfileId,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_FAMILY_RULE', payload: rule })
    setNewTitle('')
    setNewContent('')
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(isChild ? 'このルールをけしていい？' : 'このルールを削除しますか？')) {
      dispatch({ type: 'DELETE_FAMILY_RULE', payload: id })
      if (editingId === id) setEditingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className={`font-black ${isChild ? 'text-gray-800 text-lg' : 'text-gray-700 text-base'}`}>
          📜 かぞくのルールBOX
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm active:scale-95 ${addBtnClass}`}
          >
            <Plus size={14} />
            ついか
          </button>
        )}
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`bg-white rounded-2xl p-4 shadow-sm ${cardBorder} space-y-3`}
          >
            <p className={`font-bold text-sm ${isChild ? 'text-purple-700' : 'text-gray-700'}`}>
              あたらしいルール
            </p>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="タイトル（例：朝のルール）"
              className={`w-full px-4 py-3 font-bold text-sm ${inputClass}`}
            />
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="なかみをかいてね"
              rows={3}
              className={`w-full px-4 py-3 font-medium text-sm resize-none ${inputClass}`}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setAdding(false); setNewTitle(''); setNewContent('') }}
                className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-xl text-sm"
              >
                やめる
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className={`flex-1 font-black py-2.5 rounded-xl text-sm disabled:opacity-40 ${addBtnClass}`}
              >
                ほぞん
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {rules.length === 0 && !adding && (
        <div className={`text-center py-8 rounded-2xl ${isChild ? 'bg-purple-50 border-2 border-dashed border-purple-200' : 'bg-gray-50 border border-dashed border-gray-200'}`}>
          <p className={`font-bold text-sm ${isChild ? 'text-purple-600' : 'text-gray-500'}`}>
            まだルールがないよ
          </p>
          <p className="text-xs text-gray-400 mt-1">「ついか」から かぞくのルールを のこそう</p>
        </div>
      )}

      <div className="space-y-2">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`bg-white rounded-2xl px-4 py-3 shadow-sm ${cardBorder}`}
          >
            {editingId === rule.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className={`w-full px-3 py-2 font-bold text-sm ${inputClass}`}
                />
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm resize-none ${inputClass}`}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={!editTitle.trim()}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black disabled:opacity-40 ${addBtnClass}`}
                  >
                    <Check size={14} /> ほぞん
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">📜</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 text-sm">{rule.title}</p>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed whitespace-pre-wrap">{rule.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {state.profiles.find(p => p.id === rule.createdBy)?.name ?? 'だれか'}が ついか
                  </p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(rule)}
                    className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg"
                    title="へんしゅう"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                    title="けす"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
