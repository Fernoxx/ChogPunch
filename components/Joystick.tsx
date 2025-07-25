import { useState, useRef } from "react"

interface Props {
  onDirection: (dir: "kick" | "punch" | "push") => void
}

export default function Joystick({ onDirection }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentAction, setCurrentAction] = useState<"kick" | "punch" | "push" | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getActionFromPosition = (x: number, y: number) => {
    const angle = Math.atan2(y, x) * 180 / Math.PI
    const distance = Math.sqrt(x * x + y * y)
    
    if (distance < 20) return null
    
    // Define action zones
    if (angle >= -45 && angle <= 45) return "punch" // Right = punch
    else if (angle >= 45 && angle <= 135) return "kick" // Down = kick  
    else if (angle >= -135 && angle <= -45) return "kick" // Up = kick
    else return "push" // Left = push
  }

  const handleStart = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    setIsDragging(true)
    
    const bounds = containerRef.current.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    
    const x = clientX - centerX
    const y = clientY - centerY
    
    // Constrain to circle
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = 60
    const constrainedX = distance > maxDistance ? (x / distance) * maxDistance : x
    const constrainedY = distance > maxDistance ? (y / distance) * maxDistance : y
    
    setPos({ x: constrainedX, y: constrainedY })
    
    const action = getActionFromPosition(constrainedX, constrainedY)
    setCurrentAction(action)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return
    
    const bounds = containerRef.current.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    
    const x = clientX - centerX
    const y = clientY - centerY
    
    // Constrain to circle
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = 60
    const constrainedX = distance > maxDistance ? (x / distance) * maxDistance : x
    const constrainedY = distance > maxDistance ? (y / distance) * maxDistance : y
    
    setPos({ x: constrainedX, y: constrainedY })
    
    const action = getActionFromPosition(constrainedX, constrainedY)
    setCurrentAction(action)
  }

  const handleEnd = () => {
    if (currentAction) {
      onDirection(currentAction)
    }
    setIsDragging(false)
    setPos({ x: 0, y: 0 })
    setCurrentAction(null)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    handleMove(e.clientX, e.clientY)
  }

  return (
    <div className="absolute bottom-20 right-16 z-20">
      {/* Action Indicators */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
        <div className={`text-sm font-bold transition-all duration-200 ${
          currentAction === "kick" ? "text-red-400 scale-110" : "text-white/50"
        }`}>
          KICK
        </div>
      </div>
      
      <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-center">
        <div className={`text-sm font-bold transition-all duration-200 ${
          currentAction === "punch" ? "text-yellow-400 scale-110" : "text-white/50"
        }`}>
          PUNCH
        </div>
      </div>
      
      <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-center">
        <div className={`text-sm font-bold transition-all duration-200 ${
          currentAction === "push" ? "text-blue-400 scale-110" : "text-white/50"
        }`}>
          PUSH
        </div>
      </div>

      {/* Joystick Container */}
      <div 
        ref={containerRef}
        className={`relative w-32 h-32 rounded-full transition-all duration-200 ${
          isDragging ? "bg-white/30" : "bg-white/20"
        } border-2 border-white/40`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Joystick Knob */}
        <div
          className={`absolute w-12 h-12 rounded-full transition-all duration-100 ${
            currentAction === "punch" ? "bg-yellow-400" :
            currentAction === "kick" ? "bg-red-400" :
            currentAction === "push" ? "bg-blue-400" :
            "bg-white"
          } ${isDragging ? "shadow-2xl scale-110" : "shadow-lg"} 
          border-2 border-white/50`}
          style={{ 
            transform: `translate(${pos.x + 40}px, ${pos.y + 40}px)`,
            left: 0,
            top: 0
          }}
        />

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
      </div>

      {/* Instructions */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-white/70">Drag to fight</div>
      </div>
    </div>
  )
}
