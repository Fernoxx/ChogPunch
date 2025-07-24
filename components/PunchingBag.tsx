'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function PunchingBag() {
  const [hits, setHits] = useState(0)
  const [currentMove, setCurrentMove] = useState('idle')
  const [isAnimating, setIsAnimating] = useState(false)

  // Load hits from localStorage on component mount
  useEffect(() => {
    const savedHits = localStorage.getItem('chogHits') || '0'
    setHits(parseInt(savedHits))
  }, [])

  // Save hits to localStorage whenever hits change
  useEffect(() => {
    localStorage.setItem('chogHits', hits.toString())
  }, [hits])

  const handleMove = (moveType: string) => {
    if (isAnimating) return
    
    setCurrentMove(moveType)
    setIsAnimating(true)
    setHits(prev => prev + 1)
    
    // Reset to idle after animation
    setTimeout(() => {
      setCurrentMove('idle')
      setIsAnimating(false)
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
              // Fallback to a placeholder if GIF not found
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

      {/* Hit Counter */}
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-800 mb-2">{hits} / 20</div>
        <div className="text-purple-600">Hits to unlock MON reward</div>
      </div>

      {/* Combat Controls */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => handleMove('punch')}
          disabled={isAnimating}
          className="w-20 h-20 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          👊<br/>Punch
        </button>
        <button
          onClick={() => handleMove('kick')}
          disabled={isAnimating}
          className="w-20 h-20 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          🦵<br/>Kick
        </button>
        <button
          onClick={() => handleMove('push')}
          disabled={isAnimating}
          className="w-20 h-20 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
          🤚<br/>Push
        </button>
      </div>
    </div>
  )
}