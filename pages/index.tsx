import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useAccount, useWriteContract } from "wagmi"
import { encodeFunctionData } from "viem"
import chogPunchABI from "../lib/chogPunchABI.json"

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const [mode, setMode] = useState<"home" | "play">("home")
  const [punchCount, setPunchCount] = useState(0)
  const [joystickDir, setJoystickDir] = useState<"up" | "left" | "right" | null>(null)

  const bagRef = useRef<HTMLDivElement>(null)
  const chogRef = useRef<HTMLDivElement>(null)

  // Idle animation when on home
  useEffect(() => {
    if (mode === "home" && bagRef.current) {
      bagRef.current.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(-5deg)" }, { transform: "rotate(0deg)" }],
        { duration: 1500, iterations: Infinity }
      )
    }
  }, [mode])

  const handleMove = (dir: "up" | "left" | "right") => {
    setJoystickDir(dir)
    setPunchCount(prev => prev + 1)

    // Simple visual animation simulation
    if (chogRef.current && bagRef.current) {
      const chog = chogRef.current
      const bag = bagRef.current

      const anim = dir === "up" ? "kick" : dir === "left" ? "push" : "punch"

      chog.classList.remove("animate-kick", "animate-push", "animate-punch")
      bag.classList.remove("animate-sway")

      void chog.offsetWidth // reset animation
      chog.classList.add(`animate-${anim}`)
      bag.classList.add("animate-sway")
    }
  }

  const claimReward = async () => {
    if (!address) return alert("Connect wallet first")
    try {
      const tx = await writeContractAsync({
        abi: chogPunchABI,
        address: "0xa1d54f8a426b3cd07625627071e70c8f76e49806", // your Base contract
        functionName: "submitScore", // or your claim function
        args: [20],
      })
      console.log("Claimed:", tx)
    } catch (err) {
      console.error("Claim error", err)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white">
      {/* Background with brick pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              rgba(0,0,0,0.1) 20px,
              rgba(0,0,0,0.1) 22px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(0,0,0,0.1) 40px,
              rgba(0,0,0,0.1) 42px
            )`
          }} 
        />
      </div>
      
      {/* CHOG GYM Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-6xl font-bold text-orange-400 tracking-wider text-center">
          CHOG GYM
        </h1>
      </div>

      {mode === "home" && (
        <>
          <div ref={bagRef} className="absolute right-24 top-24 w-20 h-40 bg-red-600 rounded-lg opacity-80 shadow-xl" />
          <div ref={chogRef} className="absolute left-24 bottom-12 w-40 h-40 bg-purple-700 rounded-full" />

          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-full text-lg font-bold z-10"
            onClick={() => setMode("play")}
          >
            Play
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-70">
            Built by{" "}
            <a href="https://farcaster.xyz/doteth" target="_blank" rel="noreferrer" className="underline">
              @doteth
            </a>
          </div>
        </>
      )}

      {mode === "play" && (
        <>
          <button
            className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded"
            onClick={() => setMode("home")}
          >
            ← Back
          </button>

          <div className="absolute left-12 bottom-20">
            <div className="w-28 h-28 bg-gray-600 rounded-full relative">
              <div
                className="absolute w-10 h-10 bg-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 touch-none"
                onTouchStart={(e) => {
                  const startY = e.touches[0].clientY
                  const startX = e.touches[0].clientX

                  const move = (e: TouchEvent) => {
                    const dy = e.touches[0].clientY - startY
                    const dx = e.touches[0].clientX - startX

                    if (Math.abs(dx) > Math.abs(dy)) {
                      handleMove(dx > 0 ? "right" : "left")
                    } else {
                      handleMove(dy < 0 ? "up" : "left")
                    }

                    document.removeEventListener("touchmove", move)
                  }

                  document.addEventListener("touchmove", move)
                }}
              />
            </div>
          </div>

          <div ref={bagRef} className="absolute right-24 top-24 w-20 h-40 bg-red-600 rounded-lg shadow-lg" />
          <div ref={chogRef} className="absolute left-24 bottom-12 w-40 h-40 bg-purple-700 rounded-full" />

          {punchCount >= 20 && (
            <button
              onClick={claimReward}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 px-6 py-3 text-black font-bold rounded-full z-10"
            >
              Claim 1 MON
            </button>
          )}
        </>
      )}
    </div>
  )
}