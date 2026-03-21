'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CelebrationModalProps {
  isOpen: boolean
  points: number
  message: string
  onClose: () => void
}

const CONFETTI = ['⭐', '🌟', '✨', '🎉', '🎊', '💫', '🌈', '🎀', '💖']

export default function CelebrationModal({ isOpen, points, message, onClose }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Confetti */}
          {CONFETTI.map((emoji, i) => {
            const positions = [
              { l: 12, t: 5, r: 180, dur: 2.2, d: 0.0 },
              { l: 25, t: 10, r: 90, dur: 2.5, d: 0.1 },
              { l: 38, t: 3, r: 270, dur: 2.1, d: 0.2 },
              { l: 50, t: 8, r: 45, dur: 2.8, d: 0.0 },
              { l: 63, t: 15, r: 315, dur: 2.3, d: 0.3 },
              { l: 75, t: 5, r: 135, dur: 2.6, d: 0.1 },
              { l: 88, t: 12, r: 225, dur: 2.0, d: 0.2 },
              { l: 20, t: 20, r: 60, dur: 2.4, d: 0.0 },
              { l: 55, t: 25, r: 300, dur: 2.7, d: 0.4 },
            ]
            const p = positions[i] ?? positions[0]
            return (
              <motion.div
                key={i}
                className="absolute text-3xl pointer-events-none"
                style={{ left: `${p.l}%`, top: `${p.t}%` }}
                initial={{ y: -50, opacity: 0, rotate: 0 }}
                animate={{ y: 700, opacity: [0, 1, 1, 0], rotate: p.r }}
                transition={{ duration: p.dur, delay: p.d, ease: 'linear' }}
              >
                {emoji}
              </motion.div>
            )
          })}

          {/* Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 mx-6 max-w-xs w-full text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
              className="bg-yellow-400 text-white rounded-2xl px-6 py-3 mb-4 inline-block shadow-lg"
            >
              <span className="text-3xl font-black">+{points}pt</span>
            </motion.div>

            <p className="text-gray-700 font-bold text-lg">{message}</p>
            <p className="text-gray-400 text-sm mt-2">タップで閉じる</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
