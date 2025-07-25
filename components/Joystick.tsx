import { useState } from "react"

interface JoystickProps {
  onMove: (action: string) => void
  hits?: number
}

export default function Joystick({ onMove, hits = 0 }: JoystickProps) {
  const handleAction = (action: string) => {
    onMove(action)
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      {/* Hit counter */}
      <div className="text-center text-white text-lg font-bold mb-4">
        Hits: {hits}/20
      </div>
      
      {/* Control buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleAction("kick")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          KICK
        </button>
        <button
          onClick={() => handleAction("push")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          PUSH
        </button>
        <button
          onClick={() => handleAction("punch")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          PUNCH
        </button>
      </div>
    </div>
  )
}
