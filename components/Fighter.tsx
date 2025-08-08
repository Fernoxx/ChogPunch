import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '@/lib/physics/PhysicsEngine';
import { AnimationController, AnimationState } from '@/lib/animation/AnimationController';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FighterProps {
  physicsEngine: PhysicsEngine;
  animationController: AnimationController;
  x: number;
  y: number;
}

export const Fighter: React.FC<FighterProps> = ({ physicsEngine, animationController, x, y }) => {
  const [position, setPosition] = useState({ x, y });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  
  // Update position based on physics
  useEffect(() => {
    const updatePosition = () => {
      const fighterBody = physicsEngine.getBody('fighter');
      if (fighterBody?.body) {
        const newX = fighterBody.body.position.x;
        const newY = fighterBody.body.position.y;
        const vx = fighterBody.body.velocity.x;
        const vy = fighterBody.body.velocity.y;
        
        setPosition({ x: newX, y: newY });
        setVelocity({ x: vx, y: vy });
        
        // Determine movement state
        setIsMoving(Math.abs(vx) > 0.5);
        setIsJumping(vy < -0.5 || !fighterBody.body.isStatic);
        
        // Update facing direction
        if (vx > 0.5) setFacing(1);
        else if (vx < -0.5) setFacing(-1);
      }
    };

    const interval = setInterval(updatePosition, 16); // 60 FPS
    return () => clearInterval(interval);
  }, [physicsEngine]);

  // Determine animation state
  const getAnimationClass = () => {
    const currentState = animationController.getCurrentFrame();
    if (currentState) {
      if (animationController.isAttacking()) return 'attack';
      if (animationController.isBlocking()) return 'block';
    }
    
    if (isJumping) return 'jump';
    if (isMoving) return 'run';
    return 'idle';
  };

  const animationClass = getAnimationClass();

  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className={`fighter-sprite ${animationClass}`}
        style={{
          position: 'absolute',
          left: position.x - 50,
          top: position.y - 100,
          width: 100,
          height: 120,
          transform: `scaleX(${facing})`,
        }}
        animate={{
          x: [0, isMoving ? 2 : 0, 0],
          y: [0, isMoving ? -3 : -1, 0],
        }}
        transition={{
          duration: isMoving ? 0.3 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <style jsx>{`
          .fighter-sprite {
            transform-origin: center;
          }

          /* Idle animation - breathing */
          .fighter-sprite.idle {
            animation: idle-breathe 3s ease-in-out infinite;
          }

          @keyframes idle-breathe {
            0%, 100% { transform: scaleX(var(--facing, 1)) scaleY(1); }
            50% { transform: scaleX(var(--facing, 1)) scaleY(0.98); }
          }

          /* Running animation */
          .fighter-sprite.run {
            animation: run-cycle 0.4s steps(4) infinite;
          }

          @keyframes run-cycle {
            0% { transform: scaleX(var(--facing, 1)) translateY(0px) rotate(-1deg); }
            25% { transform: scaleX(var(--facing, 1)) translateY(-3px) rotate(0deg); }
            50% { transform: scaleX(var(--facing, 1)) translateY(0px) rotate(1deg); }
            75% { transform: scaleX(var(--facing, 1)) translateY(-3px) rotate(0deg); }
            100% { transform: scaleX(var(--facing, 1)) translateY(0px) rotate(-1deg); }
          }

          /* Jump animation */
          .fighter-sprite.jump {
            animation: jump-motion 0.5s ease-out;
          }

          @keyframes jump-motion {
            0% { transform: scaleX(var(--facing, 1)) scaleY(0.9) scaleX(1.1); }
            50% { transform: scaleX(var(--facing, 1)) scaleY(1.1) scaleX(0.9); }
            100% { transform: scaleX(var(--facing, 1)) scaleY(1) scaleX(1); }
          }

          /* Attack animation */
          .fighter-sprite.attack {
            animation: attack-motion 0.3s ease-out;
          }

          @keyframes attack-motion {
            0% { transform: scaleX(var(--facing, 1)) translateX(0px); }
            50% { transform: scaleX(var(--facing, 1)) translateX(10px) rotate(-5deg); }
            100% { transform: scaleX(var(--facing, 1)) translateX(0px); }
          }
        `}</style>
        <Image
          src="/chog.png"
          alt="Fighter"
          width={100}
          height={120}
          priority
          style={{
            imageRendering: 'crisp-edges',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            ['--facing' as any]: facing,
          }}
        />
      </motion.div>
      
      {/* Shadow effect */}
      <motion.div
        className="absolute bg-black/30 rounded-full blur-xl"
        style={{
          left: position.x - 40,
          bottom: 50,
          width: 80,
          height: 20,
        }}
        animate={{
          scaleX: [1, isMoving ? 1.3 : 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: isMoving ? 0.3 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
