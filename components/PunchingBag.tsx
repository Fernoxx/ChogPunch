import React, { useEffect, useRef, useState } from 'react';
import { PhysicsEngine } from '@/lib/physics/PhysicsEngine';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Matter from 'matter-js';

interface PunchingBagProps {
  physicsEngine: PhysicsEngine;
  onHit?: (damage: number) => void;
}

interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
}

const PunchingBagComponent = React.forwardRef<any, PunchingBagProps>(({ physicsEngine, onHit }, ref) => {
  const [bagPosition, setBagPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [isHit, setIsHit] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [bagHealth, setBagHealth] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateBagPosition = () => {
      const bag = physicsEngine.getBody('punchingBag');
      if (bag?.body) {
        setBagPosition({
          x: bag.body.position.x,
          y: bag.body.position.y,
          rotation: bag.body.angle
        });
      }
    };

    const interval = setInterval(updateBagPosition, 16); // 60 FPS
    return () => clearInterval(interval);
  }, [physicsEngine]);

  // Particle effect on hit
  const createHitEffect = (x: number, y: number, damage: number) => {
    // Screen shake effect
    document.body.style.transform = 'translate(2px, 2px)';
    setTimeout(() => {
      document.body.style.transform = 'translate(-2px, -2px)';
    }, 50);
    setTimeout(() => {
      document.body.style.transform = 'translate(0, 0)';
    }, 100);

    // Damage number
    const id = Date.now().toString();
    setDamageNumbers(prev => [...prev, { id, value: damage, x, y }]);
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1000);

    // Particle burst
    if (damage > 10) {
      confetti({
        particleCount: damage * 2,
        spread: 70,
        origin: { 
          x: x / window.innerWidth, 
          y: y / window.innerHeight 
        },
        colors: ['#ff0000', '#ff6600', '#ffaa00'],
        ticks: 30,
        gravity: 1.5,
        scalar: 0.8,
        shapes: ['circle'],
        disableForReducedMotion: true
      });
    }

    setIsHit(true);
    setTimeout(() => setIsHit(false), 200);
    
    setBagHealth(prev => Math.max(0, prev - damage));
    onHit?.(damage);
  };

  // Expose createHitEffect to parent
  React.useImperativeHandle(ref, () => ({
    createHitEffect
  }));

  // Draw chain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw chain
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(bagPosition.x, 50); // Ceiling attachment point
      
      // Create chain curve
      const controlX = bagPosition.x + Math.sin(bagPosition.rotation) * 30;
      const controlY = (50 + bagPosition.y) / 2;
      
      ctx.quadraticCurveTo(controlX, controlY, bagPosition.x, bagPosition.y - 75);
      ctx.stroke();
      
      // Draw chain links
      const linkCount = 5;
      for (let i = 0; i <= linkCount; i++) {
        const t = i / linkCount;
        const x = (1 - t) * (1 - t) * bagPosition.x + 2 * (1 - t) * t * controlX + t * t * bagPosition.x;
        const y = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * controlY + t * t * (bagPosition.y - 75);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#444';
        ctx.fill();
      }

      requestAnimationFrame(render);
    };

    render();
  }, [bagPosition]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />
      
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: bagPosition.x - 60,
          top: bagPosition.y - 100,
          width: 120,
          height: 200,
          zIndex: 8
        }}
        animate={{
          rotate: bagPosition.rotation * 180 / Math.PI,
          scale: isHit ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { type: "spring", stiffness: 100, damping: 10 },
          scale: { duration: 0.2 }
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/punchingbag.png"
            alt="Punching Bag"
            fill
            className="object-contain"
            priority
          />
          
          {/* Damage overlay */}
          <div 
            className="absolute inset-0 bg-red-500 rounded-lg mix-blend-multiply transition-opacity"
            style={{ opacity: (100 - bagHealth) / 200 }}
          />
          
          {/* Cracks effect */}
          {bagHealth < 50 && (
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="absolute inset-0">
                <path
                  d="M30,50 L35,80 L40,100 M80,60 L75,85 L70,110"
                  stroke="#333"
                  strokeWidth="2"
                  fill="none"
                  opacity={0.8}
                />
              </svg>
            </div>
          )}
        </div>

        {/* Impact ripple effect */}
        <AnimatePresence>
          {isHit && (
            <motion.div
              className="absolute inset-0 border-4 border-white rounded-full"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Health bar */}
      <div className="absolute top-4 right-4 w-64 bg-gray-800 rounded-full p-1" style={{ zIndex: 20 }}>
        <motion.div
          className="h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
          animate={{ width: `${bagHealth}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
          Bag Health: {bagHealth}%
        </div>
      </div>

      {/* Damage numbers */}
      <AnimatePresence>
        {damageNumbers.map(({ id, value, x, y }) => (
          <motion.div
            key={id}
            className="absolute text-yellow-300 font-bold text-3xl pointer-events-none"
            style={{ 
              left: x, 
              top: y,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              zIndex: 30
            }}
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{ y: -50, opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            -{value}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Shadow */}
      <motion.div
        className="absolute bg-black/40 rounded-full blur-lg"
        style={{
          left: bagPosition.x - 40,
          bottom: 40,
          width: 80,
          height: 20,
          zIndex: 1
        }}
        animate={{
          scaleX: 1 + Math.abs(Math.sin(bagPosition.rotation)) * 0.3,
          opacity: 0.4 - Math.abs(bagPosition.y - 300) / 1000
        }}
      />
    </>
  );
});

PunchingBagComponent.displayName = 'PunchingBag';

export const PunchingBag = PunchingBagComponent;

// Export hit detection helper
export const checkBagHit = (
  physicsEngine: PhysicsEngine,
  attackerPosition: { x: number; y: number },
  range: number,
  damage: number,
  onHit: (x: number, y: number, damage: number) => void
) => {
  const bag = physicsEngine.getBody('punchingBag');
  if (!bag) return false;

  const distance = Math.sqrt(
    Math.pow(bag.body.position.x - attackerPosition.x, 2) +
    Math.pow(bag.body.position.y - attackerPosition.y, 2)
  );

  if (distance < range) {
    // Apply force to bag
    const forceDirection = {
      x: (bag.body.position.x - attackerPosition.x) / distance,
      y: (bag.body.position.y - attackerPosition.y) / distance
    };

    Matter.Body.applyForce(bag.body, bag.body.position, {
      x: forceDirection.x * damage * 0.001,
      y: forceDirection.y * damage * 0.0005
    });

    onHit(bag.body.position.x, bag.body.position.y, damage);
    return true;
  }

  return false;
};