// pages/index.tsx
import { useEffect, useState } from "react"
import Chog from "@/components/Chog"
import PunchingBag from "@/components/PunchingBag"
import Joystick from "@/components/Joystick"

export default function Home() {
  const [stage, setStage] = useState<"home" | "play">("home")
  const [hits, setHits] = useState(0)
  const [anim, setAnim] = useState<"idle" | "kick" | "punch" | "push">("idle")
  const [claimed, setClaimed] = useState(false)

  // 2) reset anim when stage changes
  useEffect(() => {
    if (stage === "home") setAnim("idle")
  }, [stage])

  const handleDirection = (dir: "kick" | "punch" | "push") => {
    setAnim(dir)
    setHits(h => Math.min(h + 1, 20))
    
    // Reset animation after a short delay
    setTimeout(() => {
      setAnim("idle")
    }, 600)
  }

  const handleClaim = async () => {
    try {
      // Simulate claim functionality
      setClaimed(true)
    } catch (e) {
      console.error("Claim tx failed:", e)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden gym-environment">
      {/* Gym Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900"></div>
      
      {/* Floor */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600"></div>
      
      {/* Wall Text - CHOG GYM */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <div className="wall-text text-6xl font-black text-purple-300 opacity-80 tracking-wider">
          CHOG GYM
        </div>
      </div>

      {/* Gym Equipment Shadows */}
      <div className="absolute bottom-32 left-8 w-16 h-4 bg-black opacity-20 rounded-full blur-sm"></div>
      <div className="absolute bottom-32 right-8 w-12 h-4 bg-black opacity-20 rounded-full blur-sm"></div>

      {/* Top-left back */}
      {stage === "play" && (
        <button
          className="absolute top-4 left-4 bg-white/80 hover:bg-white text-purple-800 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 z-20"
          onClick={() => setStage("home")}
        >
          ← Back
        </button>
      )}

      {/* Home screen */}
      {stage === "home" && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-48 h-16 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-xl rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={() => setStage("play")}
            >
              START TRAINING
            </button>
          </div>
        </>
      )}

      {/* Play screen */}
      {stage === "play" && (
        <>
          {/* Score Display */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg font-bold text-xl z-20">
            Hits: {hits}/20
          </div>

          <Chog anim={anim} />
          <PunchingBag anim={anim} />
          <Joystick onDirection={handleDirection} />

          {hits >= 20 && !claimed && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <button
                className="w-48 h-16 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-xl rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={handleClaim}
              >
                CLAIM REWARD
              </button>
            </div>
          )}

          {claimed && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg z-30">
              Reward Claimed! 🏆
            </div>
          )}
        </>
      )}
    </div>
  )
}
