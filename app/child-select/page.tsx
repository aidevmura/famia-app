'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'

export default function ChildSelectPage() {
  const router = useRouter()
  const { state, dispatch } = useStore()
  const [familyCode, setFamilyCode] = useState('')
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  const [error, setError] = useState('')

  const family = state.families.find(f => f.inviteCode === familyCode.toUpperCase())
  const children = family
    ? state.profiles.filter(p => p.familyId === family.id && p.role === 'child')
    : []

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!family) {
      setError('ファミリーコードがみつかりません')
      return
    }
    setError('')
    setSelectedFamily(family.id)
  }

  const handleSelectChild = (childId: string) => {
    router.push(`/child-login?childId=${childId}`)
  }

  if (selectedFamily && children.length > 0) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-yellow-100 to-orange-50 flex flex-col px-6 py-8">
        <button
          onClick={() => setSelectedFamily(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-8 w-fit"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">もどる</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👤</div>
            <h1 className="text-3xl font-black text-gray-800">だれですか？</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {children.map((child, i) => (
              <motion.button
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelectChild(child.id)}
                className="bg-white rounded-3xl p-6 shadow-md border-2 border-orange-100 hover:border-orange-400 hover:bg-orange-50 transition-all active:scale-95 flex flex-col items-center gap-3"
              >
                <FamiaAvatar config={child.avatarConfig} size={80} />
                <span className="font-black text-xl text-gray-800">{child.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-yellow-100 to-orange-50 flex flex-col px-6 py-8">
      <Link href="/login" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-8 w-fit">
        <ArrowLeft size={20} />
        <span className="font-medium">もどる</span>
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-3">🔑</div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">こどもログイン</h1>
          <p className="text-gray-500 mb-8">パパかママにファミリーコードを聞いてね</p>

          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <input
              type="text"
              value={familyCode}
              onChange={e => setFamilyCode(e.target.value.toUpperCase())}
              placeholder="ファミリーコード（例：KIKO01）"
              maxLength={6}
              className="w-full bg-white border-2 border-orange-200 rounded-2xl px-4 py-4 font-black text-2xl text-center tracking-widest text-gray-800 focus:outline-none focus:border-orange-500 transition-colors uppercase"
              required
            />

            {error && (
              <p className="text-red-500 text-sm font-medium">❌ {error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95"
            >
              つぎへ →
            </button>

            {/* Demo hint */}
            <button
              type="button"
              onClick={() => setFamilyCode('KIKO01')}
              className="w-full text-xs text-orange-400 font-bold py-2 hover:text-orange-600 transition-colors"
            >
              🎮 デモコードをいれる（KIKO01）
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
