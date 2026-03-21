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
          {CONFETTI.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl pointer-events-none"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${Math.random() * 30}%`,
              }}
              initial={{ y: -50, opacity: 0, rotate: 0 }}
              animate={{
                y: window.innerHeight,
                opacity: [0, 1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 0.5,
                ease: 'linear',
              }}
            >
              {emoji}
            </motion.div>
          ))}

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
