// pages/index.tsx
import { useEffect, useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import Chog from "@/components/Chog"
export default function Home() {
    fid: number

  // 1) Load Farcaster user context on mount
      }
    })()
  }, [])

  // 2) reset anim when stage changes
  useEffect(() => {
    if (stage === "home") setAnim("idle")
    setHits(h => Math.min(h + 1, 20))
  }

  const handleClaim = async () => {
    if (!address) return
    try {
      await writeContractAsync({
        abi: chogPunchABI,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        functionName: "submitScore",
        args: [20],
      })
      // backend picks up UserEligible event and sends 1 MON
      setClaimed(true)
  // If Farcaster context not loaded yet, show nothing (Farcaster will hide splash for us)
  if (farcasterUser === null) return null

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/gym-bg.png')" }}
    >
      {/* Top-left back */}
        >
          ← Back
        </button>
      )}

      {/* Home screen */}
      {stage === "home" && (
        <>
          <button
          >
          )}
        </>
      )}
    </div>
  )
}
