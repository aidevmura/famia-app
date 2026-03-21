'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import BottomNav from '@/components/BottomNav'
import { CATEGORY_LABELS, RARITY_LABELS } from '@/lib/avatar-items'
import type { AvatarItem } from '@/types'

export default function ChildAvatarPage() {
  const { currentProfile, state, dispatch, getEquippedItems, getOwnedItems, equipItem } = useStore()
  const [activeCategory, setActiveCategory] = useState<string>('hair')

  if (!currentProfile || currentProfile.role !== 'child') return null

  const ownedItems = getOwnedItems(currentProfile.id)
  const categories = Object.keys(CATEGORY_LABELS)
  const itemsInCategory = ownedItems.filter(item => item.category === activeCategory)
  const equippedIds = state.userAvatarItems
    .filter(uai => uai.userId === currentProfile.id && uai.isEquipped)
    .map(uai => uai.itemId)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-purple-100 to-pink-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-black mb-4">👗 アバタールーム</h1>

          {/* Avatar showcase */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 inline-block shadow-lg">
              <FamiaAvatar config={currentProfile.avatarConfig} size={120} />
            </div>
          </motion.div>

          <p className="text-purple-200 mt-3 text-sm font-medium">
            {currentProfile.name}ちゃんのアバター
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 mt-5">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {categories.map(cat => {
            const label = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]
            const hasItems = ownedItems.some(i => i.category === cat)
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                } ${!hasItems ? 'opacity-40' : ''}`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Items grid */}
        {itemsInCategory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl">
            <div className="text-5xl mb-3">🛍️</div>
            <p className="text-gray-500 font-bold">このカテゴリのアイテムはまだないよ</p>
            <p className="text-gray-400 text-sm mt-1">ショップでゲットしよう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {itemsInCategory.map((item, i) => {
              const isEquipped = equippedIds.includes(item.id)
              const rarity = RARITY_LABELS[item.rarity]
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => equipItem(item, currentProfile.id)}
                  className={`rounded-2xl p-4 text-left transition-all active:scale-95 border-2 ${
                    isEquipped
                      ? 'bg-purple-100 border-purple-400 shadow-md'
                      : 'bg-white border-gray-100 shadow-sm hover:border-purple-200'
                  }`}
                >
                  {/* Item preview using avatar */}
                  <div className="flex justify-center mb-3">
                    <div className={`rounded-xl p-2 ${isEquipped ? 'bg-purple-200' : 'bg-gray-50'}`}>
                      <span className="text-3xl">
                        {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]?.split(' ')[0] ?? '✨'}
                      </span>
                    </div>
                  </div>

                  <p className={`font-bold text-sm leading-tight ${isEquipped ? 'text-purple-800' : 'text-gray-800'}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs font-medium mt-1 ${rarity.color}`}>
                    {rarity.label}
                  </p>

                  {isEquipped && (
                    <div className="mt-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full w-fit">
                      ✓ つけてる
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Shop hint */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
          <p className="text-yellow-800 font-bold text-sm">もっとアイテムが ほしい？</p>
          <p className="text-yellow-600 text-xs mt-1">ショップでポイントと こうかんしよう！</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
