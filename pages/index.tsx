// pages/index.tsx
import { useEffect, useState } from "react"
import Chog from "@/components/Chog"
import PunchingBag from "@/components/PunchingBag"
import Joystick from "@/components/Joystick"

export default function Home() {
  const [farcasterUser, setFarcasterUser] = useState<{
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [stage, setStage] = useState<"home" | "play">("home")
  const [hits, setHits] = useState(0)
  const [anim, setAnim] = useState<"idle" | "kick" | "punch" | "push" | "gasping" | "homeAnimation">("idle")
  const [showClaimButton, setShowClaimButton] = useState(false)
  const [isClaimingInProgress, setIsClaimingInProgress] = useState(false)

  // Load Farcaster user context on mount
  useEffect(() => {
    const loadFarcasterContext = async () => {
      try {
        // Only try to load Farcaster SDK if we're in a Farcaster frame
        if (typeof window !== 'undefined' && window.location.href.includes('farcaster')) {
          const { sdk } = await import("@farcaster/miniapp-sdk")
          const ctx = await sdk.context
          if (ctx?.user) {
            setFarcasterUser(ctx.user)
          } else {
            // If no user context, create a mock user for testing
            setFarcasterUser({ fid: 12345, username: "testuser", displayName: "Test User" })
          }
        } else {
          // For regular browsers, create a mock user
          setFarcasterUser({ fid: 12345, username: "testuser", displayName: "Test User" })
        }
      } catch (e) {
        console.error("Farcaster context error:", e)
        // Fallback: create a mock user so the app still works
        setFarcasterUser({ fid: 12345, username: "testuser", displayName: "Test User" })
      } finally {
        setIsLoading(false)
      }
    }

    loadFarcasterContext()
  }, [])

  // Reset animation when stage changes
  useEffect(() => {
    if (stage === "home") setAnim("idle")
    if (stage === "play") setAnim("gasping") // Set gasping animation on play screen
  }, [stage])

  // Show claim button when hits reach 20
  useEffect(() => {
    if (hits >= 20 && !showClaimButton) {
      setShowClaimButton(true)
    }
  }, [hits, showClaimButton])

  const handleDirection = (dir: "kick" | "punch" | "push") => {
    setAnim(dir)
    setHits(h => h + 1) // Remove the limit, just count hits
    // Reset to gasping after animation
    setTimeout(() => setAnim("gasping"), 500)
  }

  const handleClaim = async () => {
    if (isClaimingInProgress) return
    
    setIsClaimingInProgress(true)
    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Hide claim button after successful transaction
      setShowClaimButton(false)
      // Reset hits counter
      setHits(0)
      alert("Successfully claimed 1 MON! (Contract integration pending)")
    } catch (e) {
      console.error("Claim tx failed:", e)
      alert("Claim failed! Please try again.")
    } finally {
      setIsClaimingInProgress(false)
    }
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading CHOG GYM...</div>
      </div>
    )
  }

  // Show error screen if user context failed
  if (!farcasterUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-white text-xl">Failed to load. Please refresh the page.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Purple brick background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-purple-800 via-purple-900 to-purple-950"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.2) 0px,
              rgba(0,0,0,0.2) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,0.2) 0px,
              rgba(0,0,0,0.2) 1px,
              transparent 1px,
              transparent 120px
            )
          `
        }}
      />

      {/* Chain decoration in top right for play screen */}
      {stage === "play" && (
        <div className="absolute top-0 right-10 w-8 h-40 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg"
               style={{
                 background: "repeating-linear-gradient(0deg, #666 0px, #666 8px, #444 8px, #444 16px)"
               }}
          />
        </div>
      )}

      {/* CHOG GYM Title - Only on home screen */}
      {stage === "home" && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <h1 className="text-6xl font-black text-yellow-500 tracking-wider drop-shadow-2xl">
            CHOG GYM
          </h1>
        </div>
      )}

      {/* Top-left back button for play screen */}
      {stage === "play" && (
        <button
          className="absolute top-6 left-6 bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-gray-600"
          onClick={() => setStage("home")}
        >
          ← Back
        </button>
      )}

      {/* Home screen */}
      {stage === "home" && (
        <>
          {/* Character and punching bag for home screen */}
          <Chog anim="homeAnimation" />
          <PunchingBag anim="homeAnimation" />
          
          {/* Play button in exact center */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white text-xl font-bold px-12 py-4 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 border-2 border-green-300"
            onClick={() => setStage("play")}
          >
            PLAY
          </button>
          
          {/* Built by @doteth at bottom */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-300">
            built by{" "}
            <a
              href="https://farcaster.xyz/doteth"
              target="_blank"
              rel="noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
            >
              @doteth
            </a>
          </div>
        </>
      )}

      {/* Play screen */}
      {stage === "play" && (
        <>
          <Chog anim={anim} />
          <PunchingBag anim={anim} />
          <Joystick onDirection={handleDirection} />

          {/* Claim button - appears after 20 hits */}
          {showClaimButton && (
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-teal-400 to-teal-600 hover:from-teal-300 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-600 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 border-2 border-teal-300 z-50 disabled:cursor-not-allowed disabled:scale-100"
              onClick={handleClaim}
              disabled={isClaimingInProgress}
            >
              {isClaimingInProgress ? "Claiming..." : "Claim 1 MON"}
            </button>
          )}
        </>
      )}
    </div>
  )
}
