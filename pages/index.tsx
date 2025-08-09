// pages/index.tsx
import { useEffect, useState } from "react"
import { PlatformerGame } from "../components/PlatformerGame"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Home() {
  const [stage, setStage] = useState<"home" | "play">("home")
  const [farcasterUser, setFarcasterUser] = useState<{ fid: number; username?: string; displayName?: string; pfpUrl?: string } | null>(null)

  useEffect(() => {
    setFarcasterUser({ fid: 0, username: "Player", displayName: "Player" } as any)
  }, [])

  if (farcasterUser === null) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/gym-bg.png" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Home Screen */}
      <AnimatePresence>
        {stage === "home" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-8"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}
              >
                CHOG PLATFORMER
              </motion.h1>
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("play")}
              >
                START GAME
              </motion.button>
              <div className="mt-6 text-white/70 text-sm">A smooth pixel-art side scroller. A/D or ◀▶ to move, W/Space or ⤴ to jump.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Screen */}
      {stage === "play" && (
        <PlatformerGame />
      )}
  )
}
