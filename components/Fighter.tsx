import React, { useEffect, useState } from 'react';
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

export const Fighter: React.FC<FighterProps> = ({ physicsEngine, animationController }) => {
  const [position, setPosition] = useState({ x: 200, y: 400 });
  const [rotation, setRotation] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationState>('idle');
  const [facingRight, setFacingRight] = useState(true);

  useEffect(() => {
    const updatePosition = () => {
      const bodies = physicsEngine.getAllBodies();
      const torso = bodies.get('fighter-torso');
      
      if (torso && torso.body) {
        setPosition({
          x: torso.body.position.x,
          y: torso.body.position.y
        });
        setRotation(torso.body.angle);
        
        // Update facing direction based on velocity
        if (torso.body.velocity.x > 0.5) {
          setFacingRight(true);
        } else if (torso.body.velocity.x < -0.5) {
          setFacingRight(false);
        }
      }
      
      // Get current animation
      const state = animationController.getCurrentState();
      setCurrentAnimation(state);
    };

    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, [physicsEngine, animationController]);

  // Animation variants for different states
  const getAnimationVariant = () => {
    switch (currentAnimation) {
      case 'punch1':
      case 'punch2':
      case 'punch3':
        return { scale: 1.1, transition: { duration: 0.1 } };
      case 'kick1':
      case 'kick2':
        return { scale: 1.15, rotate: facingRight ? 10 : -10, transition: { duration: 0.15 } };
      case 'jump':
        return { y: -30, scale: 1.05, transition: { duration: 0.3 } };
      case 'hit':
        return { scale: 0.95, opacity: 0.8, transition: { duration: 0.1 } };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Fighter Character */}
      <motion.div
        className="absolute"
        style={{
          left: position.x - 75,
          top: position.y - 100,
          width: 150,
          height: 200,
          zIndex: 20,
          transform: `scaleX(${facingRight ? 1 : -1})`
        }}
        animate={{
          ...getAnimationVariant(),
          y: currentAnimation === 'idle' ? [0, -5, 0] : 0
        }}
        transition={{
          y: currentAnimation === 'idle' ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : undefined
        }}
      >
        <Image
          src="/chog.png"
          alt="CHOG Fighter"
          fill
          className="object-contain drop-shadow-2xl"
          priority
          style={{
            filter: currentAnimation === 'hit' ? 'brightness(1.5) hue-rotate(30deg)' : 
                   (currentAnimation.includes('punch') || currentAnimation.includes('kick')) ? 
                   'brightness(1.2) contrast(1.2)' : 'none',
            transform: `rotate(${rotation}rad)`
          }}
        />
        
        {/* Attack Effects */}
        {(currentAnimation.includes('punch') || currentAnimation.includes('kick')) && (
          <motion.div
            className="absolute"
            style={{
              right: facingRight ? -30 : 'auto',
              left: facingRight ? 'auto' : -30,
              top: currentAnimation.includes('punch') ? '30%' : '50%',
              width: 60,
              height: 60
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-400 to-orange-500 rounded-full blur-xl" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Shadow */}
      <div
        className="absolute bg-black/40 rounded-full blur-lg"
        style={{
          left: position.x - 40,
          top: position.y + 80,
          width: 80,
          height: 20,
          zIndex: 5,
          transform: `scaleX(${1 + Math.abs(position.y - 400) / 300})`
        }}
      />
      
      {/* Ground Impact Effect */}
      {currentAnimation === 'jump' && (
        <motion.div
          className="absolute"
          style={{
            left: position.x - 60,
            top: position.y + 70,
            width: 120,
            height: 40,
            zIndex: 4
          }}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-full h-full bg-white/20 rounded-full blur-xl" />
        </motion.div>
      )}
    </>
  );
};