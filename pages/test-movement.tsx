import React from 'react';
import { PlatformerGame } from '../components/PlatformerGame';

export default function TestMovement() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-20 bg-black/50 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Improved Character Movement</h2>
        <ul className="text-sm space-y-1">
          <li>✅ Realistic Mario-style running speed</li>
          <li>✅ Proper jump physics with variable height</li>
          <li>✅ Smooth running animations</li>
          <li>✅ Natural acceleration and deceleration</li>
        </ul>
        <div className="mt-3 text-xs opacity-75">
          Controls: A/D or ◀/▶ to move, W/Space to jump
        </div>
      </div>
      <PlatformerGame />
    </div>
  );
}