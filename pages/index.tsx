import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import ChogFighter from "@/components/ChogFighter"
import Joystick from "@/components/Joystick"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [hits, setHits] = useState(0)
  const [showJoystick, setShowJoystick] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const handleHit = () => setHits(h => Math.min(h + 1, 20))

  const handleClaim = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/claim`, {
      method: "POST",
      body: JSON.stringify({ address }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) setClaimed(true)
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/gym-bg.png')" }}>
      {!showJoystick && (
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black font-bold px-6 py-3 rounded"
          onClick={() => setShowJoystick(true)}
        >
          Play
        </button>
      )}
      <div className="absolute bottom-2 right-4">
        <ConnectButton />
      </div>
      <div className="absolute bottom-2 left-4 text-xs text-white">
        <a href="https://farcaster.xyz/doteth" target="_blank">built by @doteth</a>
      </div>
      <ChogFighter hits={hits} />
      {showJoystick && <Joystick onDirection={handleHit} />}
      {hits >= 20 && !claimed && (
        <button
          onClick={handleClaim}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-6 py-3 rounded"
        >
          Claim 1 MON
        </button>
      )}
    </div>
) }
