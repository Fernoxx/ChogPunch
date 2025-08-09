// pages/index.tsx
import { useEffect, useState } from "react"

export default function Home() {
  const [" | "play">("home")
  const [farcasterUser, setFarcasterUser] = useState<{ fid: number; username?: string; displayName?: string; pfpUrl?: string } | null>(null)

  useEffec
      <AnimatePresence>
      e="absolute inset-0 flex items-center justify-center z-50"
              >
      {stage === "play" && (
        <PlatformerGame />
      )}
  )
}
