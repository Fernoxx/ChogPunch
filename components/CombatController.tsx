import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationState } from '@/lib/animation/AnimationController';

interface CombatControllerProps {
  onAttack: (move: AnimationState) => void;
  onBlock: () => void;
  onMove: (direction: 'left' | 'right') => void;
  onJump: () => void;
  comboProgress: number;
}

interface TouchPoint {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

export const CombatController: React.FC<CombatControllerProps> = ({
  onAttack,
  onBlock,
  onMove,
  onJump,
  comboProgress
}) => {
  const [touches, setTouches] = useState<Map<number, TouchPoint>>(new Map());
  const [lastGesture, setLastGesture] = useState<string>('');
  const [specialMoveCharge, setSpecialMoveCharge] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const gestureCanvasRef = useRef<HTMLCanvasElement>(null);

  // Gesture recognition
  const recognizeGesture = (touch: TouchPoint): string => {
    const deltaX = touch.currentX - touch.startX;
    const deltaY = touch.currentY - touch.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - touch.startTime;
    const velocity = distance / duration;

    // Quick tap
    if (distance < 30 && duration < 200) {
      return 'tap';
    }

    // Swipe detection
    if (distance > 50 && velocity > 0.5) {
      const angle = Math.atan2(deltaY, deltaX);
      const degrees = angle * 180 / Math.PI;

      if (degrees > -45 && degrees < 45) return 'swipe-right';
      if (degrees > 45 && degrees < 135) return 'swipe-down';
      if (degrees > -135 && degrees < -45) return 'swipe-up';
      return 'swipe-left';
    }

    // Hold detection
    if (duration > 500 && distance < 50) {
      return 'hold';
    }

    return '';
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const newTouches = new Map(touches);
    
    Array.from(e.changedTouches).forEach(touch => {
      newTouches.set(touch.identifier, {
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: Date.now()
      });
    });

    setTouches(newTouches);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const newTouches = new Map(touches);
    
    Array.from(e.changedTouches).forEach(touch => {
      const existingTouch = newTouches.get(touch.identifier);
      if (existingTouch) {
        existingTouch.currentX = touch.clientX;
        existingTouch.currentY = touch.clientY;
      }
    });

    setTouches(newTouches);
    drawGesturePath();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    Array.from(e.changedTouches).forEach(touch => {
      const touchData = touches.get(touch.identifier);
      if (touchData) {
        const gesture = recognizeGesture(touchData);
        executeGesture(gesture, touchData);
      }
    });

    const newTouches = new Map(touches);
    Array.from(e.changedTouches).forEach(touch => {
      newTouches.delete(touch.identifier);
    });
    setTouches(newTouches);
  };

  // Execute moves based on gestures
  const executeGesture = (gesture: string, touch: TouchPoint) => {
    setLastGesture(gesture);

    // Screen regions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isLeftSide = touch.startX < screenWidth / 2;
    const isUpperHalf = touch.startY < screenHeight / 2;

    switch (gesture) {
      case 'tap':
        if (isLeftSide) {
          onAttack(isUpperHalf ? 'punch1' : 'kick1');
        } else {
          onBlock();
        }
        break;

      case 'swipe-right':
        if (isLeftSide) {
          onMove('right');
        } else {
          onAttack('punch2');
        }
        break;

      case 'swipe-left':
        if (!isLeftSide) {
          onMove('left');
        } else {
          onAttack('punch2');
        }
        break;

      case 'swipe-up':
        if (isUpperHalf) {
          onJump();
        } else {
          onAttack('uppercut');
        }
        break;

      case 'swipe-down':
        onAttack('kick2');
        break;

      case 'hold':
        setSpecialMoveCharge(prev => Math.min(prev + 20, 100));
        if (specialMoveCharge >= 100) {
          onAttack('roundhouse');
          setSpecialMoveCharge(0);
        }
        break;
    }
  };

  // Draw gesture path
  const drawGesturePath = () => {
    const canvas = gestureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    touches.forEach(touch => {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(touch.startX, touch.startY);
      ctx.lineTo(touch.currentX, touch.currentY);
      ctx.stroke();

      // Draw touch point
      ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(touch.currentX, touch.currentY, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'a':
          onMove('left');
          break;
        case 'd':
          onMove('right');
          break;
        case 'w':
          onJump();
          break;
        case 'j':
          onAttack('punch1');
          break;
        case 'k':
          onAttack('kick1');
          break;
        case 'l':
          onBlock();
          break;
        case 'u':
          onAttack('uppercut');
          break;
        case 'i':
          onAttack('roundhouse');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAttack, onBlock, onMove, onJump]);

  return (
    <>
      {/* Gesture canvas */}
      <canvas
        ref={gestureCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 25 }}
      />

      {/* Touch areas */}
      <div
        className="absolute inset-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ zIndex: 24 }}
      />

      {/* Control hints */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-20 left-0 right-0 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ zIndex: 26 }}
          >
            <div className="bg-black/80 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4 text-white text-sm">
                <div>
                  <h3 className="font-bold mb-2">Left Side Controls:</h3>
                  <p>Tap: Quick Punch/Kick</p>
                  <p>Swipe →: Move Right</p>
                  <p>Swipe ↑: Jump</p>
                  <p>Hold: Charge Special</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Right Side Controls:</h3>
                  <p>Tap: Block</p>
                  <p>Swipe ←: Move Left</p>
                  <p>Swipe ↓: Low Kick</p>
                  <p>Complex gestures: Combos</p>
                </div>
              </div>
              <button
                className="mt-4 text-yellow-400 underline"
                onClick={() => setShowControls(false)}
              >
                Hide Controls
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special move charge indicator */}
      {specialMoveCharge > 0 && (
        <motion.div
          className="absolute bottom-40 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ zIndex: 27 }}
        >
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255, 255, 0, 0.3)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255, 255, 0, 1)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - specialMoveCharge / 100)}`}
                className="transition-all duration-200"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-yellow-400 font-bold">
              {Math.floor(specialMoveCharge)}%
            </div>
          </div>
        </motion.div>
      )}

      {/* Combo indicator */}
      {comboProgress > 0 && (
        <motion.div
          className="absolute top-32 left-4"
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          style={{ zIndex: 27 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-4 py-2">
            <p className="text-white font-bold">COMBO TIME!</p>
            <div className="w-full bg-white/30 rounded-full h-2 mt-1">
              <motion.div
                className="bg-white rounded-full h-2"
                animate={{ width: `${comboProgress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Last gesture indicator */}
      {lastGesture && (
        <motion.div
          key={lastGesture}
          className="absolute top-20 right-4 bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          style={{ zIndex: 27 }}
        >
          {lastGesture.toUpperCase()}
        </motion.div>
      )}

      {/* Control toggle button */}
      {!showControls && (
        <button
          className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-lg text-sm"
          onClick={() => setShowControls(true)}
          style={{ zIndex: 26 }}
        >
          Show Controls
        </button>
      )}
    </>
  );
};