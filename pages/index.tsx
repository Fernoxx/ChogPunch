import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import Joystick from "@/components/Joystick"
import Chog from "@/components/Chog"
import PunchingBag from "@/components/PunchingBag"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [stage, setStage] = useState<"home"|"play">("home")
  const [hits, setHits] = useState(0)
  const [anim, setAnim] = useState<"idle"|"kick"|"punch"|"push">("idle")
  const [claimed, setClaimed] = useState(false)

  // Idle sway before play
  useEffect(() => {
    setAnim("idle")
  }, [stage])

  const handleDirection = (dir: "kick"|"punch"|"push") => {
    setAnim(dir)
    setHits(h => Math.min(h+1, 20))
  }

  const handleClaim = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/claim`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ address }),
    })
    if (res.ok) setClaimed(true)
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/gym-bg.png')" }}>
      {/* Back button */}
      {stage==="play" && (
        <button
          className="absolute top-4 left-4 bg-white/50 text-black px-3 py-1 rounded"
          onClick={() => setStage("home")}
        >
          ← Back
        </button>
      )}

      {/* Home Screen */}
      {stage === "home" && (
        <>
          <button
            className="absolute inset-0 m-auto w-32 h-12 bg-white text-black font-bold rounded"
            onClick={() => setStage("play")}
          >
            Play
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white">
            built by <a href="https://farcaster.xyz/doteth" className="underline">@doteth</a>
          </div>
        </>
      )}

      {/* Play Screen */}
      {stage === "play" && (
        <>
          <Chog anim={anim} />
          <PunchingBag anim={anim} />
          <Joystick onDirection={handleDirection} />

          {hits >= 20 && !claimed && (
            <button
              className="absolute inset-0 m-auto w-40 h-12 bg-green-600 text-white font-bold rounded"
              onClick={handleClaim}
            >
              Claim 1 MON
            </button>
          )}
        </>
      )}
    </div>
  )
}
