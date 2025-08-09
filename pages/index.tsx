// pages/index.tsx
import { useEffect, useState } from "react"

export default function Home() {
  const [" | "play">("home")
  const [farcasterUser, setFarcasterUser] = useState<{ fid: number; username?: string; displayName?: string; pfpUrl?: string } | null>(null)

  useEffec
      <AnimatePresence>
      e="absolute inset-0 flex items-center justify-center z-50"
              >
                START GAME
              </motion.button>
              <div className="mt-6 text-white/70 text-sm">A smooth pixel-art side scroller. A/D or ◀▶ to move, W/Space or ⤴ to jump.</div>
  
      </AnimatePresence>

      {/* Game Screen */}
      {stage === "play" && (
        <PlatformerGame />
      )}
  )
}
