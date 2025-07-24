import { useEffect, useState, useRef } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { createConfig, WagmiProvider, http } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
})

export default function Page() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChogGym />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function ChogGym() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  
  const [gameState, setGameState] = useState<'home' | 'playing'>('home')
  const [hitCount, setHitCount] = useState(0)
  const [chogAnimation, setChogAnimation] = useState<'idle' | 'punch' | 'kick' | 'push'>('idle')
  const [bagAnimation, setBagAnimation] = useState<'idle' | 'swing'>('idle')
  const [joystickActive, setJoystickActive] = useState(false)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [actionText, setActionText] = useState('')
  const [canClaim, setCanClaim] = useState(false)
  const [claimed, setClaimed] = useState(false)
  
  const joystickRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto gasping animation for CHOG
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (chogAnimation === 'idle') {
          setBagAnimation('swing')
          setTimeout(() => setBagAnimation('idle'), 500)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [gameState, chogAnimation])

  // Check if user can claim
  useEffect(() => {
    if (hitCount >= 20) {
      setCanClaim(true)
    }
  }, [hitCount])

  const handleAction = (action: 'punch' | 'kick' | 'push') => {
    setChogAnimation(action)
    setBagAnimation('swing')
    setHitCount(prev => prev + 1)
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    
    animationTimeoutRef.current = setTimeout(() => {
      setChogAnimation('idle')
      setBagAnimation('idle')
    }, 600)
  }

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setJoystickActive(true)
    
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
        const maxDistance = 30
        
        const limitedX = distance > maxDistance ? (deltaX / distance) * maxDistance : deltaX
        const limitedY = distance > maxDistance ? (deltaY / distance) * maxDistance : deltaY
        
        setJoystickPosition({ x: limitedX, y: limitedY })
        
        if (Math.abs(limitedY) > Math.abs(limitedX)) {
          if (limitedY < -15 && actionText !== 'KICK') {
            setActionText('KICK')
            handleAction('kick')
          }
        } else {
          if (limitedX < -15 && actionText !== 'PUSH') {
            setActionText('PUSH')
            handleAction('push')
          } else if (limitedX > 15 && actionText !== 'PUNCH') {
            setActionText('PUNCH')
            handleAction('punch')
          }
        }
      }
    }
    
    const handleEnd = () => {
      setJoystickActive(false)
      setJoystickPosition({ x: 0, y: 0 })
      setActionText('')
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

  const handleClaim = async () => {
    if (!address) return
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })

      const data = await res.json()
      if (data?.success) {
        setClaimed(true)
        setCanClaim(false)
        alert("✅ 1 MON sent to your wallet!")
      } else {
        alert("❌ Claim failed. Try again.")
      }
    } catch (error) {
      console.error('Claim error:', error)
      alert("❌ Claim failed. Try again.")
    }
  }

  // Connection screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-orange-400 mb-8 tracking-wider">
            CHOG GYM
          </h1>
          <div className="space-y-4">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="px-8 py-4 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
              >
                Connect with {connector.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Home screen
  if (gameState === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        {/* Brick wall pattern */}
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
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-6xl font-bold text-orange-400 tracking-wider text-center">
            CHOG GYM
          </h1>
        </div>

        {/* Main character and punching bag */}
        <div className="flex items-center justify-center h-screen relative">
          {/* CHOG Character */}
          <div className="relative">
            {/* Character body */}
            <div className="relative w-32 h-40">
              {/* Hair - spiky purple */}
              <div 
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-purple-600 rounded-t-full" 
                style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 60%, 70% 100%, 30% 100%, 0% 60%)'}} 
              />
              
              {/* Face */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-100 rounded-full border-2 border-black">
                {/* Eyes */}
                <div className="absolute top-4 left-3 w-3 h-3 bg-black rounded-full" />
                <div className="absolute top-4 right-3 w-3 h-3 bg-black rounded-full" />
                {/* Angry eyebrows */}
                <div className="absolute top-2 left-2 w-4 h-1 bg-black transform -rotate-12" />
                <div className="absolute top-2 right-2 w-4 h-1 bg-black transform rotate-12" />
                {/* Small mouth */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-500 rounded-full" />
                {/* Blush */}
                <div className="absolute top-6 left-1 w-2 h-2 bg-red-300 rounded-full opacity-60" />
                <div className="absolute top-6 right-1 w-2 h-2 bg-red-300 rounded-full opacity-60" />
              </div>

              {/* Body - Orange gym shirt */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-orange-500 rounded-lg">
                <div className="text-center text-white font-bold text-xs pt-2">
                  CHOG<br/>GYM
                </div>
              </div>

              {/* Arms */}
              <div className="absolute top-14 -left-2 w-6 h-12 bg-yellow-100 rounded-full border-2 border-black" />
              <div className="absolute top-14 -right-2 w-6 h-12 bg-yellow-100 rounded-full border-2 border-black" />
              
              {/* Boxing gloves - red */}
              <div className="absolute top-12 -left-4 w-8 h-8 bg-red-500 rounded-full border-2 border-black" />
              <div className="absolute top-12 -right-4 w-8 h-8 bg-red-500 rounded-full border-2 border-black" />

              {/* Shorts - black */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-black rounded-lg" />

              {/* Legs */}
              <div className="absolute left-2 w-5 h-12 bg-yellow-100 rounded-full border-2 border-black" style={{top: '120px'}} />
              <div className="absolute right-2 w-5 h-12 bg-yellow-100 rounded-full border-2 border-black" style={{top: '120px'}} />

              {/* Shoes - red */}
              <div className="absolute bottom-0 left-1 w-8 h-4 bg-red-500 rounded-full border-2 border-black" />
              <div className="absolute bottom-0 right-1 w-8 h-4 bg-red-500 rounded-full border-2 border-black" />
            </div>
          </div>

          {/* Punching Bag */}
          <div className="ml-16 relative">
            {/* Chain */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-20 bg-gray-600 relative">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-3 h-2 bg-gray-500 border border-gray-700 rounded-sm" 
                    style={{top: `${i * 2}px`, left: '-1px'}} 
                  />
                ))}
              </div>
            </div>
            
            {/* Bag - red */}
            <div className="w-24 h-32 bg-red-500 rounded-lg border-4 border-red-600 relative shadow-lg">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-red-600 rounded" />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-red-600 rounded" />
              {/* Shine effect */}
              <div className="absolute top-4 left-2 w-4 h-8 bg-red-400 rounded-full opacity-50" />
            </div>
          </div>
        </div>

        {/* Play Button */}
        <div className="absolute inset-x-0 top-2/3 flex justify-center">
          <button
            onClick={() => setGameState('playing')}
            className="px-12 py-4 bg-orange-500 text-white text-2xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            PLAY
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <a 
            href="https://farcaster.xyz/doteth" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 text-sm hover:text-gray-300 transition-colors"
          >
            built by @doteth
          </a>
        </div>
      </div>
    )
  }

  // Playing state
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      {/* Brick wall pattern */}
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

      {/* Back button */}
      <button
        onClick={() => setGameState('home')}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors z-10"
      >
        ← Back
      </button>

      {/* Hit counter */}
      <div className="absolute top-4 right-4 text-white text-xl font-bold z-10">
        Hits: {hitCount}/20
      </div>

      {/* CHOG GYM Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-bold text-orange-400 tracking-wider text-center">
          CHOG GYM
        </h1>
      </div>

      {/* Main character and punching bag */}
      <div className="flex items-center justify-center h-screen relative">
        {/* CHOG Character with animations */}
        <div className={`relative transition-transform duration-300 ${
          chogAnimation === 'punch' ? 'animate-pulse scale-110 translate-x-2' : 
          chogAnimation === 'kick' ? 'animate-bounce -translate-y-2' : 
          chogAnimation === 'push' ? 'translate-x-4 scale-105' : 
          'animate-breathing'
        }`}>
          {/* Same character structure as home but with dynamic expressions */}
          <div className="relative w-32 h-40">
            {/* Hair */}
            <div 
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-purple-600 rounded-t-full" 
              style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 60%, 70% 100%, 30% 100%, 0% 60%)'}} 
            />
            
            {/* Face with dynamic expressions */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-100 rounded-full border-2 border-black">
              {/* Eyes - squint when fighting */}
              <div className={`absolute top-4 left-3 w-3 h-3 bg-black rounded-full transition-transform ${
                chogAnimation !== 'idle' ? 'scale-75' : ''
              }`} />
              <div className={`absolute top-4 right-3 w-3 h-3 bg-black rounded-full transition-transform ${
                chogAnimation !== 'idle' ? 'scale-75' : ''
              }`} />
              
              {/* Eyebrows - more intense when fighting */}
              <div className={`absolute top-2 left-2 w-4 h-1 bg-black transition-transform ${
                chogAnimation !== 'idle' ? '-rotate-45 scale-110' : '-rotate-12'
              }`} />
              <div className={`absolute top-2 right-2 w-4 h-1 bg-black transition-transform ${
                chogAnimation !== 'idle' ? 'rotate-45 scale-110' : 'rotate-12'
              }`} />
              
              {/* Mouth - open when gasping/fighting */}
              <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full transition-all ${
                chogAnimation !== 'idle' ? 'w-3 h-2' : 'w-2 h-1'
              }`} />
              
              {/* Blush */}
              <div className="absolute top-6 left-1 w-2 h-2 bg-red-300 rounded-full opacity-60" />
              <div className="absolute top-6 right-1 w-2 h-2 bg-red-300 rounded-full opacity-60" />
            </div>

            {/* Body */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-orange-500 rounded-lg">
              <div className="text-center text-white font-bold text-xs pt-2">
                CHOG<br/>GYM
              </div>
            </div>

            {/* Arms with action-based movement */}
            <div className={`absolute top-14 w-6 h-12 bg-yellow-100 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'punch' ? '-left-6 -rotate-45' : 
              chogAnimation === 'push' ? '-left-4 rotate-12' : 
              '-left-2'
            }`} />
            <div className={`absolute top-14 w-6 h-12 bg-yellow-100 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'punch' ? '-right-6 rotate-45' : 
              chogAnimation === 'push' ? '-right-4 -rotate-12' : 
              '-right-2'
            }`} />
            
            {/* Boxing gloves */}
            <div className={`absolute top-12 w-8 h-8 bg-red-500 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'punch' ? '-left-8 scale-125' : 
              chogAnimation === 'push' ? '-left-6' : 
              '-left-4'
            }`} />
            <div className={`absolute top-12 w-8 h-8 bg-red-500 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'punch' ? '-right-8 scale-125' : 
              chogAnimation === 'push' ? '-right-6' : 
              '-right-4'
            }`} />

            {/* Shorts */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-black rounded-lg" />

            {/* Legs with kick animation */}
            <div className={`absolute left-2 w-5 h-12 bg-yellow-100 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'kick' ? 'rotate-45 translate-x-2' : ''
            }`} style={{top: '120px'}} />
            <div className="absolute right-2 w-5 h-12 bg-yellow-100 rounded-full border-2 border-black" style={{top: '120px'}} />

            {/* Shoes */}
            <div className={`absolute bottom-0 left-1 w-8 h-4 bg-red-500 rounded-full border-2 border-black transition-transform ${
              chogAnimation === 'kick' ? 'translate-x-4 -translate-y-2 scale-110' : ''
            }`} />
            <div className="absolute bottom-0 right-1 w-8 h-4 bg-red-500 rounded-full border-2 border-black" />
          </div>
        </div>

        {/* Punching Bag with swing animation */}
        <div className={`ml-16 relative transition-transform duration-500 ${
          bagAnimation === 'swing' ? 
            chogAnimation === 'punch' ? 'animate-swing-hard rotate-12' :
            chogAnimation === 'kick' ? 'animate-swing-kick rotate-6' :
            chogAnimation === 'push' ? 'animate-swing-push rotate-8' :
            'animate-swing-gentle rotate-3' : 
          'animate-sway'
        }`}>
          {/* Chain */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-20 bg-gray-600 relative">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-3 h-2 bg-gray-500 border border-gray-700 rounded-sm" 
                  style={{top: `${i * 2}px`, left: '-1px'}} 
                />
              ))}
            </div>
          </div>
          
          {/* Bag */}
          <div className="w-24 h-32 bg-red-500 rounded-lg border-4 border-red-600 relative shadow-lg">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-red-600 rounded" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-red-600 rounded" />
            {/* Shine effect */}
            <div className="absolute top-4 left-2 w-4 h-8 bg-red-400 rounded-full opacity-50" />
            
            {/* Impact effect */}
            {bagAnimation === 'swing' && (
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse absolute top-1 left-1" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action text */}
      {actionText && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-yellow-400 animate-bounce z-20">
          {actionText}!
        </div>
      )}

      {/* Joystick Control */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div 
          ref={joystickRef}
          className="relative w-20 h-20 bg-gray-700 rounded-full border-4 border-gray-600 shadow-lg joystick-container"
          onMouseDown={handleJoystickStart}
          onTouchStart={handleJoystickStart}
        >
          <div 
            className={`absolute w-8 h-8 bg-orange-500 rounded-full border-2 border-orange-600 transition-transform duration-100 ${
              joystickActive ? 'scale-110' : ''
            }`}
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
            }}
          />
          
          {/* Direction indicators */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs">KICK</div>
          <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 text-white text-xs">PUSH</div>
          <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 text-white text-xs">PUNCH</div>
        </div>
      </div>

      {/* Claim button */}
      {canClaim && !claimed && (
        <div className="absolute inset-x-0 top-1/2 flex justify-center z-30">
          <button
            onClick={handleClaim}
            className="px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
          >
            Claim 1 MON
          </button>
        </div>
      )}

      {claimed && (
        <div className="absolute inset-x-0 top-1/2 flex justify-center text-green-400 text-xl font-bold z-30">
          ✅ MON Claimed!
        </div>
      )}
    </div>
  )
}