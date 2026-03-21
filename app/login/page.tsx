'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { state, dispatch } = useStore()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 500))

    const profile = state.profiles.find(
      p => p.name === name && p.role === 'parent' && p.passwordHash === password
    )

    if (!profile) {
      setError('なまえかパスワードがちがいます')
      setLoading(false)
      return
    }

    dispatch({ type: 'LOGIN', payload: { userId: profile.id, familyId: profile.familyId } })
    router.replace('/parent')
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-purple-100 to-pink-50 flex flex-col px-6 py-8">
      <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 w-fit">
        <ArrowLeft size={20} />
        <span className="font-medium">もどる</span>
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">👨‍👩‍👧</div>
            <h1 className="text-3xl font-black text-gray-800">おとな ログイン</h1>
            <p className="text-gray-500 mt-2">パパ・ママのログイン画面です</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">なまえ</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例：パパ、ママ"
                className="w-full bg-white border-2 border-purple-200 rounded-2xl px-4 py-3.5 font-medium text-gray-800 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">パスワード</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="パスワードをいれてね"
                  className="w-full bg-white border-2 border-purple-200 rounded-2xl px-4 py-3.5 pr-12 font-medium text-gray-800 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm font-medium bg-red-50 rounded-xl px-3 py-2"
              >
                ❌ {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 mt-2"
            >
              {loading ? '...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-purple-100">
            <p className="text-center text-gray-500 font-medium mb-4">こどもはこちら</p>
            <Link
              href="/child-select"
              className="block w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg text-center active:scale-95"
            >
              👧 こどもログイン
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
