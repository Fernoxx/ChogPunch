// pages/index.tsx
import { useEffect, useState } from "react"
import { PlatformerGame } from "../components/PlatformerGame"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Home() {
  const [stage, setStage] = useState<"home" | "play">("home")

  useEffect(() => {
    setFarcasterUser({ fid: 0, username: "Player", displayName: "Player" } as any)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <ditext-2xl font-bold px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-transform"
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
      )}
    </div>
  )
}
