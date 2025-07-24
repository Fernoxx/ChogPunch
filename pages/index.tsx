import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { base } from 'wagmi/chains'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const CONTRACT_ADDRESS = "0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df"

const ABI = [
  {
    "inputs": [],
    "name": "signUp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export default function Home() {
  const { address, isConnected } = useAccount()
  const [hitCount, setHitCount] = useState(0)
  const [claimed, setClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [anim, setAnim] = useState('idle')
  const { writeContractAsync } = useWriteContract()

  const handleHit = (action: string) => {
    if (claimed) return
    setHitCount(prev => prev + 1)
    setAnim(action)
    setTimeout(() => setAnim('idle'), 400) // Reset to idle after animation
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await writeContractAsync({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'signUp',
        chainId: base.id
      })
      setClaimed(true)
    } catch (e) {
      console.error("❌ Claim failed", e)
    }
    setClaiming(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F3E8FF]">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">🥊 ChogPunch</h1>

      {/* Game Arena */}
      <div className="relative w-80 h-80 bg-gradient-to-b from-purple-100 to-purple-200 rounded-xl shadow-2xl flex items-center justify-center mb-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Chog Character */}
        <div className="relative z-10">
          <Image
            src={`/chog-${anim}.png`}
            alt="Chog"
            width={240}
            height={240}
            className={`transition-all duration-300 ${
              anim === 'punch' ? 'transform translate-x-2' :
              anim === 'kick' ? 'transform translate-y-1' :
              anim === 'push' ? 'transform scale-105' : ''
            }`}
            onError={() => {
              // Fallback to emoji if image not found
              console.log('Image not found, using fallback')
            }}
          />
        </div>

        {/* Punching Bag (if needed) */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className={`w-16 h-24 bg-red-600 rounded-lg shadow-lg transition-all duration-300 ${
            anim !== 'idle' ? 'transform rotate-6 scale-95' : ''
          }`}>
            <div className="w-full h-2 bg-gray-800 rounded-t-lg"></div>
            <div className="w-full h-20 bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center">
              <div className="w-12 h-1 bg-white/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hit Counter */}
      <div className="mb-6 text-center">
        <div className="text-3xl font-bold text-purple-800 mb-2">{hitCount} / 20</div>
        <div className="text-purple-600">Hits to unlock MON reward</div>
      </div>

      {/* Game Controls */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={() => handleHit('punch')}
          className="w-20 h-20 text-lg font-bold bg-red-500 hover:bg-red-600"
          disabled={claimed}
        >
          👊<br/>Punch
        </Button>
        <Button 
          onClick={() => handleHit('kick')}
          className="w-20 h-20 text-lg font-bold bg-orange-500 hover:bg-orange-600"
          disabled={claimed}
        >
          🦵<br/>Kick
        </Button>
        <Button 
          onClick={() => handleHit('push')}
          className="w-20 h-20 text-lg font-bold bg-yellow-500 hover:bg-yellow-600"
          disabled={claimed}
        >
          🤚<br/>Push
        </Button>
      </div>

      {/* Wallet Connection Status */}
      {!isConnected && (
        <div className="text-center mb-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
          <p className="text-yellow-800 font-medium">
            Connect your wallet to claim MON rewards!
          </p>
        </div>
      )}

      {/* Claim Button */}
      {isConnected && hitCount >= 20 && !claimed && (
        <Button
          variant="success"
          className="w-full max-w-xs h-12 text-lg font-bold"
          disabled={claiming}
          onClick={handleClaim}
        >
          {claiming ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Claiming...
            </>
          ) : (
            '🪙 Claim 1 MON'
          )}
        </Button>
      )}

      {/* Success Message */}
      {claimed && (
        <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300 max-w-xs">
          <p className="text-green-800 font-bold text-lg">
            ✅ Successfully Claimed!
          </p>
          <p className="text-green-600 text-sm mt-1">
            1 MON will be sent to your wallet
          </p>
        </div>
      )}

      {/* Game Instructions */}
      <div className="mt-8 text-center max-w-md">
        <h2 className="text-lg font-bold text-purple-800 mb-2">How to Play</h2>
        <p className="text-purple-600 text-sm">
          Hit the punching bag 20 times using Punch, Kick, or Push moves. 
          Once you reach 20 hits, you can claim 1 MON token (limited to first 100 players).
        </p>
      </div>
    </main>
  )
}