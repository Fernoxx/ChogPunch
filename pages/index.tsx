// pages/index.tsx
import { useState } from "react"

export default function Home() {
  const [stage, setStage] = useState<"home" | "play">("home")
  const [hits, setHits] = useState(0)

  const handleClaim = async () => {
    console.log("Claiming reward...")
    alert("Claimed 1 MON!")
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: `url('/gym-bg.png') center/cover no-repeat`,
      }}
    >
      {/* Home Screen */}
      {stage === "home" && (
        <>
          <button
            onClick={() => setStage("play")}
            className="absolute inset-0 m-auto w-32 h-12 bg-white text-black font-bold rounded text-lg flex items-center justify-center"
          >
            Play
          </button>

          <a
            href="https://farcaster.xyz/doteth"
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white underline"
          >
            built by @doteth
          </a>
        </>
      )}

      {/* Play Screen */}
      {stage === "play" && (
        <>
          {/* Back button */}
          <button
            onClick={() => setStage("home")}
            className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded"
          >
            ← Back
          </button>

          {/* Simple character */}
          <div className="absolute left-12 bottom-12 w-48 h-48 bg-blue-500 rounded-full flex items-center justify-center text-white text-6xl">
            🥊
          </div>

          {/* Simple punching bag */}
          <div className="absolute right-12 top-20 w-32 h-64 bg-red-500 rounded-lg flex items-center justify-center text-white text-4xl">
            🥊
          </div>

          {/* Punch button */}
          <button
            onClick={() => setHits(h => Math.min(h + 1, 20))}
            className="absolute bottom-16 right-16 w-32 h-32 bg-yellow-500 rounded-full text-black font-bold text-lg"
          >
            PUNCH<br/>({hits}/20)
          </button>

          {/* Claim button */}
          {hits >= 20 && (
            <button
              onClick={handleClaim}
              className="absolute inset-0 m-auto w-40 h-12 bg-green-600 text-white font-bold rounded text-lg flex items-center justify-center"
            >
              Claim 1 MON
            </button>
          )}
        </>
      )}
    </div>
  )
}
