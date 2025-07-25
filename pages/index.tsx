import { useEffect, useRef, useState } from "react"
import { useAccount, useWriteContract } from "wagmi"
import chogPunchABI from "../lib/chogPunchABI.json"

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  const [mode, setMode] = useState<"home" | "play">("home")
  const [punchCount, setPunchCount] = useState(0)
  const [chogAnimation, setChogAnimation] = useState<"idle" | "kick" | "punch" | "push">("idle")
  const [bagAnimation, setBagAnimation] = useState<"idle" | "sway">("idle")
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isJoystickActive, setIsJoystickActive] = useState(false)
  const [actionText, setActionText] = useState("")

  const joystickRef = useRef<HTMLDivElement>(null)
  const chogRef = useRef<HTMLDivElement>(null)
  const bagRef = useRef<HTMLDivElement>(null)

  // Home page idle animations
  useEffect(() => {
    if (mode === "home") {
      const interval = setInterval(() => {
        const randomAction = Math.random()
        if (randomAction < 0.33) {
          setChogAnimation("punch")
          setBagAnimation("sway")
        } else if (randomAction < 0.66) {
          setChogAnimation("kick") 
          setBagAnimation("sway")
        } else {
          setChogAnimation("push")
          setBagAnimation("sway")
        }
        
        setTimeout(() => {
          setChogAnimation("idle")
          setBagAnimation("idle")
        }, 600)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [mode])

  // Play mode gasping and slight movement
  useEffect(() => {
    if (mode === "play") {
      const interval = setInterval(() => {
        if (chogAnimation === "idle") {
          setBagAnimation("sway")
          setTimeout(() => setBagAnimation("idle"), 300)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [mode, chogAnimation])

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setIsJoystickActive(true)

    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const rect = joystickRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
        const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY
        
        const deltaX = clientX - centerX
        const deltaY = clientY - centerY
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const maxDistance = 40
        
        const limitedX = distance > maxDistance ? (deltaX / distance) * maxDistance : deltaX
        const limitedY = distance > maxDistance ? (deltaY / distance) * maxDistance : deltaY
        
        setJoystickPosition({ x: limitedX, y: limitedY })
        
        // Determine action based on position
        if (Math.abs(limitedY) > Math.abs(limitedX)) {
          if (limitedY < -20) {
            setActionText("KICK")
            triggerAction("kick")
          }
        } else {
          if (limitedX < -20) {
            setActionText("PUSH")
            triggerAction("push")
          } else if (limitedX > 20) {
            setActionText("PUNCH")
            triggerAction("punch")
          }
        }
      }
    }

    const handleEnd = () => {
      setIsJoystickActive(false)
      setJoystickPosition({ x: 0, y: 0 })
      setActionText("")
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }

    handleMove(e as any)
    
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)
  }

  const triggerAction = (action: "kick" | "punch" | "push") => {
    setChogAnimation(action)
    setBagAnimation("sway")
    setPunchCount(prev => prev + 1)
    
    setTimeout(() => {
      setChogAnimation("idle")
      setBagAnimation("idle")
    }, 500)
  }

  const claimReward = async () => {
    if (!address) return alert("Connect wallet first")
    try {
      const tx = await writeContractAsync({
        abi: chogPunchABI,
        address: "0xa1d54f8a426b3cd07625627071e70c8f76e49806",
        functionName: "submitScore",
        args: [20],
      })
      console.log("Claimed:", tx)
      alert("✅ 1 MON claimed successfully!")
    } catch (err) {
      console.error("Claim error", err)
      alert("❌ Claim failed. Try again.")
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white">
      {/* Background brick pattern */}
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
        <h1 className="text-6xl font-bold text-orange-400 tracking-wider text-center drop-shadow-lg">
          CHOG GYM
        </h1>
      </div>

      {mode === "home" && (
        <>
          {/* Main fighting scene */}
          <div className="flex items-center justify-center h-screen relative px-8">
            {/* CHOG Character */}
            <div 
              ref={chogRef}
              className={`relative transition-all duration-300 ${
                chogAnimation === "punch" ? "animate-punch" : 
                chogAnimation === "kick" ? "animate-kick" : 
                chogAnimation === "push" ? "animate-push" : 
                "animate-pulse"
              }`}
            >
              <div className="relative w-40 h-48">
                {/* Hair - spiky purple */}
                <div 
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-purple-600 rounded-t-full border-2 border-purple-700" 
                  style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 90% 80%, 70% 100%, 30% 100%, 10% 80%, 0% 50%)'}} 
                />
                
                {/* Face */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-100 rounded-full border-3 border-black shadow-lg">
                  {/* Eyes - dynamic based on action */}
                  <div className={`absolute top-5 left-4 w-4 h-4 bg-black rounded-full transition-all ${
                    chogAnimation !== "idle" ? "scale-75 -translate-y-1" : ""
                  }`}>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className={`absolute top-5 right-4 w-4 h-4 bg-black rounded-full transition-all ${
                    chogAnimation !== "idle" ? "scale-75 -translate-y-1" : ""
                  }`}>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Eyebrows - angry when fighting */}
                  <div className={`absolute top-2 left-3 w-5 h-1 bg-black transition-all ${
                    chogAnimation !== "idle" ? "-rotate-45 scale-110" : "-rotate-12"
                  }`} />
                  <div className={`absolute top-2 right-3 w-5 h-1 bg-black transition-all ${
                    chogAnimation !== "idle" ? "rotate-45 scale-110" : "rotate-12"
                  }`} />
                  
                  {/* Nose */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-300 rounded"></div>
                  
                  {/* Mouth - opens when fighting */}
                  <div className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full transition-all ${
                    chogAnimation !== "idle" ? "w-4 h-3" : "w-3 h-2"
                  }`} />
                  
                  {/* Blush */}
                  <div className="absolute top-8 left-2 w-3 h-3 bg-red-300 rounded-full opacity-60" />
                  <div className="absolute top-8 right-2 w-3 h-3 bg-red-300 rounded-full opacity-60" />
                  
                  {/* Sweat drops when fighting */}
                  {chogAnimation !== "idle" && (
                    <>
                      <div className="absolute top-3 left-1 w-1 h-2 bg-blue-200 rounded-full opacity-80"></div>
                      <div className="absolute top-4 right-1 w-1 h-2 bg-blue-200 rounded-full opacity-80"></div>
                    </>
                  )}
                </div>

                {/* Body - orange gym shirt */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-orange-500 rounded-lg border-2 border-orange-600 shadow-md">
                  <div className="text-center text-white font-bold text-sm pt-3">
                    CHOG<br/>GYM
                  </div>
                </div>

                {/* Arms - move based on action */}
                <div className={`absolute top-18 w-7 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "punch" ? "-left-8 -rotate-45 scale-110" : 
                  chogAnimation === "push" ? "-left-6 rotate-12 scale-105" : 
                  chogAnimation === "kick" ? "-left-4 -rotate-12" :
                  "-left-3"
                }`} />
                <div className={`absolute top-18 w-7 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "punch" ? "-right-8 rotate-45 scale-110" : 
                  chogAnimation === "push" ? "-right-6 -rotate-12 scale-105" : 
                  chogAnimation === "kick" ? "-right-4 rotate-12" :
                  "-right-3"
                }`} />
                
                {/* Boxing gloves - red with impact effect */}
                <div className={`absolute top-16 w-10 h-10 bg-red-500 rounded-full border-3 border-red-700 shadow-lg transition-all ${
                  chogAnimation === "punch" ? "-left-12 scale-125 shadow-xl" : 
                  chogAnimation === "push" ? "-left-8 scale-110" : 
                  "-left-6"
                }`}>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full opacity-70"></div>
                </div>
                <div className={`absolute top-16 w-10 h-10 bg-red-500 rounded-full border-3 border-red-700 shadow-lg transition-all ${
                  chogAnimation === "punch" ? "-right-12 scale-125 shadow-xl" : 
                  chogAnimation === "push" ? "-right-8 scale-110" : 
                  "-right-6"
                }`}>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full opacity-70"></div>
                </div>

                {/* Shorts - black */}
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-black rounded-lg border-2 border-gray-800 shadow-md" />

                {/* Legs - kick animation */}
                <div className={`absolute left-3 w-6 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "kick" ? "rotate-45 translate-x-3 -translate-y-3 scale-110" : ""
                }`} style={{top: '152px'}} />
                <div className="absolute right-3 w-6 h-16 bg-yellow-100 rounded-full border-2 border-black" style={{top: '152px'}} />

                {/* Shoes - red with kick effect */}
                <div className={`absolute bottom-0 left-2 w-10 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-md transition-all ${
                  chogAnimation === "kick" ? "translate-x-6 -translate-y-4 scale-125 shadow-xl" : ""
                }`} />
                <div className="absolute bottom-0 right-2 w-10 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-md" />
              </div>
            </div>

            {/* Punching Bag */}
            <div 
              ref={bagRef}
              className={`ml-20 relative transition-all duration-500 ${
                bagAnimation === "sway" ? 
                  chogAnimation === "punch" ? "animate-sway rotate-12 scale-105" :
                  chogAnimation === "kick" ? "animate-sway rotate-8 -translate-y-2" :
                  chogAnimation === "push" ? "animate-sway rotate-10 translate-x-2" :
                  "animate-sway rotate-4" : 
                "hover:rotate-1"
              }`}
            >
              {/* Chain */}
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-24 bg-gray-600 relative shadow-md">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-4 h-3 bg-gray-500 border border-gray-700 rounded-sm shadow-sm" 
                      style={{top: `${i * 2}px`, left: '-1px'}} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Bag - realistic red leather */}
              <div className="w-28 h-40 bg-gradient-to-b from-red-500 to-red-700 rounded-lg border-4 border-red-800 relative shadow-2xl">
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-red-600 rounded-full" />
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-red-600 rounded-full" />
                
                {/* Leather texture lines */}
                <div className="absolute top-8 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-16 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-24 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-32 left-2 right-2 h-px bg-red-400 opacity-50" />
                
                {/* Shine effect */}
                <div className="absolute top-6 left-3 w-6 h-12 bg-gradient-to-b from-red-300 to-transparent rounded-full opacity-60" />
                
                {/* Impact effect */}
                {bagAnimation === "sway" && (
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75" />
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse absolute top-1.5 left-1.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="absolute inset-x-0 top-2/3 flex justify-center">
            <button
              onClick={() => setMode("play")}
              className="px-16 py-5 bg-orange-500 text-white text-3xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 border-4 border-orange-400"
            >
              PLAY
            </button>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <a 
              href="https://farcaster.xyz/doteth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-gray-300 transition-colors underline"
            >
              built by @doteth
            </a>
          </div>
        </>
      )}

      {mode === "play" && (
        <>
          {/* Back button */}
          <button
            onClick={() => setMode("home")}
            className="absolute top-6 left-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors z-20 border-2 border-gray-600"
          >
            ← Back
          </button>

          {/* Hit counter */}
          <div className="absolute top-6 right-6 text-white text-2xl font-bold z-20 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            Hits: {punchCount}/20
          </div>

          {/* Main fighting scene - same as home but with gasping */}
          <div className="flex items-center justify-center h-screen relative px-8">
            {/* CHOG Character - gasping */}
            <div 
              ref={chogRef}
              className={`relative transition-all duration-300 ${
                chogAnimation === "punch" ? "animate-punch" : 
                chogAnimation === "kick" ? "animate-kick" : 
                chogAnimation === "push" ? "animate-push" : 
                "animate-pulse"
              }`}
            >
              <div className="relative w-40 h-48">
                {/* Same character as home but with gasping animation */}
                <div 
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-purple-600 rounded-t-full border-2 border-purple-700" 
                  style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 90% 80%, 70% 100%, 30% 100%, 10% 80%, 0% 50%)'}} 
                />
                
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-100 rounded-full border-3 border-black shadow-lg">
                  {/* Eyes - tired look */}
                  <div className="absolute top-5 left-4 w-4 h-4 bg-black rounded-full">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-5 right-4 w-4 h-4 bg-black rounded-full">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Eyebrows - focused */}
                  <div className="absolute top-2 left-3 w-5 h-1 bg-black -rotate-12" />
                  <div className="absolute top-2 right-3 w-5 h-1 bg-black rotate-12" />
                  
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-300 rounded"></div>
                  
                  {/* Mouth - gasping */}
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  
                  <div className="absolute top-8 left-2 w-3 h-3 bg-red-300 rounded-full opacity-60" />
                  <div className="absolute top-8 right-2 w-3 h-3 bg-red-300 rounded-full opacity-60" />
                  
                  {/* Sweat drops - always visible */}
                  <div className="absolute top-3 left-1 w-1 h-2 bg-blue-200 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute top-4 right-1 w-1 h-2 bg-blue-200 rounded-full opacity-80 animate-pulse"></div>
                </div>

                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-orange-500 rounded-lg border-2 border-orange-600 shadow-md">
                  <div className="text-center text-white font-bold text-sm pt-3">
                    CHOG<br/>GYM
                  </div>
                </div>

                <div className={`absolute top-18 w-7 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "punch" ? "-left-8 -rotate-45 scale-110" : 
                  chogAnimation === "push" ? "-left-6 rotate-12 scale-105" : 
                  chogAnimation === "kick" ? "-left-4 -rotate-12" :
                  "-left-3"
                }`} />
                <div className={`absolute top-18 w-7 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "punch" ? "-right-8 rotate-45 scale-110" : 
                  chogAnimation === "push" ? "-right-6 -rotate-12 scale-105" : 
                  chogAnimation === "kick" ? "-right-4 rotate-12" :
                  "-right-3"
                }`} />
                
                <div className={`absolute top-16 w-10 h-10 bg-red-500 rounded-full border-3 border-red-700 shadow-lg transition-all ${
                  chogAnimation === "punch" ? "-left-12 scale-125 shadow-xl" : 
                  chogAnimation === "push" ? "-left-8 scale-110" : 
                  "-left-6"
                }`}>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full opacity-70"></div>
                </div>
                <div className={`absolute top-16 w-10 h-10 bg-red-500 rounded-full border-3 border-red-700 shadow-lg transition-all ${
                  chogAnimation === "punch" ? "-right-12 scale-125 shadow-xl" : 
                  chogAnimation === "push" ? "-right-8 scale-110" : 
                  "-right-6"
                }`}>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full opacity-70"></div>
                </div>

                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-black rounded-lg border-2 border-gray-800 shadow-md" />

                <div className={`absolute left-3 w-6 h-16 bg-yellow-100 rounded-full border-2 border-black transition-all ${
                  chogAnimation === "kick" ? "rotate-45 translate-x-3 -translate-y-3 scale-110" : ""
                }`} style={{top: '152px'}} />
                <div className="absolute right-3 w-6 h-16 bg-yellow-100 rounded-full border-2 border-black" style={{top: '152px'}} />

                <div className={`absolute bottom-0 left-2 w-10 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-md transition-all ${
                  chogAnimation === "kick" ? "translate-x-6 -translate-y-4 scale-125 shadow-xl" : ""
                }`} />
                <div className="absolute bottom-0 right-2 w-10 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-md" />
              </div>
            </div>

            {/* Punching Bag - same as home */}
            <div 
              ref={bagRef}
              className={`ml-20 relative transition-all duration-500 ${
                bagAnimation === "sway" ? 
                  chogAnimation === "punch" ? "animate-sway rotate-12 scale-105" :
                  chogAnimation === "kick" ? "animate-sway rotate-8 -translate-y-2" :
                  chogAnimation === "push" ? "animate-sway rotate-10 translate-x-2" :
                  "animate-sway rotate-4" : 
                "animate-pulse"
              }`}
            >
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-24 bg-gray-600 relative shadow-md">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-4 h-3 bg-gray-500 border border-gray-700 rounded-sm shadow-sm" 
                      style={{top: `${i * 2}px`, left: '-1px'}} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="w-28 h-40 bg-gradient-to-b from-red-500 to-red-700 rounded-lg border-4 border-red-800 relative shadow-2xl">
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-red-600 rounded-full" />
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-red-600 rounded-full" />
                
                <div className="absolute top-8 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-16 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-24 left-2 right-2 h-px bg-red-400 opacity-50" />
                <div className="absolute top-32 left-2 right-2 h-px bg-red-400 opacity-50" />
                
                <div className="absolute top-6 left-3 w-6 h-12 bg-gradient-to-b from-red-300 to-transparent rounded-full opacity-60" />
                
                {bagAnimation === "sway" && (
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75" />
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse absolute top-1.5 left-1.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action text */}
          {actionText && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-yellow-400 animate-bounce z-30 drop-shadow-lg">
              {actionText}!
            </div>
          )}

          {/* Joystick Control */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <div 
              ref={joystickRef}
              className="relative w-24 h-24 bg-gray-800 rounded-full border-4 border-gray-700 shadow-2xl"
              onMouseDown={handleJoystickMove}
              onTouchStart={handleJoystickMove}
            >
              <div 
                className={`absolute w-12 h-12 bg-orange-500 rounded-full border-3 border-orange-400 shadow-lg transition-all duration-100 ${
                  isJoystickActive ? 'scale-110 bg-orange-400' : ''
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
                }}
              />
              
              {/* Direction indicators */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">KICK</div>
              <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-white text-xs font-bold">PUSH</div>
              <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-white text-xs font-bold">PUNCH</div>
            </div>
          </div>

          {/* Claim button */}
          {punchCount >= 20 && (
            <div className="absolute inset-x-0 top-1/2 flex justify-center z-40">
              <button
                onClick={claimReward}
                className="px-12 py-5 bg-green-500 text-white text-2xl font-bold rounded-full hover:bg-green-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 animate-pulse border-4 border-green-400"
              >
                Claim 1 MON
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}