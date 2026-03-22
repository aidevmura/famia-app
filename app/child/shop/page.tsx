'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingBag, CheckCircle } from 'lucide-react'
import { useStore } from '@/lib/store'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_LABELS, RARITY_LABELS } from '@/lib/avatar-items'
import type { AvatarItem } from '@/types'

export default function ChildShopPage() {
  const { currentProfile, state, purchaseItem } = useStore()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'notOwned'>('all')
  const [buyConfirm, setBuyConfirm] = useState<AvatarItem | null>(null)
  const [justPurchased, setJustPurchased] = useState<string | null>(null)

  if (!currentProfile || currentProfile.role !== 'child') return null

  const ownedIds = state.userAvatarItems
    .filter(uai => uai.userId === currentProfile.id)
    .map(uai => uai.itemId)

  const allItems = state.avatarItems.filter(
    item => item.gender === 'both' || item.gender === currentProfile.gender
  )

  const categoryFiltered = activeCategory === 'all'
    ? allItems
    : allItems.filter(item => item.category === activeCategory)

  const filteredItems = ownershipFilter === 'owned'
    ? categoryFiltered.filter(item => ownedIds.includes(item.id))
    : ownershipFilter === 'notOwned'
    ? categoryFiltered.filter(item => !ownedIds.includes(item.id))
    : categoryFiltered

  const categories = ['all', ...new Set(allItems.map(i => i.category))]

  const ownedCount = allItems.filter(i => ownedIds.includes(i.id)).length
  const notOwnedCount = allItems.filter(i => !ownedIds.includes(i.id)).length

  const handleBuy = (item: AvatarItem) => {
    if (currentProfile.pointsTotal < item.pointsCost) return
    purchaseItem(item, currentProfile.id)
    setJustPurchased(item.id)
    setBuyConfirm(null)
    setTimeout(() => setJustPurchased(null), 3000)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-yellow-100 to-orange-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black mb-1">🛍️ アイテムショップ</h1>
          <p className="text-yellow-100 text-sm">ポイントでアイテムをゲットしよう！</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="bg-white/30 rounded-xl px-3 py-2 flex items-center gap-2">
              <Star size={16} fill="currentColor" className="text-yellow-900" />
              <span className="font-black text-yellow-900 text-lg">{currentProfile.pointsTotal}pt</span>
            </div>
            <span className="text-yellow-100 text-sm font-medium">もってるポイント</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">

        {/* 絞り込み①：持っているか */}
        <p className="text-xs font-black text-gray-400 mb-2">① もちものフィルター</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {([
            { key: 'all',      label: 'ぜんぶ',       sub: `${allItems.length}こ`,     color: 'bg-orange-500' },
            { key: 'owned',    label: 'もってる',      sub: `${ownedCount}こ`,           color: 'bg-green-500' },
            { key: 'notOwned', label: 'まだない',      sub: `${notOwnedCount}こ`,        color: 'bg-purple-500' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setOwnershipFilter(f.key)}
              className={`rounded-2xl py-2.5 px-2 text-center transition-all active:scale-95 border-2 ${
                ownershipFilter === f.key
                  ? `${f.color} text-white border-transparent shadow-md`
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              <div className="text-sm font-black">{f.label}</div>
              <div className={`text-xs mt-0.5 ${ownershipFilter === f.key ? 'text-white/80' : 'text-gray-400'}`}>
                {f.sub}
              </div>
            </button>
          ))}
        </div>

        {/* 絞り込み②：カテゴリ */}
        <p className="text-xs font-black text-gray-400 mb-2">② カテゴリフィルター</p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {categories.map(cat => {
            const label = cat === 'all'
              ? 'ぜんぶ'
              : CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 現在の絞り込み結果 */}
        <p className="text-xs text-gray-400 font-bold mb-3">
          {filteredItems.length}こ表示中
          {(ownershipFilter !== 'all' || activeCategory !== 'all') && (
            <button
              onClick={() => { setOwnershipFilter('all'); setActiveCategory('all') }}
              className="ml-2 text-orange-400 underline"
            >
              リセット
            </button>
          )}
        </p>

        {/* Items grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item, i) => {
            const owned = ownedIds.includes(item.id)
            const canAfford = currentProfile.pointsTotal >= item.pointsCost
            const rarity = RARITY_LABELS[item.rarity]
            const justBought = justPurchased === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`relative bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${
                  owned
                    ? 'border-green-300 bg-green-50'
                    : canAfford
                    ? 'border-yellow-200 hover:border-yellow-400'
                    : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Rarity badge */}
                {item.rarity !== 'common' && (
                  <div className={`absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    item.rarity === 'epic' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {rarity.label}
                  </div>
                )}

                {/* Item icon */}
                <div className="text-4xl mb-2 text-center">
                  {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]?.split(' ')[0] ?? '✨'}
                </div>

                <p className="font-bold text-sm text-gray-800 leading-tight mb-1">{item.name}</p>
                <p className="text-xs text-gray-500 mb-3">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" fill="currentColor" />
                    <span className="text-sm font-black text-gray-700">{item.pointsCost}pt</span>
                  </div>

                  {owned ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <CheckCircle size={14} />
                      もってる
                    </div>
                  ) : (
                    <button
                      onClick={() => setBuyConfirm(item)}
                      disabled={!canAfford}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 active:scale-95'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'ゲット！' : 'ポイントたりない'}
                    </button>
                  )}
                </div>

                {/* Just purchased animation */}
                <AnimatePresence>
                  {justBought && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center"
                    >
                      <p className="text-white font-black text-lg">ゲット！🎉</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Buy confirmation modal */}
      <AnimatePresence>
        {buyConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4"
            onClick={() => setBuyConfirm(null)}
          >
            <div className="absolute inset-0 bg-black/30" />
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">
                  {CATEGORY_LABELS[buyConfirm.category as keyof typeof CATEGORY_LABELS]?.split(' ')[0] ?? '✨'}
                </div>
                <h3 className="font-black text-xl text-gray-800">{buyConfirm.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{buyConfirm.description}</p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-4 text-center mb-5">
                <p className="text-gray-600 text-sm font-medium">ひっかえコスト</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Star size={20} className="text-yellow-500" fill="currentColor" />
                  <span className="text-3xl font-black text-gray-800">{buyConfirm.pointsCost}pt</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  のこり: {currentProfile.pointsTotal - buyConfirm.pointsCost}pt
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBuyConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl text-base"
                >
                  やめる
                </button>
                <button
                  onClick={() => handleBuy(buyConfirm)}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black py-3.5 rounded-2xl text-base shadow-md active:scale-95"
                >
                  ゲット！
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
