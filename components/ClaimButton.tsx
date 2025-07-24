'use client'
import { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import ABI from '@/lib/chogABI.json'

const CONTRACT_ADDRESS = '0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df'

export default function ClaimButton() {
  const { address } = useAccount()
  const [eligible, setEligible] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()

  useEffect(() => {
    // Check if user is eligible based on hits
    const hits = localStorage.getItem('chogHits') || '0'
    setEligible(parseInt(hits) >= 20)
    
    // Check if user has already claimed
    const hasClaimed = localStorage.getItem(`claimed_${address}`) === 'true'
    setClaimed(hasClaimed)
  }, [address])

  const claim = async () => {
    if (!address) return
    
    setIsLoading(true)
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: 'signUp',
        args: [],
      })
      console.log('Transaction:', tx)
      setClaimed(true)
      localStorage.setItem(`claimed_${address}`, 'true')
    } catch (err) {
      console.error('Error claiming:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!eligible || claimed) return null

  return (
    <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl shadow-lg max-w-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-purple-800 mb-2">🎉 Congratulations!</h3>
        <p className="text-purple-600">You&apos;ve completed 20 hits!</p>
      </div>
      
      <button
        onClick={claim}
        disabled={isLoading || !address}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Claiming...
          </div>
        ) : (
          'Claim 1 MON 🪙'
        )}
      </button>
      
      <p className="text-sm text-purple-500 mt-2">
        ⚠️ Limited to first 100 players
      </p>
    </div>
  )
}