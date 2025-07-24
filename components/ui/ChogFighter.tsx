'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ChogFighterProps {
  hits: number
  onPunch: () => void
}

export default function ChogFighter({ hits, onPunch }: ChogFighterProps) {
  const [isPunching, setIsPunching] = useState(false)
  const [currentMove, setCurrentMove] = useState('idle')

  const handlePunch = () => {
    if (isPunching || hits >= 20) return
    
    setIsPunching(true)
    setCurrentMove('punch')
    onPunch()
    
    setTimeout(() => {
      setCurrentMove('idle')
      setIsPunching(false)
    }, 600)
  }

  const handleKick = () => {
    if (isPunching || hits >= 20) return
    
    setIsPunching(true)
    setCurrentMove('kick')
    onPunch()
    
    setTimeout(() => {
      setCurrentMove('idle')
      setIsPunching(false)
    }, 600)
  }

  const handlePush = () => {
    if (isPunching || hits >= 20) return
    
    setIsPunching(true)
    setCurrentMove('push')
    onPunch()
    
    setTimeout(() => {
      setCurrentMove('idle')
      setIsPunching(false)
    }, 600)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Arena */}
      <div className="relative w-80 h-80 bg-gradient-to-b from-purple-100 to-purple-200 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Chog Character */}
        <div className="relative z-10">
          <Image
            src={`/sprites/chog-${currentMove}.gif`}
            alt={`Chog ${currentMove}`}
            width={200}
            height={200}
            className={`transition-all duration-300 cursor-pointer ${
              currentMove === 'punch' ? 'transform translate-x-2' :
              currentMove === 'kick' ? 'transform translate-y-1' :
              currentMove === 'push' ? 'transform scale-105' : ''
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/sprites/chog-placeholder.png'
            }}
          />
        </div>

        {/* Punching Bag */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className={`w-16 h-24 bg-red-600 rounded-lg shadow-lg transition-all duration-300 ${
            currentMove !== 'idle' ? 'transform rotate-6 scale-95' : ''
          }`}>
            <div className="w-full h-2 bg-gray-800 rounded-t-lg"></div>
            <div className="w-full h-20 bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center">
              <div className="w-12 h-1 bg-white/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Controls */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handlePunch}
          disabled={isPunching || hits >= 20}
          className="w-20 h-20 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          👊<br/>Punch
        </button>
        <button
          onClick={handleKick}
          disabled={isPunching || hits >= 20}
          className="w-20 h-20 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          🦵<br/>Kick
        </button>
        <button
          onClick={handlePush}
          disabled={isPunching || hits >= 20}
          className="w-20 h-20 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          🤚<br/>Push
        </button>
      </div>
    </div>
  )
}