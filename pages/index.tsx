// pages/index.tsx
import { useEffect, useState } from "react"
import { useAccount, useContractWrite } from "wagmi"
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

  const [stage, setStage] = useState<"home" | "play">("home")
  const [hits, setHits] = useState(0)
  const [anim, setAnim] = useState<"idle" | "kick" | "punch" | "push">("idle")
  const [claimed, setClaimed] = useState(false)

  // 1) Load Farcaster user context on mount
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
      await writeAsync({
        args: [20],
      })
      // backend picks up UserEligible event and sends 1 MON
      setClaimed(true)
    } catch (e) {
      console.error("Claim tx failed:", e)
    }
  }

  // If Farcaster context not loaded yet, show nothing (Farcaster will hide splash for us)
  if (farcasterUser === null) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      {/* Brick wall pattern background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(0,0,0,0.1) 20px,
            rgba(0,0,0,0.1) 22px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(0,0,0,0.1) 40px,
            rgba(0,0,0,0.1) 42px
          )`
        }}
      />

      {/* Top-left back button for play screen */}
      {stage === "play" && (
        <button
          className="absolute top-4 left-4 bg-white/80 text-black px-4 py-2 rounded-lg font-bold shadow-lg z-10"
          onClick={() => setStage("home")}
        >
          ← Back
        </button>
      )}

      {/* Home screen */}
      {stage === "home" && (
        <div className="flex flex-col items-center justify-center min-h-screen relative">
          {/* CHOG GYM Title */}
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-black text-orange-400 tracking-wider drop-shadow-lg">
              CHOG
            </h1>
            <h1 className="text-6xl md:text-7xl font-black text-orange-400 tracking-wider drop-shadow-lg -mt-2">
              GYM
            </h1>
          </div>

          {/* Character and Punching Bag Section */}
          <div className="flex items-center justify-center mb-12 relative w-full max-w-4xl">
            {/* Chog Character */}
            <div className="relative mr-8">
              <div className="w-64 h-64 relative">
                {/* Character body */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Spiky hair */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-8 bg-indigo-800 transform rotate-12 absolute -left-6"></div>
                    <div className="w-4 h-10 bg-indigo-800 transform -rotate-12 absolute -left-2"></div>
                    <div className="w-4 h-12 bg-indigo-800 absolute left-2"></div>
                    <div className="w-4 h-10 bg-indigo-800 transform rotate-12 absolute left-6"></div>
                    <div className="w-4 h-8 bg-indigo-800 transform rotate-45 absolute left-10"></div>
                  </div>
                  
                  {/* Head */}
                  <div className="w-20 h-20 bg-yellow-100 rounded-full border-2 border-black relative z-10">
                    {/* Eyes */}
                    <div className="absolute top-6 left-4 w-3 h-3 bg-black rounded-full"></div>
                    <div className="absolute top-6 right-4 w-3 h-3 bg-black rounded-full"></div>
                    {/* Angry eyebrows */}
                    <div className="absolute top-4 left-3 w-5 h-1 bg-black transform -rotate-12"></div>
                    <div className="absolute top-4 right-3 w-5 h-1 bg-black transform rotate-12"></div>
                    {/* Nose */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>
                    {/* Mouth */}
                    <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black rounded-full"></div>
                    {/* Cheek blush */}
                    <div className="absolute top-8 left-1 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                    <div className="absolute top-8 right-1 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                  </div>
                  
                  {/* Orange shirt */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-orange-500 rounded-lg border-2 border-black">
                    <div className="text-white font-bold text-xs text-center mt-2">
                      <div>CHOG</div>
                      <div>GYM</div>
                    </div>
                  </div>
                  
                  {/* Arms with boxing gloves */}
                  <div className="absolute top-20 -left-8 w-8 h-16 bg-yellow-100 rounded-lg border-2 border-black transform -rotate-12"></div>
                  <div className="absolute top-20 -right-8 w-8 h-16 bg-yellow-100 rounded-lg border-2 border-black transform rotate-12"></div>
                  <div className="absolute top-32 -left-12 w-6 h-6 bg-red-600 rounded-full border-2 border-black"></div>
                  <div className="absolute top-32 -right-12 w-6 h-6 bg-red-600 rounded-full border-2 border-black"></div>
                  
                  {/* Black shorts */}
                  <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-black rounded-lg"></div>
                  
                  {/* Legs */}
                  <div className="absolute top-40 left-6 w-6 h-16 bg-yellow-100 rounded-lg border-2 border-black"></div>
                  <div className="absolute top-40 right-6 w-6 h-16 bg-yellow-100 rounded-lg border-2 border-black"></div>
                  
                  {/* Red boots */}
                  <div className="absolute top-52 left-4 w-10 h-6 bg-red-600 rounded-lg border-2 border-black"></div>
                  <div className="absolute top-52 right-4 w-10 h-6 bg-red-600 rounded-lg border-2 border-black"></div>
                </div>
              </div>
            </div>

            {/* Punching Bag */}
            <div className="relative ml-8">
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
              <div className="w-24 h-48 bg-gradient-to-b from-red-600 to-red-700 rounded-b-full border-2 border-black relative">
                {/* Impact effect */}
                <div className="absolute -right-4 top-16 w-8 h-8 text-white font-bold text-2xl">💥</div>
                
                {/* Control panel */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg p-2 border-2 border-black">
                  <div className="text-white text-xs font-bold mb-1 text-center">KICK</div>
                  <div className="w-8 h-8 bg-gray-600 rounded-full border border-gray-400 mb-2"></div>
                  <div className="text-white text-xs font-bold mb-1 text-center">PUSH</div>
                  <div className="w-8 h-8 bg-gray-600 rounded-full border border-gray-400 mb-2"></div>
                  <div className="text-white text-xs font-bold mb-1 text-center">PUNCH</div>
                </div>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <button
            className="bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-3xl px-16 py-6 rounded-2xl border-4 border-orange-700 shadow-2xl transform hover:scale-105 transition-transform duration-200 hover:shadow-3xl"
            onClick={() => setStage("play")}
          >
            PLAY
          </button>

          {/* Built by credit */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm">
            built by{" "}
            <a
              href="https://farcaster.xyz/doteth"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-orange-400"
            >
              @doteth
            </a>
          </div>
        </div>
      )}

      {/* Play screen */}
      {stage === "play" && (
        <div className="min-h-screen flex items-center justify-center relative">
          {/* Game interface - simplified for play mode */}
          <div className="text-center">
            <div className="text-white text-2xl mb-4">Hits: {hits}/20</div>
            
            <div className="flex space-x-4 mb-8">
              <button 
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
                onClick={() => handleDirection("kick")}
              >
                KICK
              </button>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
                onClick={() => handleDirection("push")}
              >
                PUSH
              </button>
              <button 
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold"
                onClick={() => handleDirection("punch")}
              >
                PUNCH
              </button>
            </div>

            {hits >= 20 && !claimed && (
              <button
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-xl"
                onClick={handleClaim}
              >
                Claim 1 MON
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
