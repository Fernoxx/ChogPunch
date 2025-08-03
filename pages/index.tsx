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
  const [farcasterUser, setFarcasterUser] = useState<{
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
  const [specialMovesReady, setSpecialMovesReady] = useState<string[]>([])

  // Physics and animation refs
  const physicsEngineRef = useRef<PhysicsEngine | null>(null)
  const animationControllerRef = useRef<AnimationController | null>(null)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const comboTimeoutRef = useRef<NodeJS.Timeout>(

  // Load Farcaster user context
  useEffect(() => {
    ;(async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk")
        const ctx = await sdk.context
        if (ctx?.user) setFarcasterUser(ctx.user)
      } catch (e) {
        console.error("Farcaster context error:", e)
      }

  // Initialize physics and animation
  useEffect(() => {
    if (stage === "play" && !physicsEngineRef.current) {
      // Create physics engine
      const physicsEngine = new PhysicsEngine()
      physicsEngineRef.current = physicsEngine

      // Create fighter and punching bag
      physicsEngine.createFighter(200, 400)
      physicsEngine.createPunchingBag(window.innerWidth - 200, 300)
      physicsEngine.start()

      // Create animation controller
      const animationController = new AnimationController(physicsEngine)
      animationControllerRef.current = animationController

      // Start game loop
      const gameLoop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp
        const deltaTime = timestamp - lastTimeRef.current
        lastTimeRef.current = timestamp

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (physicsEngineRef.current) {
        physicsEngineRef.current.destroy()
        physicsEngineRef.current = null
      }
      animationControllerRef.current = null

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
      return () => clearTimeout(timer)
    }
  }, [stage, timeLeft])

  // Energy regeneration
  useEffect(() => {
    if (stage === "play") {
      const interval = setInterval(() => {
        setPlayerEnergy(prev => Math.min(100, prev + 2))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [stage])

  // Special moves availability
  useEffect(() => {
    const moves: string[] = []
    if (playerEnergy >= 30) moves.push('uppercut')
    if (playerEnergy >= 50) moves.push('roundhouse')
    if (playerEnergy >= 80 && combo >= 5) moves.push('special'))

  // Low health warning
  useEffect(() => {
    if (playerHealth < 30 && playerHealth > 0) {
      soundManager.play('low_health')
    } else {
      soundManager.stop('low_health')
    }
  }, [playerHealth])

  const handleAttack = useCallback((move: string) => {
    if (!animationControllerRef.current || !physicsEngineRef.current) return

    // Play animation
    animationControllerRef.current.play(move as any)

    // Get damage and energy cost
    const moveData: Record<string, { damage: number; energy: number; range: number }> = {
      punch1: { damage: 5, energy: 5, range: 100 },
      punch2: { damage: 8, energy: 8, range: 110 },
      kick1: { damage: 10, energy: 10, range: 120 },
      kick2: { damage: 12, energy: 12, range: 130 },
      uppercut: { damage: 15, energy: 30, range: 100 },

    const data = moveData[move] || { damage: 5, energy: 5, range: 100 }

    // Check energy
    if (playerEnergy < data.energy) {
      soundManager.play('whoosh')
      return
    }

    // Consume energy
    setPlayerEnergy(prev => Math.max(0, prev - data.energy))

    // Play sound
    if (move.includes('punch')) {
      soundManager.playRandomPitch(move === 'punch1' ? 'punch_light' : 'punch_heavy')
    } else if (move.includes('kick')) {
      soundManager.playRandomPitch(move === 'kick1' ? 'kick_light' : 'kick_heavy')
    } else if (move === 'uppercut') {
      soundManager.play('uppercut')
    } else if (move === 'roundhouse') {
      soundManager.play('roundhouse')
    }

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
          if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current)
          comboTimeoutRef.current = setTimeout(() => {
            setCombo(0)
            soundManager.play('combo_break')
          }, 2000)
        }
      )

      if (!hit) {
        soundManager.play('whoosh')
      }
    }
  }, [combo, maxCombo, playerEnergy])

  const handleBlock = useCallback(() => {
    if (!animationControllerRef.current) return
    animationControllerRef.current.play('block')
    soundManager.play('block')
  }, [])

  const handleMove = useCallback((direction: 'left' | 'right') => {
    if (!physicsEngineRef.current) return
    const fighter = physicsEngineRef.current.getBody('fighter')
    if (fighter) {
      const force = direction === 'right' ? 0.005 : -0.005
      Matter.Body.applyForce(fighter.body, fighter.body.position, { x: force, y: 0 })
    }
  }, [])

  const handleJump = useCallback(() => {
    if (!physicsEngineRef.current || playerEnergy < 20) return
    const fighter = physicsEngineRef.current.getBody('fighter')
    if (fighter) {
      Matter.Body.applyForce(fighter.body, fighter.body.position, { x: 0, y: -0.1 })
      setPlayerEnergy(prev => prev - 20)
    }
  }, [playerEnergy])

  const handleGameEnd = () => {
    const victory = score >= 1000
    setStage(victory ? "victory" : "defeat")
    soundManager.play(victory ? 'victory' : 'defeat')
    
    if (victory) {
      confetti({
        particleCount: 100,
        spread: 70,
      })
    }
  }

  const handleClaim = async () => {
    if (!address || claimed) return
    try {
      await writeContractAsync({
        abi: chogPunchABI,
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        functionName: "submitScore",
        args: [score],
      })
      setClaimed(true)
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4ade80', '#22c55e', '#16a34a']
      })
    } catch (e) {
      console.error("Claim tx failed:", e)
    }
  }

  const resetGame = () => {
    setStage("home")
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setPlayerHealth(100)
    setPlayerEnergy(100)
    setTimeLeft(120)
    setClaimed(false)
  }

  if (farcasterUser === null) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/gym-bg.png"
          alt="Gym Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Home Screen */}
      <AnimatePresence>
        {stage === "home" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-8"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.8)' }}
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
                    className="text-yellow-400 underline"
                  >
                    @doteth
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Screen */}
      {stage === "play" && physicsEngineRef.current && animationControllerRef.current && (
        <>
          <Fighter
            physicsEngine={physicsEngineRef.current}
            animationController={animationControllerRef.current}
            x={200}
            y={400}
          />
          
          <PunchingBag
            ref={bagRef}
            physicsEngine={physicsEngineRef.current}
            onHit={(damage) => {
              // Additional hit logic if needed
            }}
          />

          <CombatController
            onAttack={handleAttack}
            onBlock={handleBlock}
            onMove={handleMove}
            onJump={handleJump}
            comboProgress={animationControllerRef.current.getComboProgress()}
          />

          <GameUI
            playerHealth={playerHealth}
            playerMaxHealth={100}
            playerEnergy={playerEnergy}
            playerMaxEnergy={100}
            score={score}
            combo={combo}
            maxCombo={maxCombo}
            timeLeft={timeLeft}
            playerName={farcasterUser?.username || "Fighter"}
            playerAvatar={farcasterUser?.pfpUrl}
            specialMovesReady={specialMovesReady}
          />
        </>
      )}

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
                transition={{ type: "spring", stiffness: 100 }}
              >
                {stage === "victory" ? "VICTORY!" : "DEFEAT!"}
              </motion.h1>

              <div className="bg-black/60 rounded-lg p-8 mb-8">
                <p className="text-2xl text-white mb-4">Final Score: {score.toLocaleString()}</p>
                <p className="text-xl text-gray-300 mb-2">Max Combo: x{maxCombo}</p>
                {stage === "victory" && score >= 1000 && !claimed && isConnected && (
                  <motion.button
                    className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-8 py-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClaim}
                  >
                    Claim 1 MON Reward
                  </motion.button>
                )}
              </div>

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
