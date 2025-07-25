// pages/index.tsx
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAccount, useContractWrite } from "wagmi"
import Joystick from "../components/Joystick"
import ClaimButton from "../components/ClaimButton"
import chogPunchABI from "@/lib/chogPunchABI.json"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { writeAsync } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: chogPunchABI,
    functionName: "submitScore",
  })
  
  const [farcasterUser, setFarcasterUser] = useState<{
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  } | null>(null)
  
  const [hits, setHits] = useState(0)
  const [showJoystick, setShowJoystick] = useState(false)
  const [animation, setAnimation] = useState("idle")
  const [claimed, setClaimed] = useState(false)

  // Load Farcaster user context on mount
  useEffect(() => {
    ;(async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk")
        const ctx = await sdk.context
        if (ctx?.user) setFarcasterUser(ctx.user)
      } catch (e) {
        console.error("Farcaster context error:", e)
      }
    })()
  }, [])

  useEffect(() => {
    setAnimation("idle")
  }, [])

  const handleHit = (action: string) => {
    if (hits >= 20 || claimed) return
    setAnimation(action)
    setHits(prev => prev + 1)
  }

  const handleClaim = async () => {
    if (!address) return
    try {
      await writeAsync({
        args: [20],
      })
      setClaimed(true)
    } catch (e) {
      console.error("Claim tx failed:", e)
    }
  }

  // If Farcaster context not loaded yet, show nothing (Farcaster will hide splash for us)
  if (farcasterUser === null) return null

  return (
    <div className="relative w-full h-screen bg-[#3c0b5c] overflow-hidden">
      <div className="absolute top-6 left-6 z-10">
        {showJoystick && (
          <button onClick={() => setShowJoystick(false)} className="text-white text-sm">← Back</button>
        )}
      </div>

      <div className="absolute bottom-3 w-full text-center z-10">
        <Link href="https://farcaster.xyz/doteth" target="_blank" className="text-white text-xs underline">built by @doteth</Link>
      </div>

      {!showJoystick && (
        <button onClick={() => setShowJoystick(true)} className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-orange-500 text-white rounded-full text-lg shadow-xl">
          PLAY
        </button>
      )}

      <div className="absolute inset-0 z-0">
        <Image src="/gym-bg.png" alt="Gym Background" layout="fill" objectFit="cover" priority />
      </div>

      <motion.img
        src="/chog-punch.png"
        alt="Chog"
        className="absolute bottom-12 left-10 w-[200px] z-10"
        animate={animation === "idle" ? { scale: [1, 1.03, 1] } : { x: [0, 10, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "loop" }}
      />

      {/* CSS-based punching bag since we don't have the image */}
      <motion.div
        className="absolute bottom-12 right-10 w-[130px] h-[200px] z-10"
        animate={animation === "idle" ? { y: [0, -3, 0] } : { x: [0, -5, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatType: "loop" }}
      >
        {/* Chain */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12 w-1 h-12 bg-gray-600">
          <div className="absolute top-0 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
          <div className="absolute top-2 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
          <div className="absolute top-4 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
          <div className="absolute top-6 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
          <div className="absolute top-8 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
          <div className="absolute top-10 -left-1 w-3 h-2 bg-gray-700 rounded"></div>
        </div>
        
        {/* Punching bag body */}
        <div className="w-24 h-48 bg-gradient-to-b from-red-600 to-red-700 rounded-b-full border-2 border-black relative mx-auto">
          {/* Impact effect */}
          {animation !== "idle" && (
            <div className="absolute -right-4 top-16 w-8 h-8 text-white font-bold text-2xl">💥</div>
          )}
          
          {/* Control panel */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg p-2 border-2 border-black">
            <div className="text-white text-xs font-bold mb-1 text-center">KICK</div>
            <div className="w-8 h-8 bg-gray-600 rounded-full border border-gray-400 mb-2"></div>
            <div className="text-white text-xs font-bold mb-1 text-center">PUSH</div>
            <div className="w-8 h-8 bg-gray-600 rounded-full border border-gray-400 mb-2"></div>
            <div className="text-white text-xs font-bold mb-1 text-center">PUNCH</div>
          </div>
        </div>
      </motion.div>

      {showJoystick && <Joystick onMove={handleHit} hits={hits} />}

      {!claimed && hits >= 20 && (
        <ClaimButton onClaim={handleClaim} />
      )}
    </div>
  )
}
