'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plus, Copy, Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import BottomNav from '@/components/BottomNav'
import { generateId, PICTURE_PASSWORD_EMOJIS } from '@/lib/utils'
import { DEFAULT_GIRL_AVATAR, DEFAULT_BOY_AVATAR } from '@/lib/avatar-items'
import PicturePassword from '@/components/PicturePassword'
import type { Profile } from '@/types'

export default function ParentFamilyPage() {
  const { currentProfile, currentFamily, state, dispatch, getChildProfiles, getParentProfiles } = useStore()
  const [addingChild, setAddingChild] = useState(false)
  const [childName, setChildName] = useState('')
  const [childGender, setChildGender] = useState<'girl' | 'boy'>('girl')
  const [childPassword, setChildPassword] = useState<string[]>([])
  const [step, setStep] = useState<'info' | 'password'>('info')
  const [copied, setCopied] = useState(false)

  if (!currentProfile || !currentFamily) return null

  const children = getChildProfiles()
  const parents = getParentProfiles()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFamily.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddChild = () => {
    if (!childName || childPassword.length !== 3) return

    const child: Profile = {
      id: generateId(),
      familyId: currentFamily.id,
      name: childName,
      role: 'child',
      gender: childGender,
      avatarConfig: childGender === 'girl' ? DEFAULT_GIRL_AVATAR : DEFAULT_BOY_AVATAR,
      pointsTotal: 0,
      picturePassword: childPassword,
      passwordHash: null,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: 'ADD_PROFILE', payload: child })
    setAddingChild(false)
    setChildName('')
    setChildPassword([])
    setStep('info')
  }

  return (
    <div className="min-h-dvh bg-blue-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black mb-1">👨‍👩‍👧 家族設定</h1>
          <p className="text-blue-200 text-sm">{currentFamily.name}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5 space-y-5">
        {/* Invite code */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-5 text-white">
          <p className="text-purple-200 text-sm font-medium mb-1">ファミリーコード</p>
          <div className="flex items-center gap-3">
            <p className="font-black text-4xl tracking-widest flex-1">{currentFamily.inviteCode}</p>
            <button
              onClick={handleCopyCode}
              className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-purple-200 text-xs mt-2">このコードをこどもに教えてね</p>
        </div>

        {/* Family members */}
        <div>
          <h2 className="font-black text-gray-700 text-base mb-3">メンバー</h2>
          <div className="space-y-2">
            {[...parents, ...children].map(profile => (
              <div
                key={profile.id}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3"
              >
                <FamiaAvatar config={profile.avatarConfig} size={48} />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{profile.name}</p>
                  <p className="text-xs text-gray-500">
                    {profile.role === 'parent' ? '👨‍👩 おとな' : `👧 こども • ${profile.pointsTotal}pt`}
                  </p>
                </div>
                {profile.role === 'child' && profile.picturePassword && (
                  <div className="flex gap-0.5">
                    {profile.picturePassword.map((e, i) => (
                      <span key={i} className="text-sm">❓</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add child button */}
          {!addingChild && (
            <button
              onClick={() => setAddingChild(true)}
              className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-2xl py-4 text-blue-500 font-bold hover:bg-blue-50 transition-colors"
            >
              <Plus size={20} />
              こどもを追加する
            </button>
          )}
        </div>

        {/* Add child form */}
        {addingChild && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 shadow-md"
          >
            {step === 'info' ? (
              <div className="space-y-4">
                <h3 className="font-black text-gray-800 text-lg">こどもを追加</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">なまえ</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    placeholder="例：きこ"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">せいべつ</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['girl', 'boy'] as const).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setChildGender(g)}
                        className={`py-2.5 rounded-xl font-bold border-2 transition-all ${
                          childGender === g ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {g === 'girl' ? '👧 女の子' : '👦 男の子'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddingChild(false)}
                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => childName && setStep('password')}
                    disabled={!childName}
                    className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl disabled:opacity-40"
                  >
                    つぎへ →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-black text-gray-800 text-lg mb-2">{childName}ちゃんのパスワード</h3>
                <p className="text-gray-500 text-sm mb-5">3つのどうぶつを えらんでね</p>
                <PicturePassword
                  onComplete={seq => { setChildPassword(seq); setTimeout(handleAddChild, 300) }}
                  label="パスワードにするどうぶつを えらぼう"
                />
                <button
                  onClick={() => setStep('info')}
                  className="mt-4 w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl"
                >
                  もどる
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
