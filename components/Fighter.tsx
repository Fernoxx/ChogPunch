import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '@/lib/physics/PhysicsEngine';
import { AnimationController, AnimationState } from '@/lib/animation/AnimationController'

interface FighterProps {
  physicsEngine: PhysicsEngine;
  animationController: AnimationController;
  x: number;
}

export const Fighter: React.FC<FighterProps> = ({ physicsEngine, animationController, x, y }) => {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Load character image
    const img = new window.Image()

  useEffect(() => {
    const updateBodyParts = () => {
      const bodies = physicsEngine.getAllBodies();
      const parts: BodyPart[] = [];
 
          crop: { sx: 10, sy: 140, sw: 25, sh: 50 }, // Left lower arm
          zIndex: 3,
          scale: { w: 18, h: 35 }
    
        'fighter-rightUpperLeg': { 
          crop: { sx: 125, sy: 180, sw: 35, sh: 70 }, // Right upper leg
          zIndex: 2,
          scale: { w: 25, h: 50 }
        },
            name: key,
            x: body.position.x,
            y: body.position.y,
            rotation: body.angle,
        }
    const interval = setInterval(updateBodyParts, 16); // 60 FPS
    return () => clearInterval(interval);
  }, [physicsEngine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !characterImage.current) return;
          }
        }

        ctx.restore();
      });
    }
  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
    
        }}
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
      />
    </div>
  );
};
