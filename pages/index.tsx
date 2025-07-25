// pages/index.tsx
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import Joystick from "../components/Joystick"
import ClaimButton from "../components/ClaimButton"

export default function Home() {
  const [hits, setHits] = useState(0)
  const [showJoystick, setShowJoystick] = useState(false)
  const [animation, setAnimation] = useState("idle")
  const [claimed, setClaimed] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [chogImageFailed, setChogImageFailed] = useState(false)

  useEffect(() => {
    setAnimation("idle")
    // Set images as loaded after a short delay to prevent white screen
    setTimeout(() => setImagesLoaded(true), 100)
  }, [])

  const handleHit = (action: string) => {
    if (hits >= 20 || claimed) return
    setAnimation(action)
    setHits(prev => prev + 1)
    
    // Reset animation after a short time
    setTimeout(() => setAnimation("idle"), 300)
  }

  const handleClaim = () => {
    setClaimed(true)
  }

  // Show loading screen until images are ready
  if (!imagesLoaded) {
    return (
      <div className="relative w-full h-screen bg-[#3c0b5c] overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">Loading CHOG GYM...</div>
      </div>
    )
  }

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

      {/* Gym-style purple wall background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/gym-bg.png" 
          alt="Gym Background" 
          layout="fill" 
          objectFit="cover" 
          priority
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* Shadow-Fight-style camera angle with chog character and punching bag facing each other */}
      <motion.div
        className="absolute bottom-10 left-[8%] w-[250px] z-10"
        animate={animation !== "idle" ? { scale: [1, 1.1, 1] } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!chogImageFailed && (
          <Image
            src="/chog-punch.png"
            alt="Chog Static"
            width={250}
            height={250}
            onError={() => {
              setChogImageFailed(true)
            }}
          />
        )}
        
        {/* CSS Fallback Character - only show when image fails */}
        {chogImageFailed && (
          <div className="w-[250px] h-[250px] relative">
            {/* Character body similar to our previous CSS version */}
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
        )}
      </motion.div>

      {/* CSS Punching Bag - always use CSS version for reliability */}
      <motion.div
        className="absolute bottom-10 right-[8%] w-[120px] h-[180px] z-10"
        animate={animation !== "idle" ? { x: [0, -10, 0] } : { y: [0, -2, 0] }}
        transition={{ duration: 0.3, repeat: animation === "idle" ? Infinity : 0, repeatType: "loop" }}
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
        <div className="w-20 h-40 bg-gradient-to-b from-red-600 to-red-700 rounded-b-full border-2 border-black relative mx-auto">
          {/* Impact effect */}
          {animation !== "idle" && (
            <div className="absolute -right-4 top-16 w-8 h-8 text-white font-bold text-2xl">💥</div>
          )}
          
          {/* Control panel */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-lg p-1 border-2 border-black">
            <div className="text-white text-xs font-bold mb-1 text-center">KICK</div>
            <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-400 mb-1"></div>
            <div className="text-white text-xs font-bold mb-1 text-center">PUSH</div>
            <div className="w-6 h-6 bg-gray-600 rounded-full border border-gray-400 mb-1"></div>
            <div className="text-white text-xs font-bold mb-1 text-center">PUNCH</div>
          </div>
        </div>
      </motion.div>

      {/* Realistic joystick control */}
      {showJoystick && <Joystick onMove={handleHit} hits={hits} />}

      {/* Claim 1 MON button logic */}
      {!claimed && hits >= 20 && (
        <ClaimButton onClaim={handleClaim} />
      )}
    </div>
  )
}
