'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { generateId, generateInviteCode } from '@/lib/utils'
import { DEFAULT_GIRL_AVATAR, DEFAULT_BOY_AVATAR } from '@/lib/avatar-items'
import type { Family, Profile } from '@/types'

export default function SignupPage() {
  const router = useRouter()
  const { dispatch } = useStore()
  const [step, setStep] = useState(1)
  const [familyName, setFamilyName] = useState('')
  const [parentName, setParentName] = useState('')
  const [gender, setGender] = useState<'boy' | 'girl'>('boy')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))

    const familyId = generateId()
    const userId = generateId()
    const inviteCode = generateInviteCode()

    const family: Family = {
      id: familyId,
      name: familyName,
      inviteCode,
      createdAt: new Date().toISOString(),
    }

    const profile: Profile = {
      id: userId,
      familyId,
      name: parentName,
      role: 'parent',
      gender,
      avatarConfig: gender === 'girl' ? DEFAULT_GIRL_AVATAR : DEFAULT_BOY_AVATAR,
      pointsTotal: 0,
      picturePassword: null,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    }

    dispatch({ type: 'CREATE_FAMILY', payload: { family, profile } })
    dispatch({ type: 'LOGIN', payload: { userId, familyId } })
    router.replace('/parent')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-green-100 to-teal-50 flex flex-col px-6 py-8">
      <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 w-fit">
        <ArrowLeft size={20} />
        <span className="font-medium">もどる</span>
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">{step === 1 ? '🏠' : '👤'}</div>
            <h1 className="text-3xl font-black text-gray-800">
              {step === 1 ? 'かぞくをつくる' : 'あなたのこと'}
            </h1>
            <p className="text-gray-500 mt-1">{step} / 2</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  かぞくのなまえ
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  placeholder="例：村上家"
                  className="w-full bg-white border-2 border-green-200 rounded-2xl px-4 py-3.5 font-medium text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">あなたのなまえ</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="例：パパ、ママ"
                    className="w-full bg-white border-2 border-green-200 rounded-2xl px-4 py-3.5 font-medium text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">せいべつ</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['boy', 'girl'] as const).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-2xl font-bold text-base border-2 transition-all ${
                          gender === g
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {g === 'girl' ? '👩 女性' : '👨 男性'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">パスワード</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="パスワードをきめてね"
                    className="w-full bg-white border-2 border-green-200 rounded-2xl px-4 py-3.5 font-medium text-gray-800 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 disabled:opacity-70"
            >
              {loading ? '...' : step === 1 ? 'つぎへ →' : 'かんせい！'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
