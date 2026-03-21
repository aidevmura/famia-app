'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PICTURE_PASSWORD_EMOJIS } from '@/lib/utils'

interface PicturePasswordProps {
  onComplete: (sequence: string[]) => void
  length?: number
  label?: string
}

export default function PicturePassword({
  onComplete,
  length = 3,
  label = 'どうぶつを えらんでね',
}: PicturePasswordProps) {
  const [selected, setSelected] = useState<string[]>([])

  const handleSelect = (emoji: string) => {
    const next = [...selected, emoji]
    setSelected(next)
    if (next.length === length) {
      setTimeout(() => {
        onComplete(next)
        setSelected([])
      }, 300)
    }
  }

  const handleClear = () => setSelected([])

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-600 font-bold text-center">{label}</p>

      {/* Selected sequence */}
      <div className="flex gap-3 h-14 items-center justify-center">
        {Array.from({ length }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 rounded-2xl border-3 flex items-center justify-center text-2xl ${
              selected[i]
                ? 'bg-purple-100 border-purple-400'
                : 'bg-gray-50 border-gray-200 border-dashed'
            }`}
            animate={{ scale: selected[i] ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            {selected[i] || ''}
          </motion.div>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-3 gap-3">
        {PICTURE_PASSWORD_EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(emoji)}
            className="w-16 h-16 rounded-2xl bg-white shadow-md border-2 border-purple-100 flex items-center justify-center text-3xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Clear button */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleClear}
            className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <X size={14} />
            もう一度
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
