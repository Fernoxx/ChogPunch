import { useState } from "react"

export default function Joystick({ onDirection }: { onDirection: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const bounds = e.currentTarget.getBoundingClientRect()
    const x = touch.clientX - bounds.left - 40
    const y = touch.clientY - bounds.top - 40
    setPos({ x, y })

    const dx = x - 40
    const dy = y - 40

    if (angle >= -135 && angle <= -45) onDirection() // Up = kick
    else if (angle >= -180 && angle <= -135 || angle >= 135) onDirection() // Left = push
    else if (angle >= -45 && angle <= 45) onDirection() // Right = punch
  }

  const reset = () => setPos({ x: 0, y: 0 })

  return (
    <div className="absolute bottom-20 right-12 w-40 h-40 rounded-full bg-white/20">
      <div
        className="w-20 h-20 bg-white rounded-full absolute"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        onTouchEnd={reset}
      />
    </div>
  )
}
