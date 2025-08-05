import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '@/lib/physics/PhysicsEngine';
import { AnimationController, AnimationState } from '@/lib/animation/AnimationController';
import Image from 'next/image';

interface FighterProps {
  physicsEngine: PhysicsEngine;
  animationController: AnimationController;
  x: number;
  y: number;
}

interface BodyPart {
  name: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
    sx: number;
    sh: number;
  };
}

export const Fighter: React.FC<FighterProps> = ({ physicsEngine, animationController, x, y }) => {
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // Load character image
    const img = new window.Image();
    img.src = '/chog.png';
    img.onload = () => {
      characterImage.current = img;
    };
  }, []);

  useEffect(() => {
    const updateBodyParts = () => {
      const bodies = physicsEngine.getAllBodies();
      const parts: BodyPart[] = [];
 
          crop: { sx: 10, sy: 140, sw: 25, sh: 50 }, // Left lower arm
          zIndex: 3,
          scale: { w: 18, h: 35 }
        },
        'fighter-rightUpperArm': { 
          crop: { sx: 150, sy: 90, sw: 30, sh: 60 }, // Right upper arm
          zIndex: 7,
          scale: { w: 20, h: 40 }
        },
        'fighter-leftUpperLeg': { 
          crop: { sx: 40, sy: 180, sw: 35, sh: 70 }, // Left upper leg
          zIndex: 4,
          scale: { w: 25, h: 50 }
    
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

    const ctx = canvas.getContext('2d');
    if (!ct
        ctx.save();
        
        // Translate to body part position
        ctx.translate(part.x, part.y);
        ctx.rotate(part.rotation);

        if (part.imageCrop && characterImage.current) {
          // Draw cropped section of character image
          try {
            ctx.drawImage(
              characterImage.current,
              part.imageCrop.sw,
              part.imageCrop.sh,
              -part.width / 2,
              -part.height / 2,
              part.width,
              part.height
            );
          } catch (e) {
            // Fallback to colored rectangles if image cropping fails
            ctx.fillStyle = part.name.includes('head') ? '#FFB6C1' : 
                           part.name.includes('arm') ? '#FF69B4' : 
                           part.name.includes('leg') ? '#8B4513' : '#FFA500';
            ctx.fillRect(-part.width / 2, -part.height / 2, part.width, part.height);
          }
        }

        ctx.restore();
      });

      requestAnimationFrame(render);
    };

    render();
  }, [bodyParts]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0"
    
        }}
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
      />
    </div>
  );
};
