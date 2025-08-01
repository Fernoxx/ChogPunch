// pages/index.tsx
import { useEffect, useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import Chog from "@/components/Chog"
import PunchingBag from "@/components/PunchingBag"
import Joystick from "@/components/Joystick"
export default function Home() {
    fid: number

  // 1) Load Farcaster user context on mount
      }
    })()
  }, [])

  // 2) reset anim when stage changes
  useEffect(() => {
    if (stage === "home") setAnim("idle")
  }, [stage])

  const handleDirection = (dir: "kick" | "punch" | "push") => {
    setAnim(dir)
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
      {stage === "play" && (
        <button
          className="absolute top-4 left-4 bg-white/60 text-black px-2 py-1 rounded"
          onClick={() => setStage("home")}
        >
          ← Back
        </button>
      )}

      {/* Home screen */}
      {stage === "home" && (
        <>
          <button
          >
            Play
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white">
            built by{" "}
            <a
              href="https://farcaster.xyz/doteth"
              target="_blank"
            >
              @doteth
            </a>
          </div>
        </>
      )}

      {/* Play screen */}
      {stage === "play" && (
        <>
          <Chog anim={anim} />
          <PunchingBag anim={anim} />
          <Joystick onDirection={handleDirection} />

          {hits >= 20 && !claimed && (
            <button
            >
              Claim 1 MON
            </button>
          )}
        </>
      )}
    </div>
  )
}
