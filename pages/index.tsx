// pages/index.tsx
import { useEffect, useState, useRef, useCallback } from "react"
import { useAccount, useWriteContract } from "wagmi"
import { PhysicsEngine } from "@/lib/physics/PhysicsEngine"
import { AnimationController } from "@/lib/animation/AnimationController"
import { soundManager } from "@/lib/audio/SoundManager"
import { Fighter } from "@/components/Fighter"
import { PunchingBag, checkBagHit } from "@/components/PunchingBag"
import { CombatController } from "@/components/CombatController"
import { GameUI } from "@/components/GameUI"
import chogPunchABI from "@/lib/chogPunchABI.json"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import confetti from "canvas-confetti"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  } | null>(null)

  const [stage, setStage] = useState<"home" | "play" | "victory" | "defeat">("home")
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [playerEnergy, setPlayerEnergy] = useState(100)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes

  // Physics and animation refs
  const physicsEngineRef = useRef<PhysicsEngine | null>(null)
  const animationControllerRef = useRef<AnimationController | null>(null)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const comboTimeoutRef = 

  // Load Farcaster user context
  useEffect(() => {
    ;(async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk")
        const ctx = await sdk.context
        if (ctx?.user) setFarcasterUser(ctx.user)
      } catch (e) {
  }, [])

  // Initialize physics and animation
  useEffect(() => {
    if (stage === "play" && !physicsEngineRef.current) {
      // Create physics engine

      // Create fighter and punching bag
      physicsEngine.createFighter(200, 400)
      physicsEngine.createPunchingBag(window.innerWidth - 200, 300)
      physicsEngine.start()

      // Start ambient sound
      soundManager.fadeIn('ambient', 2000)

      // Start game loop

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (physicsEngineRef.current) {
  // Game timer
  useEffect(() => {
    if (stage === "play" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameEnd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [stage, timeLeft])

  // Low health warning
  useEffect(() => {
    if (playerHealth < 30 && playerHealth > 0) {
      soundManager.play('low_health')
    } else {
      soundManager.stop('low_health')
    }
  }, [playerHealth])
    // Playanimation

    // Get damage and energy cost
    const moveData: Record<string, { damage: number; energy: number; range: number }> = {
      punch1: { damage: 5, energy: 5, range: 100 },
      punch2: { damage: 8, energy: 8, range: 110 },
      kick1: { damage: 10, energy: 10, range: 120 },
      kick2: { damage: 12, energy: 12, range: 130 },
      uppercut: { damage: 15, energy: 30, range: 100 },
      roundhouse: { damage: 20, energy: 50, range: 150 }
    }

    const data = moveData[move] || { damage: 5, energy: 5, range: 100 }

    // Check energy
    if (playerEnergy < data.energy) {
      soundManager.play('whoosh')
      return
    }

    // Consume energy
    setPlayerEnergy(prev => Math.max(0, prev - data.energy))

    // Check hit
    const fighter = physicsEngineRef.current.getBody('fighter')
    if (fighter && bagRef.current) {
      const hit = checkBagHit(
        physicsEngineRef.current,
        fighter.body.position,
        data.range,
        data.damage * (1 + combo * 0.1), // Combo multiplier
        (x, y, damage) => {
          bagRef.current.createHitEffect(x, y, damage)
          soundManager.playImpact(damage)
          
          // Update score and combo
          setScore(prev => prev + Math.floor(damage * 10))
          setCombo(prev => {
            const newCombo = prev + 1
            if (newCombo > maxCombo) setMaxCombo(newCombo)
            soundManager.playCombo(newCombo)
            return newCombo
          })

          // Reset combo timeout

      if (!hit) {
        soundManager.play('whoosh')
      }
    }
  }, [combo, maxCombo, playerEnergy])

  const handleMove = useCallback((direction: 'left' | 'right') => {
    if (!physicsEngineRef.current) return
    const fighter = physicsEngineRef.current.getBody('fighter')
    if (fighter) {
      const force = direction === 'right' ? 0.005 : -0.005
      Matter.Body.applyForce(fighter.body, fighter.body.position, { x: force, y: 0 })
    }
  }, []

  const handleGameEnd = () => {
    const victory = score >= 1000
    setStage(victory ? "victory" : "defeat")
    soundManager.play(victory ? 'victory' : 'defeat')
    
      {/* Home Screen */}
      <AnimatePresence>
        {stage === "home" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             CHOG FIGHTER
              </motion.h1>
              
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-bold px-12 py-6 rounded-lg shadow-2xl hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("play")}
              >
                START FIGHT
              </motion.button>

              <motion.div
                className="mt-12 text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm">Use touch gestures or keyboard to fight</p>
                <p className="text-xs mt-2">
                  built by{" "}
                  <a
                    href="https://farcaster.xyz/doteth"
                    target="_blank"
                    rel="noreferrer"

          <CombatController
            onAttack={handleAttack}
            onBlock={handleBlock}
            onMove={handleMove}
            onJump={handleJump}
            comboProgress={animationControllerRef.current.getComboProgress()}
          />

      {/* Victory/Defeat Screen */}
      <AnimatePresence>
        {(stage === "victory" || stage === "defeat") && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.h1
                className={`text-6xl md:text-8xl font-bold mb-8 ${
                  stage === "victory" ? "text-yellow-400" : "text-red-500"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {stage === "victory" ? "VICTORY!" : "DEFEAT!"}
              </motion.h1>

              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
