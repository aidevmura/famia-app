'use client'

import type { TodayTaskPointsSummary } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Variant = 'tasksHeader' | 'homeHeader' | 'homeCard' | 'shop' | 'avatar' | 'parentCard'

/**
 * きょうのタスクで得たポイント・のこりで取れるポイントのヒント（複数画面で共通）
 */
export default function TodayTaskPointsPanel({
  summary,
  variant,
  showCompletionBadge = false,
}: {
  summary: TodayTaskPointsSummary
  variant: Variant
  /** tasksHeader 用: ✅ n/m おわり */
  showCompletionBadge?: boolean
}) {
  const { earnedToday, remainingMin, remainingMax, completedCount, totalCount } = summary
  const hasIncomplete = remainingMin > 0
  const allDoneTasks = totalCount > 0 && !hasIncomplete

  const earnedBadgeClass =
    variant === 'shop'
      ? 'bg-white/40 text-yellow-950 text-xs'
      : variant === 'homeCard' || variant === 'parentCard'
      ? 'bg-yellow-100 text-yellow-900 text-xs'
      : 'bg-yellow-400 text-yellow-900 text-xs sm:text-sm'

  const earnedBadge = (
    <div className={cn('rounded-xl px-2.5 py-1 font-bold inline-flex items-center gap-1 flex-wrap', earnedBadgeClass)}>
      <span>⭐</span>
      <span>
        きょう <span className="font-black">{earnedToday}pt</span> ゲット済み
      </span>
    </div>
  )

  const rangeHighlight =
    variant === 'homeCard' || variant === 'parentCard'
      ? 'text-orange-600'
      : 'text-yellow-200'

  const remainingInner = hasIncomplete ? (
    <>
      のこりをぜんぶやったら、あと{' '}
      <span className={cn('font-black', rangeHighlight)}>
        {remainingMin === remainingMax ? `${remainingMin}pt` : `${remainingMin}〜${remainingMax}pt`}
      </span>{' '}
      もらえるよ
      {variant === 'tasksHeader' && remainingMin !== remainingMax && (
        <span className="block text-purple-200 text-[11px] mt-1 font-medium">
          （ふつうに「やった！」なら {remainingMin}pt、全部「ひとりでできた！」なら {remainingMax}pt）
        </span>
      )}
      {variant !== 'tasksHeader' && remainingMin !== remainingMax && (
        <span
          className={cn(
            'block text-[10px] mt-0.5 leading-tight',
            variant === 'homeCard' || variant === 'parentCard' ? 'text-gray-500' : 'opacity-80'
          )}
        >
          （「やった！」{remainingMin}pt / ぜんぶ「ひとりでできた！」{remainingMax}pt）
        </span>
      )}
    </>
  ) : null

  const remainingBoxClass = cn(
    'rounded-2xl text-xs leading-snug font-bold',
    variant === 'tasksHeader' && 'bg-white/15 px-3 py-2.5 text-white',
    variant === 'homeHeader' && 'bg-white/20 px-2.5 py-2 text-white',
    variant === 'homeCard' && 'bg-purple-50 px-3 py-2.5 text-gray-800 border border-purple-100',
    variant === 'shop' && 'bg-white/25 px-3 py-2 text-white',
    variant === 'avatar' && 'bg-white/15 px-3 py-2.5 text-white max-w-md mx-auto',
    variant === 'parentCard' && 'bg-amber-50 px-3 py-2 text-gray-800 border border-amber-100'
  )

  const allDoneMessage =
    allDoneTasks && (variant === 'parentCard' ? (
      <p className="text-green-600 font-bold text-xs mt-1.5">🎉 きょうのタスクのポイントは ぜんぶゲット！</p>
    ) : (
      <p
        className={cn(
          'font-bold text-sm mt-2',
          variant === 'homeCard' ? 'text-green-600' : 'text-purple-100'
        )}
      >
        🎉 きょうのタスクのポイントは ぜんぶゲットしたよ！
      </p>
    ))

  if (variant === 'tasksHeader') {
    return (
      <>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {showCompletionBadge && (
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm font-bold">
              ✅ {completedCount}/{totalCount}こ おわり
            </div>
          )}
          {earnedBadge}
        </div>
        {hasIncomplete && <div className={cn(remainingBoxClass, 'mt-3')}>{remainingInner}</div>}
        {allDoneTasks && (
          <p className="mt-3 text-purple-100 text-sm font-bold">🎉 きょうのタスクのポイントは ぜんぶゲットしたよ！</p>
        )}
      </>
    )
  }

  if (variant === 'homeHeader') {
    return (
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {showCompletionBadge && totalCount > 0 && (
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold">
              ✅ {completedCount}/{totalCount}こ おわり
            </div>
          )}
          {earnedBadge}
        </div>
        {hasIncomplete && <div className={remainingBoxClass}>{remainingInner}</div>}
        {allDoneTasks && totalCount > 0 && (
          <p className="text-purple-100 text-xs font-bold">🎉 きょうのタスク ぜんぶ おわり！ポイントもぜんぶゲット！</p>
        )}
      </div>
    )
  }

  if (variant === 'homeCard') {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">{earnedBadge}</div>
        {hasIncomplete && <div className={remainingBoxClass}>{remainingInner}</div>}
        {allDoneTasks && allDoneMessage}
      </div>
    )
  }

  if (variant === 'shop') {
    return (
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {showCompletionBadge && totalCount > 0 && (
            <div className="bg-white/30 rounded-xl px-2.5 py-1 text-xs font-bold text-yellow-950">
              ✅ {completedCount}/{totalCount}こ おわり
            </div>
          )}
          {earnedBadge}
        </div>
        {hasIncomplete && <div className={remainingBoxClass}>{remainingInner}</div>}
        {allDoneTasks && totalCount > 0 && (
          <p className="text-yellow-100 text-xs font-bold">🎉 きょうのタスクのポイントは ぜんぶゲット！</p>
        )}
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-2">
          {showCompletionBadge && totalCount > 0 && (
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold">
              ✅ {completedCount}/{totalCount}こ おわり
            </div>
          )}
          {earnedBadge}
        </div>
        {hasIncomplete && <div className={remainingBoxClass}>{remainingInner}</div>}
        {allDoneTasks && totalCount > 0 && (
          <p className="text-purple-100 text-xs font-bold text-center">🎉 きょうのポイント ぜんぶゲット！</p>
        )}
      </div>
    )
  }

  // parentCard
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">{earnedBadge}</div>
      {hasIncomplete && <div className={remainingBoxClass}>{remainingInner}</div>}
      {allDoneTasks && allDoneMessage}
    </div>
  )
}
