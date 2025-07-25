import { useState, useRef, useEffect } from "react"

interface Props {
  onDirection: (direction: "kick" | "punch" | "push") => void
}

export default function Joystick({ onDirection }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>("")
  const joystickRef = useRef<HTMLDivElement>(null)

  const maxDistance = 60 // Maximum distance from center

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    updatePosition(clientX, clientY)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    updatePosition(clientX, clientY)
  }

  const handleEnd = () => {
    setIsDragging(false)
    setPos({ x: 0, y: 0 })
    setCurrentAction("")
  }

  const updatePosition = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let deltaX = clientX - centerX
    let deltaY = clientY - centerY

    // Limit the distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > maxDistance) {
      deltaX = (deltaX / distance) * maxDistance
      deltaY = (deltaY / distance) * maxDistance
    }

    setPos({ x: deltaX, y: deltaY })

    // Determine direction and action
    const angle = Math.atan2(-deltaY, deltaX) * (180 / Math.PI)
    let action = ""

    if (distance > 20) { // Only trigger if moved significantly
      if (angle >= -135 && angle <= -45) {
        // Up direction - KICK
        action = "KICK"
        onDirection("kick")
      } else if (angle >= 45 && angle <= 135) {
        // Down direction - no action
        action = ""
      } else if (angle >= -45 && angle <= 45) {
        // Right direction - PUNCH
        action = "PUNCH"
        onDirection("punch")
      } else {
        // Left direction - PUSH
        action = "PUSH"
        onDirection("push")
      }
    }

    setCurrentAction(action)
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

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="absolute bottom-20 right-12 select-none">
      {/* Action label */}
      {currentAction && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-bold">
          {currentAction}
        </div>
      )}
      
      {/* Outer circle - the trigger base */}
      <div 
        ref={joystickRef}
        className="relative w-32 h-32 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full border-4 border-gray-600 shadow-2xl cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Direction indicators */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-60">
          KICK
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-60">
          ↓
        </div>
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-xs font-bold opacity-60 rotate-90">
          PUSH
        </div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-xs font-bold opacity-60 -rotate-90">
          PUNCH
        </div>

        {/* Inner circle - the moveable part */}
        <div 
          className="absolute w-12 h-12 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full border-2 border-orange-300 shadow-lg transition-all duration-100 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${40 + pos.x}px, ${40 + pos.y}px)`,
            boxShadow: isDragging ? '0 0 20px rgba(255, 165, 0, 0.6)' : '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Inner highlight */}
          <div className="absolute top-1 left-1 w-3 h-3 bg-orange-200 rounded-full opacity-70"></div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  )
}
