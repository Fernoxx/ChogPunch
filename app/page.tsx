'use client'
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { submitScore, checkIfClaimed } from "@/utils/contract"
import ChogFighter from "@/components/ui/ChogFighter"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [hits, setHits] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    if (address) {
      checkIfClaimed(address).then(setClaimed)
    }
    // Load hits from localStorage
    const savedHits = localStorage.getItem('chogHits') || '0'
    setHits(parseInt(savedHits))
  }, [address])

  // Save hits to localStorage whenever hits change
  useEffect(() => {
    localStorage.setItem('chogHits', hits.toString())
  }, [hits])

  const handleHit = () => {
    if (hits < 20) setHits(hits + 1)
  }

  const handleClaim = async () => {
    if (!address) return
    setClaiming(true)
    const success = await submitScore(address, 20)
    if (success) {
      setClaimed(true)
      localStorage.setItem(`claimed_${address}`, 'true')
    }
    setClaiming(false)
  }

  return (
    <main className="min-h-screen bg-[#F3E8FF] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">🥊 CHOGPUNCH</h1>
      
      <div className="mb-6">
        <ConnectButton />
      </div>

      <div className="my-6">
        <ChogFighter hits={hits} onPunch={handleHit} />
        <p className="mt-4 text-2xl font-bold text-purple-800">Hits: {hits}/20</p>
        
        {isConnected && hits >= 20 && !claimed && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {claiming ? "Claiming..." : "Claim 1 MON 🪙"}
          </button>
        )}
        
        {claimed && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
            <p className="text-green-800 font-bold text-lg">✅ You already claimed MON!</p>
            <p className="text-green-600 text-sm mt-1">Thank you for playing ChogPunch!</p>
          </div>
        )}

        {!isConnected && hits >= 20 && (
          <div className="mt-6 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <p className="text-yellow-800 font-bold">Connect your wallet to claim MON!</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center max-w-md">
        <h2 className="text-lg font-bold text-purple-800 mb-2">How to Play</h2>
        <p className="text-purple-600 text-sm">
          Hit the punching bag 20 times using Punch, Kick, or Push moves. 
          Once you reach 20 hits, connect your wallet and claim 1 MON token (limited to first 100 players).
        </p>
      </div>
    </main>
  )
}