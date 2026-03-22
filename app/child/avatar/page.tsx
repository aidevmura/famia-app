'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useStore } from '@/lib/store'
import FamiaAvatar from '@/components/FamiaAvatar'
import BottomNav from '@/components/BottomNav'
import TodayTaskPointsPanel from '@/components/TodayTaskPointsPanel'
import { CATEGORY_LABELS, RARITY_LABELS } from '@/lib/avatar-items'
import { getTodayTaskPointsSummary } from '@/lib/utils'

type TabType = 'dressup' | 'collection'

export default function ChildAvatarPage() {
  const { currentProfile, state, getOwnedItems, equipItem, getTodayTasks, isTaskCompletedToday } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>('dressup')
  const [activeCategory, setActiveCategory] = useState<string>('hair')

  if (!currentProfile || currentProfile.role !== 'child') return null

  const ownedItems = getOwnedItems(currentProfile.id)
  const categories = Object.keys(CATEGORY_LABELS)
  const itemsInCategory = ownedItems.filter(item => item.category === activeCategory)
  const equippedIds = state.userAvatarItems
    .filter(uai => uai.userId === currentProfile.id && uai.isEquipped)
    .map(uai => uai.itemId)

  // もちもの一覧用：取得日時つきで全アイテムを取得
  const userAvatarItems = state.userAvatarItems.filter(uai => uai.userId === currentProfile.id)
  const collectionItems = userAvatarItems.map(uai => {
    const item = state.avatarItems.find(i => i.id === uai.itemId)
    return { uai, item }
  }).filter(({ item }) => item !== undefined)

  const todayTasks = getTodayTasks(currentProfile.id)
  const pointsSummary = getTodayTaskPointsSummary(
    state,
    currentProfile.id,
    todayTasks,
    isTaskCompletedToday
  )

  return (
    <div className="min-h-dvh bg-gradient-to-b from-purple-100 to-pink-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-black mb-3">👗 アバタールーム</h1>

          {/* Avatar showcase */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 inline-block shadow-lg">
              <FamiaAvatar config={currentProfile.avatarConfig} size={110} />
            </div>
          </motion.div>

          <p className="text-purple-200 mt-2 text-sm font-medium">
            {currentProfile.name}ちゃんのアバター
          </p>

          {/* コレクション数バッジ */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <span className="text-sm font-black">🎁 {ownedItems.length}こ</span>
            <span className="text-xs text-purple-200">もってる！</span>
          </div>

          <TodayTaskPointsPanel summary={pointsSummary} variant="avatar" showCompletionBadge />
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="max-w-lg mx-auto px-5 mt-5">
        <div className="bg-white rounded-2xl p-1 flex gap-1 shadow-sm border border-purple-100 mb-5">
          <button
            onClick={() => setActiveTab('dressup')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'dressup'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-400 hover:text-purple-400'
            }`}
          >
            👗 きせかえ
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all relative ${
              activeTab === 'collection'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-400 hover:text-purple-400'
            }`}
          >
            🎁 もちもの
            {ownedItems.length > 0 && (
              <span className={`ml-1 text-xs font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'collection' ? 'bg-white/30 text-white' : 'bg-purple-100 text-purple-600'
              }`}>
                {ownedItems.length}
              </span>
            )}
          </button>
        </div>

        {/* ===== きせかえタブ ===== */}
        {activeTab === 'dressup' && (
          <>
            {/* カテゴリタブ */}
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

            {/* アイテムグリッド */}
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

            {/* ショップへのヒント */}
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
              <p className="text-yellow-800 font-bold text-sm">もっとアイテムが ほしい？</p>
              <p className="text-yellow-600 text-xs mt-1">ショップでポイントと こうかんしよう！</p>
            </div>
          </>
        )}

        {/* ===== もちものタブ ===== */}
        {activeTab === 'collection' && (
          <>
            {collectionItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-gray-600 font-black text-lg">まだアイテムがないよ</p>
                <p className="text-gray-400 text-sm mt-2">タスクをクリアしてポイントを<br />ためてショップへ行こう！</p>
              </div>
            ) : (
              <>
                {/* サマリー */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-purple-100">
                    <div className="text-2xl font-black text-purple-600">{collectionItems.length}</div>
                    <div className="text-xs text-gray-500 font-bold mt-0.5">ぜんぶ</div>
                  </div>
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-purple-100">
                    <div className="text-2xl font-black text-green-600">
                      {collectionItems.filter(({ uai }) => uai.isEquipped).length}
                    </div>
                    <div className="text-xs text-gray-500 font-bold mt-0.5">つけてる</div>
                  </div>
                  <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-purple-100">
                    <div className="text-2xl font-black text-yellow-500">
                      {collectionItems.filter(({ item }) => item?.rarity !== 'common').length}
                    </div>
                    <div className="text-xs text-gray-500 font-bold mt-0.5">レア以上</div>
                  </div>
                </div>

                {/* アイテム一覧 */}
                <div className="space-y-3">
                  {collectionItems.map(({ uai, item }, i) => {
                    if (!item) return null
                    const rarity = RARITY_LABELS[item.rarity]
                    const isEquipped = uai.isEquipped
                    const acquiredDate = format(new Date(uai.acquiredAt), 'M月d日', { locale: ja })
                    const categoryLabel = CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS] ?? ''
                    const categoryEmoji = categoryLabel.split(' ')[0] ?? '✨'

                    return (
                      <motion.div
                        key={uai.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border-2 transition-all ${
                          isEquipped ? 'border-purple-300 bg-purple-50' : 'border-gray-100'
                        }`}
                      >
                        {/* アイコン */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                          isEquipped ? 'bg-purple-200' : 'bg-gray-100'
                        }`}>
                          {categoryEmoji}
                        </div>

                        {/* 情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-gray-800 text-sm">{item.name}</p>
                            {isEquipped && (
                              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                ✓ つけてる
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-bold mt-0.5 ${rarity.color}`}>{rarity.label}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            🎁 {acquiredDate} にゲット！
                          </p>
                        </div>

                        {/* 装備ボタン */}
                        <button
                          onClick={() => equipItem(item, currentProfile.id)}
                          className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 ${
                            isEquipped
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          {isEquipped ? 'はずす' : 'つける'}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-5 text-center">
                  <p className="text-xs text-gray-400 font-medium">
                    🌟 アイテムをもっとあつめよう！
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
